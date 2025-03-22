import { Controller, Get, UseGuards } from '@nestjs/common';
import { CandidatesService } from './candidates.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';

@Controller('candidates')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class CandidatesController {
  constructor(private service: CandidatesService) {}

  @Get()
  findAll() {
    return this.service.all();
  }
}
