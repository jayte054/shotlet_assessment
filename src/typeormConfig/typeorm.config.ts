import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config';
import { AuthEntity } from 'src/authModule/authEntity/authEntity';
import {
  CountryEntity,
  GetCountryEntity,
} from 'src/countriesModule/countriesEntity/countries.entity';

const dbConfig: any | unknown = config.get('db');
export const typeOrmConfig: TypeOrmModuleOptions = {
  type: dbConfig.type || 'postgres',
  host: process.env.RDS_HOSTNAME || dbConfig.host,
  port: parseInt(process.env.RDS_PORT, 10) || dbConfig.port,
  username: process.env.RDS_USERNAME || dbConfig.username,
  password: process.env.RDS_PASSWORD || dbConfig.password,
  database: process.env.RDS_DB_NAME || dbConfig.database,
  entities: [CountryEntity, GetCountryEntity, AuthEntity],
  synchronize: process.env.TypeORM_SYNC || dbConfig.synchronize,
  //   synchronize:
  //     process.env.TypeORM_SYNC === 'true' || dbConfig.synchronize || true,
  migrations: ['dist/migrations/*.js'], // Specify your migration directory,
};
