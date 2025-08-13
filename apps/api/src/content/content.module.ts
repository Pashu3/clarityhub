import { Module } from '@nestjs/common';
import { ContentService } from './content.service';
import { FaqService } from './faq.service';
import { ContentController } from './content.controller';
import { FaqController } from './faq.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { extname } from 'path'; // Add this import for extname

// Ensure upload directory exists
const uploadDir = './uploads/content';
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
}

@Module({
  imports: [
    PrismaModule,
    MulterModule.register({
      storage: diskStorage({
        destination: uploadDir,
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  ],
  controllers: [ContentController, FaqController],
  providers: [ContentService, FaqService],
  exports: [ContentService, FaqService],
})
export class ContentModule {}