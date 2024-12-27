import { Min, Max, IsInt } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationParams {
  @ApiProperty({ type: () => Number, required: true, default: 100 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @Transform(({ value }) => Number(value))
  readonly limit: number = 100;

  @ApiProperty({ type: () => Number, required: true, default: 0 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Transform(({ value }) => Number(value))
  readonly offset: number = 0;
}
