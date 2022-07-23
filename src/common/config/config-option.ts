import { Environment } from '../enviroment';

export const getEnvFilePath = () => {
  return process.env.NODE_ENV === Environment.Test ? './.env.test' : './.env.development';
};

export const isIgnoredEnvFile = () => {
  return process.env.NODE_ENV === Environment.Production;
};
