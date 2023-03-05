import { WrongExpectedVersionError } from '@eventstore/db-client';
import { Catch, ExceptionFilter } from '@nestjs/common';
import { AssertionError } from '@src/common/utils/assert';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(err) {
    console.log(err);
  }
}
