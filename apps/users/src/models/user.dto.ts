import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';
import { BaseDto } from 'apps/common/src/base/base.dto';

export class UserDto extends BaseDto<User> {
  constructor(data: User) {
    super(data);

    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.isVerified = data.isVerified;
  }

  @ApiProperty({ type: () => String, required: true })
  readonly email: string;

  @ApiProperty({ type: () => String, required: true })
  readonly firstName: string;

  @ApiProperty({ type: () => String, required: true })
  readonly lastName: string;

  @ApiProperty({ type: () => Boolean, required: false })
  readonly isVerified?: boolean;
}
