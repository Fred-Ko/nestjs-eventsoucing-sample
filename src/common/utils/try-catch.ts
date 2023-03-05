import { Logger } from '@nestjs/common';

export async function ignoreError<T>(callback: () => T): Promise<T> {
  try {
    return await callback();
  } catch (err) {
    Logger.warn(err);
  }
}
