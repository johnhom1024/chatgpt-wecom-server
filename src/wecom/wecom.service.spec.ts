import { Test, TestingModule } from '@nestjs/testing';
import { WecomService } from './wecom.service';

describe('WecomService', () => {
  let service: WecomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WecomService],
    }).compile();

    service = module.get<WecomService>(WecomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
