import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';

export type ExcelUser = {
  firstName: string;
  lastName: string;
  email: string;
};

const SAMPLE_USERS: ExcelUser[] = [
  { firstName: 'John', lastName: 'Doe', email: 'johndoe123@test.com' },
  { firstName: 'Jane', lastName: 'Smith', email: 'janesmith456@test.com' }
];

export function ensureExcelFile(filePath: string): void {
  if (fs.existsSync(filePath)) {
    return;
  }

  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const worksheet = xlsx.utils.json_to_sheet(SAMPLE_USERS);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, 'Users');
  xlsx.writeFile(workbook, filePath);
  console.log(`Created sample Excel file at ${filePath}`);
}

export function readUsersFromExcel(filePath: string): ExcelUser[] {
  ensureExcelFile(filePath);

  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const rawRows = xlsx.utils.sheet_to_json<Record<string, unknown>>(workbook.Sheets[sheetName], {
    defval: ''
  });

  return rawRows
    .map(row => ({
      firstName: String(row.firstName ?? row.first_name ?? row['First Name'] ?? '').trim(),
      lastName: String(row.lastName ?? row.last_name ?? row['Last Name'] ?? '').trim(),
      email: String(row.email ?? row['Email'] ?? '').trim()
    }))
    .filter(user => user.firstName && user.lastName && user.email);
}
