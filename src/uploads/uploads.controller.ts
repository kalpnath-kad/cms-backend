import { Controller, Post, UseInterceptors, UploadedFile, UseGuards, Req, Get, Param, Patch } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { UploadsService } from './uploads.service';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';

@Controller('uploads')
@UseGuards(JwtAuthGuard)
export class UploadsController {
  constructor(private service: UploadsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
    })
  }))
  upload(@UploadedFile() file: any, @Req() req) {
    return this.service.saveFile(file, req.user);
  }

  @Get('my-files')
  getFiles(@Req() req) {
    return this.service.getUserFiles(req.user.userId, req.user.role);
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Patch('approve/:id')
  approve(@Param('id') id: number) {
    return this.service.approveFile(id);
  }

  @Get('parse/:id')
  async parse(@Param('id') id: number) {
    const file = await this.service.repo.findOne({ where: { id }, relations: ['uploader'] });
    return this.service.parseExcel(file.filePath);
  }

  // @Get(':id/download')
  // @Roles('admin')
  // async downloadApproved(@Param('id') id: string, @Res() res: Response) {
  //   const buffer = await this.service.generateExcelForApproved(id);
  //   res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  //   res.setHeader('Content-Disposition', 'attachment; filename=approved_data.xlsx');
  //   return res.send(buffer);
  // }
}
