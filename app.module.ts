import { Module } from '@nestjs/common';
import { AuthModule } from 'apps/auth/src/auth.module';
import { ConfigModule } from 'apps/common/src/utils/config/config.module';
import { UsersModule } from 'apps/users/src/users.module';
import { SessionsModule } from 'apps/sessions/src/sessions.module';
import { FilesModule } from 'apps/files/src/files.module';
import { FoldersModule } from 'apps/folders/src/folders.module';

@Module({
  imports: [
    ConfigModule,
    AuthModule,
    UsersModule,
    SessionsModule,
    FilesModule,
    FoldersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
