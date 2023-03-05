import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { ignoreError } from '@src/common/utils/try-catch';
import { EventStoreRepository } from '@src/event-store/event.store.repository';
import { User } from '@src/user/entities/user.read.entity';
import {
  UserCreatedEvent,
  UserNameChagedEvent,
} from '@src/user/events/user.event';
import { ClsService } from 'nestjs-cls';
import { Repository } from 'typeorm';

@EventsHandler(UserCreatedEvent)
export class UserCreatedEventHandler
  implements IEventHandler<UserCreatedEvent>
{
  constructor(
    private readonly eventStore: EventStoreRepository,
    private readonly cls: ClsService,
    @InjectRepository(User) private readonly repository: Repository<User>,
  ) {}

  async handle(event: UserCreatedEvent) {
    const curState = this.cls.get('instance');

    try {
      await this.eventStore.save(event, curState);
    } catch (error) {
      throw error;
    }
    ignoreError(async () => await this.repository.save(curState));
    await this.cls.get('COMMAND_CALLBACK')?.(event);
  }
}

@EventsHandler(UserNameChagedEvent)
export class UserNameChagedEventHandler
  implements IEventHandler<UserNameChagedEvent>
{
  constructor(
    private readonly eventStore: EventStoreRepository,
    private readonly cls: ClsService,
    @InjectRepository(User) private readonly repository: Repository<User>,
  ) {}

  async handle(event: UserNameChagedEvent) {
    const curState = this.cls.get('instance');

    await this.eventStore.save(event, curState);
    ignoreError(async () => await this.repository.save(curState));
    await this.cls.get('COMMAND_CALLBACK')?.(event);
  }
}
