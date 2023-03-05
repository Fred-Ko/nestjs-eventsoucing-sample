import { AggregateRoot } from '@src/common.domain/aggregateRoot';

export interface IIEvent {
  domain: string;
  aggregateId: string;
  type: string;
  version: number;
}

export interface IICommand {
  domain: string;
}

export class Snapshot {
  constructor(
    public aggregateId: string,
    public aggregate: AggregateRoot,
    public version: number,
  ) {}
}

export class Event {
  constructor(
    public readonly aggregateId: string,
    public readonly event: IIEvent,
    public readonly version: number,
  ) {}
}
