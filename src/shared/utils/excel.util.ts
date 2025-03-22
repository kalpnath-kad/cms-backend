import * as xlsx from 'xlsx';
import { BadRequestException } from '@nestjs/common';

const REQUIRED_COLUMNS = [
  'name', 
  'date_of_birth', 
  'gender', 
  'phone_number', 
  'present_address', 
  'connected_temple'
];

export async function validateExcel(filePath: string) {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const jsonData = xlsx.utils.sheet_to_json(sheet, { header: 1 });

  const headers: string[] = jsonData[0] as string[];

  // Validate headers
  const missingFields = REQUIRED_COLUMNS.filter(col => !headers.includes(col));

  if (missingFields.length > 0) {
    throw new BadRequestException(`Missing columns: ${missingFields.join(', ')}`);
  }

  return jsonData;
}
