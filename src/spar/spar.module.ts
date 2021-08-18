import { Module } from '@nestjs/common';
import { SparService } from './spar.service';

@Module({
  providers: [SparService],
  exports: [SparService]
})
export class SparModule {}
