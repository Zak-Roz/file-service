import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class OptionalEntityByIdDto {
  @ApiProperty({ type: () => Number, required: false })
  @IsOptional()
  @Type(() => Number)
  readonly id?: number;
}
