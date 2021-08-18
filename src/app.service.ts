import { Injectable, Logger } from '@nestjs/common';
import { SparService } from './spar/spar.service';
import { ExcelService } from './excel/excel.service';
import { ConfigService } from '@nestjs/config';
import { resolve } from 'path';
import { WoltExcelHelper } from './excel/woltExcelHelper';

@Injectable()
export class AppService {
  private logger = new Logger(AppService.name);
  constructor(
    private sparService: SparService,
    private excelService: ExcelService,
    private configService: ConfigService,
  ) {}
  async scrapeSparProductInformation(): Promise<any> {
    try {
      const partialInputPath = this.configService.get('INPUT_FILE_PATH');
      const inputPath = resolve(partialInputPath);
      const excelInput = await this.excelService.readFile(inputPath);
      const rows = WoltExcelHelper.getRows(
        excelInput,
        excelInput.worksheets[0],
      );
      const ids: number[] = WoltExcelHelper.getFirstColumn(rows);

      const products = await this.sparService.scrapeProducts(ids);
      // const products = await this.sparService.scrapeProducts([
      //   11696,
      //   32506,
      //   555300,
      //   601256,
      // ]);

      const contents = await WoltExcelHelper.prepeareWorkbook(products);

      const outputPath = resolve(this.configService.get('OUTPUT_FILE_PATH'));
      await this.excelService.writeFile(outputPath, contents);
    } catch (e) {
      this.logger.error(e);
    }
  }
}
