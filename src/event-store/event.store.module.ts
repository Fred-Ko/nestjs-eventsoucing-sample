import { EventStoreDBClient } from '@eventstore/db-client';
import { Global, Module } from '@nestjs/common';
import { eventStoreDBConfig } from '@src/common/config/event-stroe-db.config';
import { EventStoreRepository } from '@src/event-store/event.store.repository';

const EventStoreDBModule = {
  provide: 'EventStoreDBClient',
  useFactory: () => {
    const host = eventStoreDBConfig.host;
    const port = eventStoreDBConfig.port;
    const tls = eventStoreDBConfig.tls;

    return EventStoreDBClient.connectionString(
      `esdb://${host}:${port}?tls=${tls}`,
    );
  },
};

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [EventStoreDBModule, EventStoreRepository],
  exports: [EventStoreRepository],
})
export class EventStoreModule {}
