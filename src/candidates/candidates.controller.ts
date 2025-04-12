import { Controller, Get, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { CandidatesService } from './candidates.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { GetUsersDto } from './dto/get.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('candidates')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Roles('admin')
export class CandidatesController {
  constructor(private service: CandidatesService) {}
  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin', 'user')
  async getCandidates(@Query() query: GetUsersDto) {
    return this.service.getCandidates(query);
  }

@Patch(':id')
@UseGuards(RolesGuard)
@Roles('admin', 'user') // Allow both admin and user roles
@ApiOperation({ summary: 'Update a candidate' })
@ApiParam({ name: 'id', description: 'Candidate ID' })
@ApiResponse({ status: 200, description: 'Candidate updated successfully' })
@ApiResponse({ status: 404, description: 'Candidate not found' })
async updateCandidate(
  @Param('id') id: number,
  @Body() updateCandidateDto: UpdateCandidateDto
) {
  return this.service.updateCandidate(id, updateCandidateDto);
}

@Get(':id')
@UseGuards(RolesGuard)
@Roles('admin', 'user') // Allow both admin and user roles
@ApiOperation({ summary: 'Get a single candidate by ID' })
@ApiParam({ name: 'id', description: 'Candidate ID' })
@ApiResponse({ status: 200, description: 'Candidate details' })
@ApiResponse({ status: 404, description: 'Candidate not found' })
async getCandidate(@Param('id') id: number) {
  return this.service.getCandidate(id);
}
}
