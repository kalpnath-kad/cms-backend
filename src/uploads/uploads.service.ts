import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadedFile } from './uploaded-file.entity';
import { Repository } from 'typeorm';
import * as XLSX from 'xlsx';
import { CandidatesService } from '../candidates/candidates.service';
import { validateExcel } from 'src/shared/utils/excel.util';

@Injectable()
export class UploadsService {
  constructor(
    @InjectRepository(UploadedFile) public repo: Repository<UploadedFile>,
    private candidatesService: CandidatesService
  ) {}

  async saveFile(file: any, user: any) {
    await validateExcel(file.path); 
    const uploaded = this.repo.create({
      fileName: file.originalname,
      filePath: file.path,
      uploader: { id: user.userId }
    });
    return this.repo.save(uploaded);
  }

  async getUserFiles(userId: number, role: string) {
    if (role === 'admin') {
      return this.repo.find({ relations: ['uploader'] });
    }
    return this.repo.find({ where: { uploader: { id: userId } }, relations: ['uploader'] });
  }

  async parseExcel(filePath: any) {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    return data;
  }

  async approveFile(fileId: number) {
    const file = await this.repo.findOne({ where: { id: fileId }, relations: ['uploader'] });
    if (!file) throw new NotFoundException('File not found');

    const data = await this.parseExcel(file.filePath);

    // Insert parsed data into candidates table
    await this.candidatesService.bulkInsert(data, file);

    file.status = 'approved';
    return this.repo.save(file);
  }

  // async generateExcelForApproved(id: any): Promise<Buffer> {
  //   const upload = await this.repo.findOne({ where: { id }, relations: ['user'] });
  //   if (!upload || upload.status !== 'approved') throw new NotFoundException('Approved upload not found');

  //   const candidates = await this.candidatesService.find({ where: { uploadedBy: upload.user } });

  //   const worksheet = XLSX.utils.json_to_sheet(candidates);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, 'Approved Data');
  //   const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

  //   return buffer;
  // }
}
