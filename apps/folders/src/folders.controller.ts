import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { FoldersService } from './folders.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateOrUpdateFolderDto, Folder, FolderDto } from './models';
import { TranslatorService } from 'nestjs-translator';
import { EntityByIdDto } from 'apps/common/src/models/entity-by-id.dto';
import { OptionalEntityByIdDto } from 'apps/common/src/models/optional-entity-by-id.dto';
import { FilesService } from 'apps/files/src/files.service';

@ApiBearerAuth()
@ApiTags('folders')
@Controller('folders')
export class FoldersController {
  constructor(
    private readonly foldersService: FoldersService,
    private readonly filesService: FilesService,
    private readonly translator: TranslatorService,
  ) {}

  @ApiOperation({ summary: 'Create Folder' })
  @ApiCreatedResponse({ type: () => FolderDto })
  @HttpCode(HttpStatus.CREATED)
  @Post('')
  async create(
    @Request() req,
    @Body() body: CreateOrUpdateFolderDto,
  ): Promise<FolderDto> {
    let { parentId } = body;
    const { userId } = req.user;

    if (!parentId) {
      const rootFolder =
        await this.foldersService.getRootFolderOrThrowError(userId);

      parentId = rootFolder.id;
    }

    await Promise.all([
      this.foldersService.checkParentId(parentId, userId),
      this.foldersService.checkNameBeforeCreateOrUpdate(
        { ...body, parentId },
        userId,
      ),
    ]);

    const folder = await this.foldersService.create({
      ...body,
      parentId,
      userId,
    });

    return new FolderDto(folder);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get folder By Id' })
  @ApiOkResponse({ type: () => FolderDto })
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  async getFolderById(
    @Request() req,
    @Param() params: OptionalEntityByIdDto,
  ): Promise<FolderDto> {
    let folder: Folder;

    if (params.id) {
      folder = await this.foldersService.getExistingInstanceOrThrow(params.id, [
        'notDeleted',
        { method: ['byUserId', req.user.userId] },
      ]);
    } else {
      folder = await this.foldersService.getRootFolderOrThrowError(
        req.user.userId,
      );
    }

    const files = await this.filesService.getList([
      'notDeleted',
      { method: ['byUserId', req.user.userId] },
      { method: ['byFolderId', folder.id] },
    ]);

    const folders = await this.foldersService.getList([
      'notDeleted',
      { method: ['byUserId', req.user.userId] },
      { method: ['byParentId', folder.id] },
    ]);

    folder.files = files;
    folder.folders = folders;

    return new FolderDto(folder);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update folder By Id' })
  @ApiOkResponse({ type: () => FolderDto })
  @HttpCode(HttpStatus.OK)
  @Put('/:id')
  async updateFolderById(
    @Request() req,
    @Param() params: EntityByIdDto,
    @Body() body: CreateOrUpdateFolderDto,
  ): Promise<FolderDto> {
    let { parentId } = body;
    const { userId } = req.user;

    if (!parentId) {
      const rootFolder =
        await this.foldersService.getRootFolderOrThrowError(userId);

      parentId = rootFolder.id;
    }

    const [folder] = await Promise.all([
      this.foldersService.getExistingInstanceOrThrow(params.id, [
        { method: ['byUserId', userId] },
        'notDeleted',
      ]),
      this.foldersService.checkParentId(parentId, userId),
      this.foldersService.checkNameBeforeCreateOrUpdate(
        { ...body, parentId },
        userId,
      ),
    ]);

    await folder.update({
      ...body,
      parentId,
    });

    return new FolderDto(folder);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete folder By Id' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:id')
  async deleteFolderById(
    @Request() req,
    @Param() params: EntityByIdDto,
  ): Promise<void> {
    const folder: Folder = await this.foldersService.getExistingInstanceOrThrow(
      params.id,
      [{ method: ['byUserId', req.user.userId] }, 'notDeleted'],
    );

    await folder.destroy();
  }
}
