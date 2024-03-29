import { Global, } from '@nestjs/common';

import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

@Global()
@Module({
  imports: [HttpModule],
  providers: [],
  exports: [HttpModule],
})
export class AxiosModule {}
