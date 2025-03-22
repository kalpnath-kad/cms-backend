import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadedFile } from './uploaded-file.entity';
import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';
import { UsersModule } from '../users/users.module';
import { CandidatesModule } from '../candidates/candidates.module';

@Module({
  imports: [TypeOrmModule.forFeature([UploadedFile]), UsersModule, CandidatesModule],
  providers: [UploadsService],
  controllers: [UploadsController],
  exports: [UploadsService]
})
export class UploadsModule {}
