import { Module } from '@nestjs/common';
import { JwtStrategy } from '../../common/src/strategies/jwt.strategy';
import { UsersService } from '../../users/src/users.service';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';
import { guardProviders } from '../../common/src/utils/guards/guard.provider';
import { ConfigModule } from '../../common/src/utils/config/config.module';
import { jwtModuleInstance } from '../../common/src/utils/jwt/jwt.module';
import { sequelizeProvider } from '../../common/src/utils/database/database.provider';
import { redisModuleInstance } from '../../common/src/utils/database/redis.provider';
import { modelProviders } from './model.provider';
import { translatorInstance } from '../../common/src/utils/translator/translator.provider';
import { LoggerModule } from 'apps/common/src/utils/logger/logger.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    jwtModuleInstance,
    redisModuleInstance,
    translatorInstance,
  ],
  controllers: [SessionsController],
  providers: [
    SessionsService,
    UsersService,
    JwtStrategy,
    JwtService,
    ...guardProviders,
    sequelizeProvider(),
    ...modelProviders,
  ],
})
export class SessionsModule {}
