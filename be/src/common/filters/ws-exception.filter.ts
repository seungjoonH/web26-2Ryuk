import { Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

@Catch() // 모든 예외를 잡음
export class WsExceptionFilter extends BaseWsExceptionFilter {
  private readonly logger = new Logger(WsExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToWs();
    const client = ctx.getClient();
    const data = ctx.getData();

    // 디버깅: 받은 원본 데이터 로그
    this.logger.debug(`예외 필터 - 받은 데이터: ${JSON.stringify(data)}, 타입: ${typeof data}`);

    const errorResponse = {
      event: 'error',
      data: {
        path: `event: ${ctx.getPattern()}`,
        message: 'Internal server error',
      },
    };

    if (exception instanceof WsException) {
      // NestJS WebSocket 전용 예외
      errorResponse.data.message = exception.getError() as string;
    } else if (exception instanceof HttpException) {
      // ValidationPipe 등에서 발생하는 HttpException 처리
      const response = exception.getResponse();
      let message: string | string[];

      if (typeof response === 'object' && response !== null && 'message' in response) {
        // NestJS 기본 오류 응답 형식: { statusCode, message, error }
        message = (response as { message: string | string[] }).message;
      } else {
        // 그 외의 경우 (예: 문자열 응답)
        message = exception.message;
      }

      if (Array.isArray(message)) {
        errorResponse.data.message = message.join(', ');
      } else {
        errorResponse.data.message = message;
      }
    } else if (exception instanceof Error) {
      // 그 외 일반적인 JavaScript 에러
      errorResponse.data.message = exception.message;
    }

    client.emit(errorResponse.event, errorResponse.data);
  }
}
