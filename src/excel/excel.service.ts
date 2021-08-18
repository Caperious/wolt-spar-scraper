import { Injectable } from '@nestjs/common';
import { Workbook } from 'exceljs';
@Injectable()
export class ExcelService {
  async readFile<T = unknown>(inputPath: string): Promise<Workbook> {
    const workbook = new Workbook();
    return await workbook.xlsx.readFile(inputPath);
  }

  async writeFile<T = unknown>(outputPath: string, contents: Workbook): Promise<any> {
    await contents.xlsx.writeFile(outputPath);
  }


}
