import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

const provideConfig = async () => {
  const nodeEnv = process.env.NODE_ENV;
  const envFilePath =
    nodeEnv === 'local'
      ? path.resolve(`./.env.${nodeEnv}`)
      : path.resolve(`./.env`);

  return dotenv.parse(fs.readFileSync(envFilePath));
};

export const configProvider = {
  provide: 'CONFIG',
  useFactory: provideConfig,
};
