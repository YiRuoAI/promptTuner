import * as dotenv from 'dotenv';

const config = dotenv.config().parsed;

export interface IEnvConfig {
  isProd: boolean;
  MYSQL_HOST: string;
  MYSQL_USERNAME: string;
  MYSQL_PASSWORD: string;
  MYSQL_DATABASE: string;
}

export const EnvConfig: IEnvConfig = {
  isProd: config.RUN_ENV === 'prod',
  MYSQL_HOST: config.MYSQL_HOST,
  MYSQL_USERNAME: config.MYSQL_USERNAME,
  MYSQL_PASSWORD: config.MYSQL_PASSWORD,
  MYSQL_DATABASE: config.MYSQL_DATABASE,
};
