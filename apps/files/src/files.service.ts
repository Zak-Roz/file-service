import {
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { createWriteStream } from 'fs';
import { BaseService } from 'apps/common/src/base/base.service';
import { File, fileProvider } from './models';
import { Repository } from 'sequelize-typescript';
import Sharp from 'sharp';
import * as uuid from 'uuid';
import { FoldersService } from 'apps/folders/src/folders.service';
import { ScopeOptions, Transaction } from 'sequelize';
import { TranslatorService } from 'nestjs-translator';
import { Folder } from 'apps/folders/src/models';

@Injectable()
export class FilesService extends BaseService<File> {
  private readonly uploadPath = path.join(process.cwd(), 'uploads');

  constructor(
    @Inject(fileProvider.provide) protected model: Repository<File>,
    private readonly foldersService: FoldersService,
    private readonly translator: TranslatorService,
  ) {
    super(model);

    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  async getExistingInstanceOrThrow(
    id: number,
    scopes: (string | ScopeOptions)[] = [],
    transaction?: Transaction,
  ): Promise<File> {
    const file: File = await this.getById(id, scopes, transaction);

    if (!file) {
      throw new NotFoundException({
        message: this.translator.translate('FILE_NOT_FOUND'),
        errorCode: 'FILE_NOT_FOUND',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    return file;
  }

  async saveFileStream(file: Express.Multer.File) {
    const filename = `${uuid.v4()}_${file.originalname}`;
    const filePath = path.join(this.uploadPath, filename);

    switch (file.mimetype) {
      case 'image/jpeg':
        await Sharp(file.buffer).jpeg({ quality: 50 }).toFile(filePath);
        break;
      case 'image/png':
        await Sharp(file.buffer).png({ quality: 50 }).toFile(filePath);
        break;
      default: {
        const writeStream = createWriteStream(filePath);

        writeStream.write(file.buffer);
        writeStream.end();
        await new Promise((resolve, reject) => {
          writeStream.on('finish', resolve);
          writeStream.on('error', reject);
        });
        break;
      }
    }

    return filename;
  }

  async create(
    userId: number,
    file: Express.Multer.File & { isPublic: boolean; folderId: number },
    filename: string,
  ) {
    const filePath = path.join(this.uploadPath, filename);
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('File not found');
    }

    const { size } = fs.statSync(filePath);

    let folder: Folder;

    if (file.folderId) {
      folder = await this.foldersService.getExistingInstanceOrThrow(
        file.folderId,
        ['notDeleted', { method: ['byUserId', userId] }],
      );
    } else {
      folder = await this.foldersService.getRootFolderOrThrowError(userId);
    }

    return this.model.create({
      userId,
      isPublic: file.isPublic,
      name: file.originalname,
      path: filename,
      type: file.mimetype,
      size: String(size),
      folderId: folder.id,
    });
  }

  getFilePath(filename: string): string {
    const filePath = path.join(this.uploadPath, filename);
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('File not found');
    }
    return filePath;
  }
}
