import { Field, ObjectType } from '@nestjs/graphql';
import { ErrorCode, assert } from '@src/common/utils/assert';
import { isNotEmptyString } from '@src/common/utils/type-validation';
import { AggregateRoot } from '@src/common.domain/aggregateRoot';
import {
  UserCreatedEvent,
  UserNameChagedEvent,
} from '@src/user/events/user.event';
import { IUser } from '@src/user/interfaces/user.interface';

@ObjectType()
export class UserAggregate extends AggregateRoot implements IUser {
  @Field()
  aggregateId?: string;

  @Field()
  name?: string;

  @Field()
  email?: string;

  version: number = -1;

  constructor() {
    super();
  }

  create(param: {
    aggregateId: UserAggregate['aggregateId'];
    name: UserAggregate['name'];
    email: UserAggregate['email'];
  }) {
    this.apply(
      new UserCreatedEvent(
        param.aggregateId,
        param.name,
        param.email,
        this.version + 1,
      ),
    );
  }

  changeName(param: { name: UserAggregate['name'] }) {
    this.apply(
      new UserNameChagedEvent(this.aggregateId, param.name, this.version + 1),
    );
  }

  onUserCreatedEvent(event: UserCreatedEvent) {
    assert(
      this.version === -1,
      '유저 생성 이벤트는 항상 처음이어야 합니다.',
      ErrorCode.EVENT_STREAM_CORRUPTION,
    );

    this.aggregateId = event.aggregateId;
    this.name = event.name;
    this.email = event.email;
    this.version = event.version;
  }

  onUserNameChagedEvent(event: UserNameChagedEvent) {
    assert(
      this.version >= 1,
      '유저 이름 변경 이벤트는 항상 두번째 이후 이어야 합니다.',
      ErrorCode.EVENT_STREAM_CORRUPTION,
    );

    assert(
      isNotEmptyString(this.name),
      '유저의 이름이 존재해야 합니다.',
      ErrorCode.EVENT_STREAM_CORRUPTION,
    );

    this.name = event.name;
    this.version = event.version;
  }
}
