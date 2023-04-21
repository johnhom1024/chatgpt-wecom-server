import { Test, TestingModule } from '@nestjs/testing';
import { WecomController } from './wecom.controller';

describe('WecomController', () => {
  let controller: WecomController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WecomController],
    }).compile();

    controller = module.get<WecomController>(WecomController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
