import { ApiTags, ApiConsumes, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { UploadFileDto, ApproveFileDto, ParseFileDto } from './dto/uploads.dto';
import { Controller, Get, Param, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { JwtAuthGuard } from 'src/common/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/common/roles.decorator';
import { RolesGuard } from 'src/common/roles.guard';
import { diskStorage } from 'multer';

@ApiTags('Uploads')
@ApiBearerAuth()
@Controller('uploads')
@UseGuards(JwtAuthGuard)
export class UploadsController {
  constructor(private service: UploadsService) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadFileDto })
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
    })
  }))
  upload(@UploadedFile() file: any, @Req() req) {
    console.log(req.user)
    return this.service.saveFile(file, req.user);
  }

  @Get('my-files')
  getFiles(@Req() req) {
    return this.service.getUserFiles(req.user.userId, req.user.role);
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Patch('approve/:id')
  approve(@Param() params: ApproveFileDto) {
    return this.service.approveFile(params.id);
  }

  @Get('parse/:id')
  parse(@Param() params: ParseFileDto) {
    return this.service.parseExcel(params.id);
  }
}
