import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Get,
  Param,
  Res,
  Request,
  HttpStatus,
  HttpCode,
  InternalServerErrorException,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { Response } from 'express';
import {
  ApiConsumes,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { fileInterceptor } from './file.interceptor';
import { FileExtender } from './file.extender';
import { createReadStream } from 'fs';
import { FileDto } from './models';
import { EntityByIdDto } from 'apps/common/src/models/entity-by-id.dto';
import { TranslatorService } from 'nestjs-translator';
import { LoggerService } from 'apps/common/src/utils/logger/logger.service';

@ApiBearerAuth()
@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly translator: TranslatorService,
    private readonly loggerService: LoggerService,
  ) {}

  @ApiOperation({ summary: 'Upload a single file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary', nullable: false },
        folderId: { type: 'integer', nullable: true },
        isPublic: { type: 'boolean', nullable: false },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'File uploaded successfully.',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request.' })
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileExtender)
  @UseInterceptors(fileInterceptor)
  @Post('upload')
  async uploadFile(
    @Request() req,
    @UploadedFile()
    file: Express.Multer.File & { isPublic: boolean; folderId: number },
  ) {
    if (!file) throw new BadRequestException('No file uploaded');

    const filename = await this.filesService.saveFileStream(file);
    const fileInstance = await this.filesService.create(
      req.user.userId,
      file,
      filename,
    );

    return new FileDto(fileInstance);
  }

  @ApiOperation({ summary: 'Get a file by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'File retrieved successfully.',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'File not found.' })
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  async getFile(
    @Request() req,
    @Param() params: EntityByIdDto,
    @Res() res: Response,
  ) {
    const file = await this.filesService.getExistingInstanceOrThrow(params.id, [
      'notDeleted',
      { method: ['byUserId', req.user.userId] },
    ]);

    const filePath = this.filesService.getFilePath(file.path);

    const fileStream = createReadStream(filePath);

    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${file.path}"`,
    });

    fileStream.pipe(res);

    fileStream.on('error', (error) => {
      this.loggerService.error('ERROR_STREAMING', error);

      throw new InternalServerErrorException({
        message: this.translator.translate('ERROR_STREAMING'),
        errorCode: 'ERROR_STREAMING',
        statusCode: HttpStatus.NOT_FOUND,
      });
    });
  }
}
