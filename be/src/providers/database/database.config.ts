import { DataSourceOptions } from 'typeorm';
import { loadEnv } from '@src/config/env';

// 공통 ENV 로더 사용
loadEnv();

const isProduction = process.env.NODE_ENV === 'production';
const databaseConfig: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [isProduction ? 'dist/**/*.entity.js' : 'src/**/*.entity.ts'],
  migrations: [isProduction ? 'dist/database/migrations/*.js' : 'src/database/migrations/*.ts'],
  synchronize: false,
  logging: !isProduction,
};

export default databaseConfig;
