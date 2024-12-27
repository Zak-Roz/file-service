import { ApiProperty } from '@nestjs/swagger';
import { File } from './file.entity';
import { BaseDto } from 'apps/common/src/base/base.dto';
import { UserDto } from 'apps/users/src/models';
import { FolderDto } from 'apps/folders/src/models';

export class FileDto extends BaseDto<File> {
  constructor(data: File) {
    super(data);

    this.name = data.name;
    this.path = data.path;
    this.type = data.type;
    this.size = data.size;
    this.folderId = data.folderId;
    this.isPublic = data.isPublic;
    this.user = data.user ? new UserDto(data.user) : undefined;
    this.folder = data.folder ? new FolderDto(data.folder) : undefined;
  }

  @ApiProperty({ type: () => String, required: true })
  readonly name: string;

  @ApiProperty({ type: () => String, required: true })
  readonly path: string;

  @ApiProperty({ type: () => String, required: true })
  readonly type: string;

  @ApiProperty({ type: () => Number, required: false })
  readonly size?: number;

  @ApiProperty({ type: () => Number, required: true })
  readonly folderId: number;

  @ApiProperty({ type: () => Boolean, required: true })
  readonly isPublic: boolean;

  @ApiProperty({ type: () => UserDto, required: false })
  readonly user: UserDto;

  @ApiProperty({ type: () => UserDto, required: false })
  readonly folder: FolderDto;
}
