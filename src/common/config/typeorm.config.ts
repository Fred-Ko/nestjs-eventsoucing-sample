import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const postgreConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5433,
  username: 'test',
  password: 'test',
  database: 'events',
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: true,
  logging: true,
};
