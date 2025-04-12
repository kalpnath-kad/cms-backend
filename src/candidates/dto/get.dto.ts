import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetUsersDto {
  @ApiPropertyOptional({ example: 1, description: 'Page number for pagination' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, description: 'Limit of users per page' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({ example: 'ISKCON Delhi', description: 'Filter by connected temple' })
  @IsOptional()
  @IsString()
  connected_temple?: string;

  // Additional filter fields
  @ApiPropertyOptional({ description: 'Filter by name (partial match)' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Filter by gender' })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiPropertyOptional({ description: 'Filter by phone number' })
  @IsOptional()
  @IsString()
  phone_number?: string;

  @ApiPropertyOptional({ description: 'Filter by address (partial match)' })
  @IsOptional()
  @IsString()
  present_address?: string;

  @ApiPropertyOptional({ description: 'Filter by uploadedFile ID' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  uploadedFileId?: number;
  
  @ApiPropertyOptional({ description: 'Search across multiple fields' })
  @IsOptional()
  @IsString()
  search?: string;
}