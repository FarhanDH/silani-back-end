import { Test, TestingModule } from '@nestjs/testing';
import { FieldPestsController } from './field-pests.controller';
import { FieldPestsService } from './field-pests.service';

describe('FieldPestsController', () => {
  let controller: FieldPestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FieldPestsController],
      providers: [FieldPestsService],
    }).compile();

    controller = module.get<FieldPestsController>(FieldPestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
