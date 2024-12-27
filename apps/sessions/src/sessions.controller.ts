import {
  Body,
  Controller,
  Delete,
  Headers,
  HttpCode,
  HttpStatus,
  Put,
  Request,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from 'apps/common/src/resources/common/public.decorator';
import { RefreshSessionDto } from './models';
import { SessionsService } from './sessions.service';
import { UsersService } from '../../users/src/users.service';
import { TranslatorService } from 'nestjs-translator';
import { UserSessionDto } from 'apps/users/src/models';
import { RedisService } from '@liaoliaots/nestjs-redis';

@ApiTags('sessions')
@Controller('sessions')
export class SessionsController {
  constructor(
    private readonly sessionsService: SessionsService,
    private readonly usersService: UsersService,
    private readonly translator: TranslatorService,
    private readonly redisService: RedisService,
  ) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Destroy session' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('')
  async logout(
    @Request() request,
    @Headers('Authorization') accessToken,
  ): Promise<void> {
    const { user } = request;

    accessToken = accessToken.split(' ')[1];

    await this.sessionsService.destroy(user.userId, accessToken);
  }

  @Public()
  @ApiCreatedResponse({ type: () => UserSessionDto })
  @ApiOperation({ summary: 'Refresh session' })
  @Put('')
  async refresh(@Body() body: RefreshSessionDto): Promise<UserSessionDto> {
    const oldSessionParams = this.sessionsService.verifyToken(
      body.refreshToken,
    );

    const user = await this.usersService.getUser(oldSessionParams.data.userId);

    if (!user) {
      throw new UnprocessableEntityException({
        message: this.translator.translate('USER_NOT_FOUND'),
        errorCode: 'USER_NOT_FOUND',
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }

    const session = await this.sessionsService.refresh(body.refreshToken);

    return new UserSessionDto(session, user);
  }
}
