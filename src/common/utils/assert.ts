// assert.ts

/*
- assert 함수는 조건식이 false일 경우 에러를 발생시키는 함수
- 같이 발생시킬 에러메세지
- 같이 발생시킬 에러코드
- 로직
    - NodeEnv에 따라 stack trace를 출력할지 말지 결정
    - development,stage 환경에서는 stack trace를 출력
    - production 환경에서는 stack trace를 출력하지 않음
*/

export enum ErrorCode {
  INVALID_ARGUMENT = 'INVALID_ARGUMENT',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  EVENT_STREAM_CORRUPTION = 'EVENT_STREAM_CORRUPTION',
}

export class AssertionError extends Error {
  constructor(
    public errorMessage: string,
    public errorCode: ErrorCode = ErrorCode.INTERNAL_SERVER_ERROR,
    public errorStack?,
  ) {
    super(errorMessage);
  }
}

export function assert(
  condition: boolean,
  message: string,
  errorCode: ErrorCode,
) {
  if (!condition) {
    if (process.env.NODE_ENV === 'production') {
      throw new AssertionError(message, errorCode);
    }
    if (process.env.NODE_ENV === 'stage') {
      throw new AssertionError(message, errorCode);
    }
    if (process.env.NODE_ENV === 'development') {
      throw new AssertionError(message, errorCode);
    } else {
      throw new AssertionError(message, errorCode);
    }
  }
}
