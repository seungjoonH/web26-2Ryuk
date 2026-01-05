export class WebSocketService {
  static connect(
    url: string,
    onMessage?: (data: unknown) => void,
    onError?: (error: Error) => void,
  ): void {
    // TODO: WebSocket 연결 구현
  }

  static disconnect(): void {
    // TODO: WebSocket 연결 해제 구현
  }

  static send(message: unknown): void {
    // TODO: WebSocket을 통해 메시지 전송
  }

  static isConnected(): boolean {
    // TODO: 연결 상태 확인
    return false;
  }
}
