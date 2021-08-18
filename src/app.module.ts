import { HttpModule, HttpService, Logger, Module } from '@nestjs/common';
import { SparModule } from './spar/spar.module';
import { ExcelModule } from './excel/excel.module';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { AxiosModule } from './shared/Axios.module';

@Module({
  imports: [
    ExcelModule,
    SparModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    AxiosModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
