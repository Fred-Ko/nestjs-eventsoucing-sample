import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { GraphQLModule } from '@nestjs/graphql';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AllExceptionsFilter } from '@src/common/exception-ilters/http.filter';
import { EventModule } from '@src/event/event.module';
import { EventStoreModule } from '@src/event-store/event.store.module';
import { UserModule } from '@src/user/user.module';
import { PubSub } from 'graphql-subscriptions';
import { ClsModule } from 'nestjs-cls';

@Module({
  imports: [
    CqrsModule,
    EventStoreModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      debug: false,
      playground: true,
      autoSchemaFile: true,
      installSubscriptionHandlers: true,
      context: ({ req, connection }) => {
        if (req) {
          return { authorizationId: req['authorizationId'] };
        } else {
          return { authorizationId: connection.context.authorizationId };
        }
      },
    }),
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'test',
      password: 'test',
      database: 'test',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: true,
    }),
    UserModule,
    EventModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
