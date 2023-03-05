import { Inject } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  InputType,
  Field,
  ID,
  Resolver,
  Mutation,
  Args,
  Query,
} from '@nestjs/graphql';
import {
  ChageUserNameCommand,
  CreateUserCommand,
} from '@src/user/commands/user.command';
import { User } from '@src/user/entities/user.read.entity';
import {
  UserCreatedEvent,
  UserNameChagedEvent,
} from '@src/user/events/user.event';
import { UserAggregate } from '@src/user/user.aggregate';
import { plainToInstance } from 'class-transformer';
import { PubSub } from 'graphql-subscriptions';
import { ClsService } from 'nestjs-cls';
import { v4 as uuid } from 'uuid';

@InputType()
class CreateUserInput {
  @Field(() => ID)
  aggregateId: string;

  @Field()
  name: string;

  @Field()
  email: string;
}

@InputType()
class ChageUserNameInput {
  @Field(() => ID)
  aggregateId: string;

  @Field()
  name: string;
}

@Resolver(() => UserAggregate)
export class UserResolver {
  constructor(
    private readonly commandBus: CommandBus,
    @Inject('PUB_SUB') private readonly pubsub: PubSub,
    private readonly cls: ClsService,
  ) {}

  @Query(() => String)
  async dummy() {
    return '';
  }

  @Mutation(() => User)
  async signUp(@Args('input') input: CreateUserInput): Promise<User> {
    const command = new CreateUserCommand(
      input.aggregateId,
      input.name,
      input.email,
    );

    const commandId = `${uuid()}`;

    this.cls.set('COMMAND_CALLBACK', async (event) => {
      await this.pubsub.publish(commandId, event);
    });

    await this.commandBus.execute(command);
    const userCreatedEvent = await this.pubsub
      .asyncIterator<UserCreatedEvent>(commandId)
      .next();

    return plainToInstance(User, userCreatedEvent.value, {
      excludeExtraneousValues: true,
    });
  }

  @Mutation(() => User)
  async chageUserName(@Args('input') input: ChageUserNameInput): Promise<User> {
    const command = new ChageUserNameCommand(input.aggregateId, input.name);

    const commandId = `${uuid()}`;

    this.cls.set('COMMAND_CALLBACK', async (event) => {
      await this.pubsub.publish(commandId, event);
    });

    await this.commandBus.execute(command);
    const userNameChangedEvent = await this.pubsub
      .asyncIterator<UserNameChagedEvent>(commandId)
      .next();

    return plainToInstance(User, userNameChangedEvent.value, {
      excludeExtraneousValues: true,
    });
  }
}
