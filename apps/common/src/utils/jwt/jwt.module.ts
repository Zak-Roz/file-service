import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '../config/config.service';

export const jwtModuleInstance = JwtModule.registerAsync({
  useFactory: (configService: ConfigService) => ({
    secret: configService.get('JWT_SECRET_KEY'),
  }),
  inject: [ConfigService],
});
