import {
  AppendExpectedRevision,
  BACKWARDS,
  END,
  EventStoreDBClient,
  FORWARDS,
  NO_STREAM,
  START,
  jsonEvent,
} from '@eventstore/db-client';
import * as F from '@fxts/core';
import { Inject, Injectable } from '@nestjs/common';
import { AggregateRoot } from '@src/common.domain/aggregateRoot';
import { IIEvent } from '@src/event-store/event.store.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class EventStoreRepository {
  constructor(
    @Inject('EventStoreDBClient')
    private readonly eventStore: EventStoreDBClient,
  ) {}

  async save(event: IIEvent, curState: AggregateRoot) {
    const domainName = event.domain;
    const streamId = `${domainName}-${event.aggregateId}`;
    const snapshotId = `snapshot-${streamId}`;

    const revision: AppendExpectedRevision =
      event.version === 0 ? NO_STREAM : BigInt(event.version - 1);
    const result = await this.eventStore.appendToStream(
      streamId,
      jsonEvent({
        type: event.type,
        data: event as any,
      }),
      { expectedRevision: revision },
    );

    if (curState && event.version % 3 === 0) {
      // save snapshot
      try {
        await this.eventStore.appendToStream(
          snapshotId,
          jsonEvent({
            type: 'snapshot',
            data: curState as any,
          }),
        );
      } catch (err) {
        //warn log
        console.warn(err);
      }
    }

    return result;
  }

  async findById<T extends AggregateRoot>(
    AggregateRoot: new () => T,
    domain: string,
    aggregateId: string,
  ): Promise<T> {
    const domainName = domain;
    const streamId = `${domainName}-${aggregateId}`;
    const snapshotId = `snapshot-${streamId}`;

    const lastSnapShot = await F.pipe(
      this.eventStore.readStream(snapshotId, {
        direction: BACKWARDS,
        fromRevision: END,
        maxCount: 1,
      }),
      F.toArray,
      F.map((e) => e.event?.data),
      F.toArray,
      F.head,
    );

    const fromRevision = lastSnapShot
      ? // @ts-ignore
        BigInt(lastSnapShot.version + 1)
      : START;

    const aggregate = plainToInstance(AggregateRoot, lastSnapShot);

    //@ts-ignore
    const events =
      (await F.pipe(
        this.eventStore.readStream(streamId, {
          fromRevision: fromRevision,
          direction: FORWARDS,
        }),
        F.toArray,
        F.map((e) => e.event?.data),
        F.toArray,
      )) ?? [];

    aggregate.loadFromHistory(events);
    return aggregate;
  }
}
