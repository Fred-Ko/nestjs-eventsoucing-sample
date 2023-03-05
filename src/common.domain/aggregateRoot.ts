import { AggregateRoot as NestJSAggregateRoot } from '@nestjs/cqrs';

export class AggregateRoot extends NestJSAggregateRoot {
  protected getEventName(event: any): string {
    const { constructor } = Object.getPrototypeOf(event);
    if (constructor.name === 'Object') return event.type;
    else return constructor.name as string;
  }
}
