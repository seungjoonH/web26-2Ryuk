import { DataSource } from 'typeorm';
import databaseConfig from '../database/database.config';

export default new DataSource(databaseConfig);
