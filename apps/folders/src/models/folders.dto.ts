import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from 'apps/common/src/models/pagination.dto';
import { FolderDto } from './folder.dto';
import { Folder } from './folder.entity';

export class FoldersDto {
  constructor(data: Folder[], pagination?: PaginationDto) {
    this.data = data.map((workoutType) => new FolderDto(workoutType));
    this.pagination = pagination || undefined;
  }

  @ApiProperty({ type: () => [FolderDto], required: true })
  readonly data: FolderDto[];

  @ApiProperty({ type: () => PaginationDto, required: false })
  readonly pagination?: PaginationDto;
}
