import { IsOptional, IsString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationParams } from './pagination-params.dto';
import { OrderTypes } from '../resources/common/order-types';
import { EnumHelper } from '../utils/helpers/enum.helper';

export function OrderParamsFactory(orderByEnum: object) {
  class OrderParams extends PaginationParams {
    @IsOptional()
    @ApiProperty({
      enum: orderByEnum,
      required: false,
      description: EnumHelper.toDescription(orderByEnum),
    })
    @Type(() => String)
    @IsString()
    @IsEnum(orderByEnum)
    readonly orderBy?: string;

    @IsOptional()
    @ApiProperty({
      enum: OrderTypes,
      required: false,
      default: OrderTypes.desc,
      description: EnumHelper.toDescription(OrderTypes),
    })
    @Type(() => String)
    @IsString()
    @IsEnum(OrderTypes)
    readonly orderType?: OrderTypes;
  }

  return OrderParams;
}
