import { Controller, Get, Request } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserDto } from './models';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @ApiResponse({ type: () => UserDto })
  @ApiOperation({ summary: "Get current user's profile" })
  @Get('me')
  async getMyProfile(@Request() req): Promise<UserDto> {
    const { userId } = req.user;

    const user = await this.usersService.getOne([{ method: ['byId', userId] }]);

    return new UserDto(user);
  }
}
