import { HttpService, Injectable, Logger, LoggerService } from '@nestjs/common';
import cheerio from 'cheerio';
import { catchError, timeout } from 'rxjs/operators';

@Injectable()
export class SparService {
  private readonly logger = new Logger(SparService.name);

  constructor(private httpService: HttpService) {
  }

  /**
   * Scrapes the products from the spar online website, by the provided SKU-s
   * @param skuArray
   */
  async scrapeProducts(ids: number[]) {
    const products = [];

    this.logger.log(`Scrapping ${ids.length} products`);

    const sleepTimer = this.getSleepTimer();
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];

      this.logger.log(`Scrapping product with id ${id}. ${i + 1} / ${ids.length}`)
      try {
        products.push(await this.scrapeProduct(id));

        await sleep(sleepTimer);
      } catch (e) {
        this.logger.error(e);
      }
    }
    return products;
  }

  /**
   * Scrapes a single product by its SKU
   * @param sku
   * @private
   */
  async scrapeProduct(id: number): Promise<any> {
    const html = await this.httpService
      .get(`https://www.spar.si/online/p/${id}`, {
        responseType: 'text',
        headers: {
          'User-Agent': 'wolt-crawler-bot',
        },
      })
      .toPromise();

    const $ = cheerio.load(html.data);

    const title = $('title')
      .text()
      .trim()
      .toLowerCase();

    if (title === 'izdelek ni najden') {
      this.logger.warn(`Product with id ${id} not found`);
      return {
        id,
      };
    }

    const productUrl = $('span[data-produrl]').data('produrl');
    const url = `https://www.spar.si/online${productUrl}`;
    this.logger.log(`Parsing url: ${url}`);

    const name = $('.productDetailsName')
      .contents()
      .first()
      .text();

    const price = Number($('label[data-baseprice]').data('baseprice'));

    const vat = parseFloat(
      $('.productDetailsTaxesInfo')
        .text()
        .match(/\d,\d/)[0]
        .replace(',', '.'),
    );

    const attributesMap = [
      'Opis',
      'Shranjevanje',
      'Temperatura za hranjenje',
      'Sestavine',
      'Navodila za uporabo',
      'Neto količina',
      'Alergeni',
      'Vsebnost alkohola',
    ];

    const detailContainers = $(
      '.productTabsSectionInfo .detail__container',
    ).toArray();

    const attributes = {};
    for (const detailContainer of detailContainers) {
      const title = $('.detail__title', detailContainer)
        .text()
        .trim();
      // const key = Object.keys(attributesMap).find(key => attributesMap[key] === title)
      const key = attributesMap.find(el => el === title);
      if (key) {
        attributes[key] = $('.detail__title', detailContainer)
          .next()
          .text()
          .trim();
      }
    }

    const foodEnergyTexts = $(
      '.productTabsSectionInfo .detail__container__table',
    ).toArray();

    const foodEnergy = {};

    foodEnergy['Povprečna hranilna vrednost na'] = $('dl').first().text().trim();
    for (const el of foodEnergyTexts) {
      const key = $('dt.bold', el)
        .text()
        .trim();
      const value = $('dt.bold', el)
        .next()
        .text()
        .trim();

      if (key && value) {
        foodEnergy[key] = value;
      }
    }

    return {
      name,
      id,
      url,
      price,
      vat,
      ...attributes,
      ...foodEnergy,
    };
  }

  private getSleepTimer = () => {
    const requestsPerMinuteString = process.env.REQUESTS_PER_MINUTE;
    const requestsPerMinute = parseInt(requestsPerMinuteString) || 60;
    this.logger.log('REQUESTS_PER_MINUTE: ' + requestsPerMinute);
    const sleepTimer = 60000 / requestsPerMinute;
    this.logger.log('Sleeping between requests: ' + sleepTimer +'ms');
    return sleepTimer;
  };
}

const sleep = async (time: number) => {
  await new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};
//
// // Ime --
// // Številka izdelka
// // Cena
// // DDV
// //Opis --
// //Shranjevanje --
// // Temperatura za hranjenje --
// // Sestavine --
// // Navodila za uporabo --
// // Neto količina --
// //Alergeni
// Povprečna hranilna vrednost (Energijska vrednost, kcal, kJ, Maščoge, od tega nasičene maščoge, OH, od tega lsadkorji, Beljakovine, Sol)
// //Vsebnost alkohola
//
// [
//     "Opis",
//     "Shranjevanje",
//     "Temperatura za hranjenje",
//     "Sestavine",
//     "Navodila za uporabo",
//     "Neto količina",
// ]
