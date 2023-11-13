import { InternalServerErrorException, Module } from '@nestjs/common';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import * as dotenv from 'dotenv';
import dbConfig from './config/db.config';
import commonConfig from './config/common.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';

dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`env/.${process.env.NODE_ENV}.env`],
      load: [commonConfig, dbConfig],
    }),

    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        const { host, port, database, password, username } =
          config.get<ConfigType<typeof dbConfig>>('db');
        return {
          type: 'mysql', // type: 'postgre', add schema option
          host,
          port: +port,
          password,
          username,
          database,
          synchronize: false,
          logging: true,
          entities: [],
          namingStrategy: new SnakeNamingStrategy(),
        };
      },
      dataSourceFactory: async (options) => {
        if (!options) {
          throw new InternalServerErrorException(
            'invalid typeorm datasource options passed ',
          );
        }

        return addTransactionalDataSource(new DataSource(options));
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
