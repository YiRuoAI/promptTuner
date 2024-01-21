import * as dotenv from 'dotenv';

const config = dotenv.config().parsed;

export interface IEnvConfig {
  MYSQL_HOST: string;
  MYSQL_USERNAME: string;
  MYSQL_PASSWORD: string;
  MYSQL_DATABASE: string;
}

export const EnvConfig: IEnvConfig = {
  MYSQL_HOST: config.MYSQL_HOST,
  MYSQL_USERNAME: config.MYSQL_USERNAME,
  MYSQL_PASSWORD: config.MYSQL_PASSWORD,
  MYSQL_DATABASE: config.MYSQL_DATABASE,
};
