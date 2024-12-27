import {
  HttpStatus,
  Injectable,
  NotImplementedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SessionDataDto, SessionDto } from '../../sessions/src/models';
import { DateTime } from 'luxon';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { ObjectKeyComposer } from 'apps/common/src/utils/helpers/object-key-composer.helper';
import { Redis } from 'ioredis';
import * as uuid from 'uuid';
import { ConfigService } from 'apps/common/src/utils/config/config.service';
import { TranslatorService } from 'nestjs-translator';

@Injectable()
export class SessionsService {
  private readonly redisClient: Redis;

  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
    private readonly translator: TranslatorService,
  ) {
    this.redisClient = this.redisService.getOrThrow();
  }

  getSessionAppendix(userId: number): string {
    return ObjectKeyComposer.createKey('user_session', userId);
  }

  async create(userId: number, sessionOptions?: any): Promise<SessionDto> {
    const uniqueKey = uuid.v4();

    const tokenParams: SessionDataDto = {
      userId,
      email: sessionOptions?.email,
      isVerified: sessionOptions?.isVerified,
      sessionId: sessionOptions?.sessionId || uniqueKey,
    };

    const lifeTime =
      sessionOptions?.lifeTime ||
      this.configService.get('JWT_ACCESS_TOKEN_EXPIRES_IN');

    const accessToken = this.jwtService.sign(
      { data: tokenParams },
      {
        expiresIn: lifeTime,
        secret: this.configService.get('JWT_SECRET_KEY'),
      },
    );

    await this.addTokenToSessionList(userId, accessToken);
    await this.redisClient.set(
      accessToken,
      JSON.stringify(tokenParams),
      'PX',
      lifeTime,
    );

    const refreshToken = this.jwtService.sign(
      {
        data: {
          ...tokenParams,
          tokenType: 'refresh',
          accessToken: accessToken,
        },
      },
      {
        expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRES_IN'),
        secret: this.configService.get('JWT_SECRET_KEY'),
      },
    );

    return new SessionDto(
      accessToken,
      refreshToken,
      DateTime.utc().plus({ milliseconds: lifeTime }).valueOf(),
    );
  }

  addTokenToSessionList(userId: number, accessToken: string): Promise<number> {
    return this.redisClient.lpush(this.getSessionAppendix(userId), accessToken);
  }

  deleteTokenFromSessionList(
    userId: number,
    accessToken: string,
  ): Promise<number> {
    return this.redisClient.lrem(
      this.getSessionAppendix(userId),
      0,
      accessToken,
    );
  }

  async findSession(
    accessToken: string,
  ): Promise<SessionDataDto & { [key: string]: any }> {
    const cachedSession: SessionDataDto = JSON.parse(
      await this.redisClient.get(accessToken),
    );

    if (!cachedSession) {
      return null;
    }

    return cachedSession;
  }

  async destroy(userId: number, accessToken: string): Promise<void> {
    await this.deleteTokenFromSessionList(userId, accessToken);
    await this.redisClient.del(accessToken);
  }

  async refresh(refreshToken: string): Promise<SessionDto> {
    const sessionParams = this.verifyToken(refreshToken);
    const sessionKey = this.getSessionAppendix(sessionParams.data.userId);
    const existAccessTokens = await this.redisClient.lrange(sessionKey, 0, -1);
    if (
      !existAccessTokens.find(
        (token) => token === sessionParams.data.accessToken,
      )
    ) {
      throw new UnprocessableEntityException({
        message: this.translator.translate('TOKEN_EXPIRED'),
        errorCode: 'TOKEN_EXPIRED',
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }
    await this.destroy(
      sessionParams.data.userId,
      sessionParams.data.accessToken,
    );
    const paramsForNewSession = {
      email: sessionParams.data.email,
      isVerified: sessionParams.data.isVerified,
      sessionId: sessionParams.data.sessionId,
    };
    return this.create(sessionParams.data.userId, paramsForNewSession);
  }

  getErrorCode(err: { name: string }, defaultErrorCode: string): string {
    const errorNames = {
      TokenExpiredError: defaultErrorCode,
      JsonWebTokenError: 'TOKEN_INVALID',
    };

    return errorNames[err.name];
  }

  verifyToken(token: string, defaultErrorCode = 'TOKEN_EXPIRED'): any {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET_KEY'),
      });
    } catch (err) {
      const errorCode = this.getErrorCode(err, defaultErrorCode);

      if (errorCode) {
        throw new UnprocessableEntityException({
          message: this.translator.translate(errorCode),
          errorCode,
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        });
      }

      throw new NotImplementedException();
    }
  }
}
