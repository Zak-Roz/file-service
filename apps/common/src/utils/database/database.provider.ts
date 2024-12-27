import { Sequelize } from 'sequelize-typescript';
import { ConfigService } from '../config/config.service';
import { entities } from './database-entity.provider';

export const sequelizeProvider = () => ({
  provide: 'SEQUELIZE',
  useFactory: async (configService: ConfigService) => {
    const sequelize = new Sequelize({
      dialect: 'mysql',
      host: configService.get('DB_HOST'),
      port: configService.get('DB_PORT'),
      username: configService.get('DB_USER'),
      password: configService.get('DB_PASSWORD'),
      database: configService.get('DB_NAME'),
      logging: console.log,
    });
    sequelize.addModels(entities);
    return sequelize;
  },
  inject: [ConfigService],
});
