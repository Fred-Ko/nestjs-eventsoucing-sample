import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  CreateUserHandler,
  ChageUserNameCommandHandler,
} from '@src/user/commands/user.command.handler';
import { User } from '@src/user/entities/user.read.entity';
import {
  UserCreatedEventHandler,
  UserNameChagedEventHandler,
} from '@src/user/events/user.event.handler';
import { UserResolver } from '@src/user/graphql/resolvers/user.resolver';

const CommandHandler = [CreateUserHandler, ChageUserNameCommandHandler];
const EventHandler = [UserCreatedEventHandler, UserNameChagedEventHandler];

@Module({
  imports: [
    CqrsModule,
    ClientsModule.register([
      {
        name: 'NATS_CLIENT',
        transport: Transport.NATS,
        options: {
          url: 'nats://localhost:4222',
        },
      },
    ]),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [],
  providers: [UserResolver, ...CommandHandler, ...EventHandler],
  exports: [],
})
export class UserModule {}
