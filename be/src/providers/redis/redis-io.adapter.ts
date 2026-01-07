import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions, Socket } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { RedisClientType } from 'redis';
import type { ExtendedError } from 'socket.io/dist/namespace';
import { MockAuthService } from '@/modules/auth/mock-auth.service';

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;
  private pubClient: RedisClientType;
  private subClient: RedisClientType;

  // TODO: MockAuthService를 JWT 인증 서비스로 교체
  private mockAuthService: MockAuthService;

  constructor(app: any) {
    super(app);
    // TODO: JWT 인증 서비스로 교체
    this.mockAuthService = new MockAuthService();
  }

  async connectToRedis(pubClient: RedisClientType): Promise<void> {
    // 외부에서 제공된 클라이언트 사용 (redis.provider.ts에서 생성된 클라이언트)
    this.pubClient = pubClient;
    // Socket.io 어댑터를 위한 subClient 생성 (duplicate는 별도 연결 필요)
    this.subClient = pubClient.duplicate();

    // pubClient는 이미 연결되어 있으므로 subClient만 연결
    await this.subClient.connect();
    this.adapterConstructor = createAdapter(this.pubClient, this.subClient);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const frontendUrl = process.env.FRONTEND_URL;
    if (!frontendUrl) throw new Error('FRONTEND_URL 환경 변수가 설정되지 않았습니다.');

    const server = super.createIOServer(port, {
      ...options,
      cors: {
        origin: frontendUrl,
        credentials: true,
      },
    });
    server.adapter(this.adapterConstructor);

    /**
     * WebSocket 인증 미들웨어
     *
     * TODO: Mock 인증을 JWT 인증으로 교체
     */
    server.use(async (socket: Socket, next: (err?: ExtendedError) => void) => {
      const authResult = this.authenticateSocket(socket);

      if (!authResult.isAuthenticated || !authResult.userId) {
        socket.data.authenticated = false;
        return next();
      }

      await this.handleAuthenticatedSession(server, socket, authResult.userId);
      next();
    });

    return server;
  }

  /**
   * 소켓 인증 처리
   *
   * TODO: Mock 토큰 검증 로직을 JWT 토큰 검증으로 교체
   */
  private authenticateSocket(socket: Socket): {
    userId: string | null;
    isAuthenticated: boolean;
  } {
    // TODO: query.userId 방식 제거 (개발 편의용)
    const queryUserId = socket.handshake.query.userId as string;
    const token = socket.handshake.auth?.token as string;

    // TODO: Mock 토큰 검증을 JWT 토큰 검증으로 교체
    if (token && !queryUserId) {
      const payload = this.mockAuthService.verifyMockToken(token);
      if (payload) return { userId: payload.userId, isAuthenticated: true };
    }

    // TODO: query.userId 방식 제거 (개발 편의용)
    if (queryUserId) {
      const user = this.mockAuthService.getMockUserById(queryUserId);
      if (user) return { userId: queryUserId, isAuthenticated: true };
    }

    return {
      userId: null,
      isAuthenticated: false,
    };
  }

  /**
   * 인증된 사용자의 세션 관리
   */
  private async handleAuthenticatedSession(server: any, socket: Socket, userId: string): Promise<void> {
    const sessionKey = `user:session:${userId}`;
    const existingSocketId = await this.pubClient.get(sessionKey);

    // 동일 아이디로 다른 소켓이 연결되어 있다면 기존 연결 끊기
    if (existingSocketId && existingSocketId !== socket.id) {
      const existingSocket = server.sockets.sockets.get(existingSocketId);
      if (existingSocket) existingSocket.disconnect(true);
    }

    // 세션 저장 (24시간 유지)
    await this.pubClient.set(sessionKey, socket.id, { EX: 86400 });

    // socket.data에 userId 저장 (권한 검증용)
    socket.data.userId = userId;
    socket.data.authenticated = true;

    // disconnect 핸들러 설정
    this.setupDisconnectHandler(socket, sessionKey);
  }

  /**
   * 소켓 disconnect 시 세션 정리 핸들러 설정
   */
  private setupDisconnectHandler(socket: Socket, sessionKey: string): void {
    socket.on('disconnect', async () => {
      const currentId = await this.pubClient.get(sessionKey);
      if (currentId === socket.id) await this.pubClient.del(sessionKey);
    });
  }
}
