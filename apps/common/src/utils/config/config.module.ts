import { Global, Module } from '@nestjs/common';
import { configProvider } from './config.provider';
import { ConfigService } from './config.service';
import { translatorInstance } from '../translator/translator.provider';
import { sequelizeProvider } from '../database/database.provider';
import { LoggerModule } from '../logger/logger.module';

@Global()
@Module({
  imports: [translatorInstance, LoggerModule],
  providers: [configProvider, ConfigService, sequelizeProvider()],
  exports: [ConfigService],
})
export class ConfigModule {}
