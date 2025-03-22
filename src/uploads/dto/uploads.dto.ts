import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UploadFileDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Excel file to upload',
  })
  @IsNotEmpty()
  file: any;
}

export class ApproveFileDto {
  @ApiProperty({
    type: 'number',
    description: 'ID of the file to approve',
    example: 123,
  })
  @IsNotEmpty()
  id: number;
}

export class ParseFileDto {
  @ApiProperty({
    type: 'number',
    description: 'ID of the file to parse',
    example: 123,
  })
  @IsNotEmpty()
  id: number;
}
