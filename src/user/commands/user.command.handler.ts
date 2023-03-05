import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { EventStoreRepository } from '@src/event-store/event.store.repository';
import {
  CreateUserCommand,
  ChageUserNameCommand,
} from '@src/user/commands/user.command';
import { UserAggregate } from '@src/user/user.aggregate';
import { ClsService } from 'nestjs-cls';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly cls: ClsService,
  ) {}

  async execute(command: CreateUserCommand) {
    const { aggregateId, name, email } = command;

    const newUser = this.publisher.mergeObjectContext(new UserAggregate());
    newUser.create({ aggregateId, name, email });
    this.cls.set('instance', newUser);
    newUser.commit();
  }
}

@CommandHandler(ChageUserNameCommand)
export class ChageUserNameCommandHandler
  implements ICommandHandler<ChageUserNameCommand>
{
  constructor(
    private readonly publisher: EventPublisher,
    private readonly eventStore: EventStoreRepository,
    private readonly cls: ClsService,
  ) {}

  async execute(command: ChageUserNameCommand) {
    const { domain, aggregateId, name } = command;

    const user = this.publisher.mergeObjectContext(
      await this.eventStore.findById(UserAggregate, domain, aggregateId),
    );

    user.changeName({ name });
    this.cls.set('instance', user);
    user.commit();
  }
}
