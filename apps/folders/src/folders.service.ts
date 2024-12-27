import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'sequelize-typescript';
import { Folder } from './models/folder.entity';
import { BaseService } from 'apps/common/src/base/base.service';
import { CreationAttributes, ScopeOptions, Transaction } from 'sequelize';
import { TranslatorService } from 'nestjs-translator';
import { CreateOrUpdateFolderDto } from './models';

@Injectable()
export class FoldersService extends BaseService<Folder> {
  constructor(
    @Inject('FOLDER_MODEL') protected model: Repository<Folder>,
    private readonly translator: TranslatorService,
  ) {
    super(model);
  }

  createRootFolder(userId: number, transaction?: Transaction) {
    return this.create(
      {
        userId,
        name: 'root',
        parentId: null,
        isPublic: false,
      },
      transaction,
    );
  }

  async getRootFolderOrThrowError(userId: number, transaction?: Transaction) {
    const rootFolder = await this.getOne(
      [{ method: ['byUserId', userId] }, 'parentIdIsNull', 'notDeleted'],
      transaction,
    );

    if (!rootFolder) {
      throw new BadRequestException({
        message: this.translator.translate('ROOT_FOLDER_NOT_FOUND'),
        errorCode: 'ROOT_FOLDER_NOT_FOUND',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    return rootFolder;
  }

  async checkParentId(
    parentId: number | undefined,
    userId: number,
    transaction?: Transaction,
  ) {
    if (!parentId) {
      return;
    }

    const folder = await this.getById(
      parentId,
      [{ method: ['byUserId', userId] }, 'notDeleted'],
      transaction,
    );

    if (!folder) {
      throw new BadRequestException({
        message: this.translator.translate('FOLDER_NOT_FOUND'),
        errorCode: 'FOLDER_NOT_FOUND',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async checkNameBeforeCreateOrUpdate(
    body: CreateOrUpdateFolderDto,
    userId: number,
    folderForUpdate?: Folder,
    transaction?: Transaction,
  ) {
    const folder = await this.getOne(
      [
        { method: ['byName', body.name] },
        { method: ['byUserId', userId] },
        body.parentId
          ? { method: ['byParentId', body.parentId] }
          : 'parentIdIsNull',
        'notDeleted',
      ],
      transaction,
    );

    if (
      (!folderForUpdate && folder) ||
      (folderForUpdate && folderForUpdate.id !== folder.id)
    ) {
      throw new BadRequestException({
        message: this.translator.translate('FOLDER_ALREADY_EXIST'),
        errorCode: 'FOLDER_ALREADY_EXIST',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async getExistingInstanceOrThrow(
    id: number,
    scopes: (string | ScopeOptions)[] = [],
    transaction?: Transaction,
  ): Promise<Folder> {
    const folder: Folder = await this.getById(id, scopes, transaction);

    if (!folder) {
      throw new NotFoundException({
        message: this.translator.translate('FOLDER_NOT_FOUND'),
        errorCode: 'FOLDER_NOT_FOUND',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    return folder;
  }

  create(
    body: Readonly<CreationAttributes<Folder>>,
    transaction?: Transaction,
  ): Promise<Folder> {
    return this.model.create(body, { transaction });
  }
}
