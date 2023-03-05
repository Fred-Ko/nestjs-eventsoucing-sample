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
  imports: [],
  controllers: [],
  providers: [],
})
export class ConfigModule {}
