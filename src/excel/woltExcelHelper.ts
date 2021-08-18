import { Workbook, Worksheet } from 'exceljs';

export class WoltExcelHelper {
  static getRows(workbook: Workbook, worksheet: Worksheet) {
    const book = [];
    workbook.eachSheet(sheet => {
      const sheets = [];
      let firstRow = true;
      worksheet.eachRow(row => {
        if (!firstRow) {
          sheets.push(row.values);
        } else {
          firstRow = false;
        }
      });
      book.push(...sheets);
    });
    return book;
  }

  static getFirstColumn(rows) {
    return rows.map(row => row[1]);
  }

  static prepeareWorkbook(contents): Workbook {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Scraped products');

    const remapValues = {
      'Ime': 'name',
      'Številka izdelka': 'id',
      'DDV': 'vat',
      'Cena': 'price',
    }
    const columns = [
      'Številka izdelka',
      'url',
      'Ime',
      'Cena',
      'DDV',
      'Opis',
      'Shranjevanje',
      'Temperatura za hranjenje',
      'Sestavine',
      'Alergeni',
      'Navodila za uporabo',
      'Vsebnost alkohola',
      'Neto količina',
      'Povprečna hranilna vrednost na',
      'kcal',
      'kJ',
      'Maščobe',
      'od tega nasičene maščobe',
      'Ogljikovi hidrati',
      'od tega sladkorji',
      'Beljakovine',
      'Sol',]
    worksheet.addRow(columns);

    for (const product of contents) {
      const productRow = [];
      for (const column of columns) {
        const remappedKey = remapValues[column]
        if (remappedKey) {
          productRow.push(product[remappedKey]);
        } else {
          productRow.push(product[column]);
        }
      }
      worksheet.addRow(productRow)
    }

    return workbook;
  }
}
