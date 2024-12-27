import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';

export const fileInterceptor = FileInterceptor('file', {
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 },
});
