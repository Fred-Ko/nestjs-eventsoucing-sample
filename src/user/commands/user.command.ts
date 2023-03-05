import { IICommand } from '@src/event-store/event.store.entity';
import { User } from '@src/user/entities/user.read.entity';

export class ABSUserCommand implements IICommand {
  domain = 'User';
}

export class CreateUserCommand extends ABSUserCommand {
  constructor(
    readonly aggregateId: User['aggregateId'],
    readonly name: User['name'],
    readonly email: User['email'],
  ) {
    super();
  }
}

export class ChageUserNameCommand extends ABSUserCommand {
  constructor(
    readonly aggregateId: User['aggregateId'],
    readonly name: User['name'],
  ) {
    super();
  }
}
