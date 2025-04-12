import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString } from 'class-validator';

export class UpdateCandidateDto {
  @ApiPropertyOptional({ description: 'Candidate name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Date of birth' })
  @IsOptional()
  @IsDateString()
  date_of_birth?: string;

  @ApiPropertyOptional({ description: 'Gender' })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiPropertyOptional({ description: 'Phone number' })
  @IsOptional()
  @IsString()
  phone_number?: string;

  @ApiPropertyOptional({ description: 'Present address' })
  @IsOptional()
  @IsString()
  present_address?: string;

  @ApiPropertyOptional({ description: 'Connected temple' })
  @IsOptional()
  @IsString()
  connected_temple?: string;
}