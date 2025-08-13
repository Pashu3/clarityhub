import { Test, TestingModule } from '@nestjs/testing';
import { UploadUsageService } from './upload-usage.service';

describe('UploadUsageService', () => {
  let service: UploadUsageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UploadUsageService],
    }).compile();

    service = module.get<UploadUsageService>(UploadUsageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
