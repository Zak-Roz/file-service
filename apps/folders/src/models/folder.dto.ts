import { ApiProperty } from '@nestjs/swagger';
import { Folder } from './folder.entity';
import { BaseDto } from 'apps/common/src/base/base.dto';
import { UserDto } from 'apps/users/src/models';
import { FileDto } from 'apps/files/src/models';

export class FolderDto extends BaseDto<Folder> {
  constructor(data: Folder) {
    super(data);

    this.name = data.name;
    this.parentId = data.parentId || undefined;
    this.isPublic = data.isPublic;
    this.user = data.user ? new UserDto(data.user) : undefined;
    this.files = data.files?.length
      ? data.files.map((file) => new FileDto(file))
      : undefined;
    this.folders = data.folders?.length
      ? data.folders.map((folder) => new FolderDto(folder))
      : undefined;
  }

  @ApiProperty({ type: () => String, required: true })
  readonly name: string;

  @ApiProperty({ type: () => Number, required: false })
  readonly parentId?: number;

  @ApiProperty({ type: () => Boolean, required: true })
  readonly isPublic: boolean;

  @ApiProperty({ type: () => UserDto, required: false })
  readonly user: UserDto;

  @ApiProperty({ type: () => [FileDto], required: false })
  readonly files: FileDto[];

  @ApiProperty({ type: () => [FolderDto], required: false })
  readonly folders: FolderDto[];
}
