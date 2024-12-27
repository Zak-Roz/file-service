import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from 'apps/common/src/strategies/google.strategy';
import { AuthController } from './auth.controller';
import { SessionsService } from 'apps/sessions/src/sessions.service';
import { UsersService } from 'apps/users/src/users.service';
import { JwtService } from '@nestjs/jwt';
import { modelProviders } from 'apps/users/src/models.provider';
import { ConfigModule } from 'apps/common/src/utils/config/config.module';
import { LoggerModule } from 'apps/common/src/utils/logger/logger.module';
import { jwtModuleInstance } from 'apps/common/src/utils/jwt/jwt.module';
import { redisModuleInstance } from 'apps/common/src/utils/database/redis.provider';
import { translatorInstance } from 'apps/common/src/utils/translator/translator.provider';
import { guardProviders } from 'apps/common/src/utils/guards/guard.provider';
import { sequelizeProvider } from 'apps/common/src/utils/database/database.provider';
import { JwtStrategy } from 'apps/common/src/strategies/jwt.strategy';
import { FoldersService } from 'apps/folders/src/folders.service';

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    jwtModuleInstance,
    redisModuleInstance,
    translatorInstance,
    PassportModule.register({ defaultStrategy: 'google' }),
  ],
  controllers: [AuthController],
  providers: [
    GoogleStrategy,
    SessionsService,
    UsersService,
    FoldersService,
    JwtService,
    JwtStrategy,
    ...guardProviders,
    sequelizeProvider(),
    ...modelProviders,
  ],
})
export class AuthModule {}
