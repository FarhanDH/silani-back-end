import { Test, TestingModule } from '@nestjs/testing';
import { FieldPestsService } from './field-pests.service';

describe('FieldPestsService', () => {
  let service: FieldPestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FieldPestsService],
    }).compile();

    service = module.get<FieldPestsService>(FieldPestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
