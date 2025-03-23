import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { CandidatesService } from './candidates.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { GetUsersDto } from './dto/get.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('candidates')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Roles('admin')
export class CandidatesController {
  constructor(private service: CandidatesService) {}
   @Get()
   @UseGuards(RolesGuard)
   @Roles('admin')
   async getCandidates(@Query() query: GetUsersDto) {
     const { page, limit, connected_temple } = query;
     return this.service.getCandidates(page, limit, connected_temple);
   }
}
