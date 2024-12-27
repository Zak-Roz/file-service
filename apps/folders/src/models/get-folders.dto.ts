import { ApiProperty } from '@nestjs/swagger';
import { OrderParamsFactory } from 'apps/common/src/base/order-params.dto';
import { FolderOrderFields } from 'apps/common/src/resources/folders';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import { IsString, IsOptional } from 'class-validator';

export class GetFoldersDto extends OrderParamsFactory(FolderOrderFields) {
  @ApiProperty({ type: () => String, required: false })
  @IsOptional()
  @Type(() => String)
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly query?: string;
}
