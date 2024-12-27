import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ConfigModule } from 'apps/common/src/utils/config/config.module';
import { LoggerModule } from 'apps/common/src/utils/logger/logger.module';
import { jwtModuleInstance } from 'apps/common/src/utils/jwt/jwt.module';
import { redisModuleInstance } from 'apps/common/src/utils/database/redis.provider';
import { translatorInstance } from 'apps/common/src/utils/translator/translator.provider';
import { JwtStrategy } from 'apps/common/src/strategies/jwt.strategy';
import { SessionsService } from 'apps/sessions/src/sessions.service';
import { LoggerService } from 'apps/common/src/utils/logger/logger.service';
import { guardProviders } from 'apps/common/src/utils/guards/guard.provider';
import { sequelizeProvider } from 'apps/common/src/utils/database/database.provider';
import { modelProviders } from './models.provider';

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    jwtModuleInstance,
    redisModuleInstance,
    translatorInstance,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    JwtStrategy,
    SessionsService,
    LoggerService,
    ...guardProviders,
    sequelizeProvider(),
    ...modelProviders,
  ],
})
export class UsersModule {}
