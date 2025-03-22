import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InitiatedCandidate } from './initiated-candidate.entity';
import { CandidatesService } from './candidates.service';
import { CandidatesController } from './candidates.controller';

@Module({
  imports: [TypeOrmModule.forFeature([InitiatedCandidate])],
  providers: [CandidatesService],
  controllers: [CandidatesController],
  exports: [CandidatesService]
})
export class CandidatesModule {}
