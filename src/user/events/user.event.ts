import { IIEvent } from '@src/event-store/event.store.entity';

export class UserEvent implements IIEvent {
  aggregateId: string;
  version: number;

  domain = 'User';
  type: string;
}

export class UserCreatedEvent extends UserEvent {
  constructor(
    public readonly aggregateId: string,
    public readonly name: string,
    public readonly email: string,
    public readonly version: number = 0,
  ) {
    super();
  }

  type: string = this.constructor.name;
}

export class UserCreatedEventFinished extends UserCreatedEvent {}

export class UserNameChagedEvent extends UserEvent {
  constructor(
    public readonly aggregateId: string,
    public readonly name: string,
    public readonly version: number = 0,
  ) {
    super();
  }

  type: string = this.constructor.name;
}

export class UserNameChagedEventFinished extends UserNameChagedEvent {}
