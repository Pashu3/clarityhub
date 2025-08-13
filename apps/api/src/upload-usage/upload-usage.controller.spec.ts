import { Test, TestingModule } from '@nestjs/testing';
import { UploadUsageController } from './upload-usage.controller';

describe('UploadUsageController', () => {
  let controller: UploadUsageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadUsageController],
    }).compile();

    controller = module.get<UploadUsageController>(UploadUsageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
