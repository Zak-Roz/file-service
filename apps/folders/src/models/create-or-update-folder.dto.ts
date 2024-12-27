import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import {
  STRING_FIELD_ERROR_MESSAGE,
  STRING_FIELD_REGEX,
  FolderValidationRules,
} from 'apps/common/src/resources/folders';

export interface ICreateOrUpdateFolder {
  name: string;
  parentId?: number;
  isPublic: boolean;
}

export class CreateOrUpdateFolderDto implements ICreateOrUpdateFolder {
  @ApiProperty({ type: () => String, required: true })
  @IsNotEmpty()
  @Type(() => String)
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(
    FolderValidationRules.nameMinLength,
    FolderValidationRules.nameMaxLength,
  )
  @Matches(STRING_FIELD_REGEX, {
    message: STRING_FIELD_ERROR_MESSAGE('name'),
  })
  readonly name: string;

  @ApiProperty({ type: () => Number, required: false })
  @IsOptional()
  @IsInt()
  @IsPositive()
  readonly parentId: number;

  @ApiProperty({ type: () => Boolean, required: true, default: false })
  @IsNotEmpty()
  @IsBoolean()
  readonly isPublic: boolean;
}
