import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InitiatedCandidate } from './initiated-candidate.entity';
import { UploadedFile } from '../uploads/uploaded-file.entity';

@Injectable()
export class CandidatesService {
  constructor(@InjectRepository(InitiatedCandidate) private repo: Repository<InitiatedCandidate>) {}

  async bulkInsert(data: any[], file: UploadedFile) {
    const candidates = data.map(row => {
      return this.repo.create({
        name: row.name,
        date_of_birth: row.date_of_birth,
        gender: row.gender,
        phone_number: row.phone_number,
        present_address: row.present_address,
        connected_temple: row.connected_temple,
        uploadedFile: file,
      });
    });
    return this.repo.save(candidates);
  }

  async all() {
    return this.repo.find({ relations: ['uploadedFile'] });
  }
}
