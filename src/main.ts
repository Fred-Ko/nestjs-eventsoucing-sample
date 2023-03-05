import { NestFactory } from '@nestjs/core';
import { AllExceptionsFilter } from '@src/common/exception-ilters/http.filter';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(3000);
}
bootstrap();
