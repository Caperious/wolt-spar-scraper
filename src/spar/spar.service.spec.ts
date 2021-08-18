import { Test, TestingModule } from '@nestjs/testing';
import { SparService } from './spar.service';

describe('SparService', () => {
  let service: SparService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SparService],
    }).compile();

    service = module.get<SparService>(SparService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
