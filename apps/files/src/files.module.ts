import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
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
import { FoldersService } from 'apps/folders/src/folders.service';

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    jwtModuleInstance,
    redisModuleInstance,
    translatorInstance,
  ],
  controllers: [FilesController],
  providers: [
    FilesService,
    JwtStrategy,
    SessionsService,
    FoldersService,
    LoggerService,
    ...guardProviders,
    sequelizeProvider(),
    ...modelProviders,
  ],
})
export class FilesModule {}
