/**
 * 로그 메시지 중앙 관리
 */

type LogLevel = 'log' | 'warn' | 'debug' | 'error';

interface LoggerLike {
  log: Function;
  warn: Function;
  debug: Function;
  error: Function;
}

interface LogMessage {
  message: string;
  level: LogLevel;
}

export const LOG = {
  // WebSocket 연결 관련
  WS: {
    CONNECT: (socketId: string, userId?: string): LogMessage => ({
      message: `클라이언트 연결: socketId=${socketId}, userId=${userId || 'anonymous'}`,
      level: 'log',
    }),
    DISCONNECT: (socketId: string, userId?: string): LogMessage => ({
      message: `클라이언트 연결 해제: socketId=${socketId}, userId=${userId || 'anonymous'}`,
      level: 'log',
    }),
    AUTH_CONNECT: (userId: string): LogMessage => ({
      message: `인증된 사용자 연결: userId=${userId}`,
      level: 'log',
    }),
    UNAUTH_CONNECT: (socketId: string): LogMessage => ({
      message: `인증되지 않은 사용자 연결: socketId=${socketId}`,
      level: 'log',
    }),
  },

  // 채팅 관련
  CHAT: {
    GLOBAL_BROADCAST: (userId: string, message: string): LogMessage => ({
      message: `글로벌 메시지 브로드캐스트: userId=${userId}, message=${message}`,
      level: 'log',
    }),
    ROOM_BROADCAST: (roomId: string, userId: string, message: string): LogMessage => ({
      message: `방 메시지 브로드캐스트: roomId=${roomId}, userId=${userId}, message=${message}`,
      level: 'log',
    }),
    USER_JOINED: (roomId: string, userId: string): LogMessage => ({
      message: `사용자 참여 알림: roomId=${roomId}, userId=${userId}`,
      level: 'log',
    }),
    USER_LEFT: (roomId: string, userId: string): LogMessage => ({
      message: `사용자 퇴장 알림: roomId=${roomId}, userId=${userId}`,
      level: 'log',
    }),
    UNAUTH_SEND: (socketId: string): LogMessage => ({
      message: `인증되지 않은 사용자의 메시지 송신 시도: socketId=${socketId}`,
      level: 'warn',
    }),
    UNAUTH_ROOM_SEND: (socketId: string): LogMessage => ({
      message: `인증되지 않은 사용자의 방 메시지 송신 시도: socketId=${socketId}`,
      level: 'warn',
    }),
    NOT_MEMBER_SEND: (userId: string, roomId: string): LogMessage => ({
      message: `방 참여자가 아닌 사용자의 메시지 송신 시도: userId=${userId}, roomId=${roomId}`,
      level: 'warn',
    }),
  },

  // 방 관련
  ROOM: {
    JOIN: (userId: string, roomId: string): LogMessage => ({
      message: `사용자 방 입장: userId=${userId}, roomId=${roomId}`,
      level: 'log',
    }),
    LEAVE: (userId: string, roomId: string): LogMessage => ({
      message: `사용자 방 퇴장: userId=${userId}, roomId=${roomId}`,
      level: 'log',
    }),
    JOIN_SWITCH: (userId: string, oldRoomId: string, newRoomId: string): LogMessage => ({
      message: `기존 로컬 방 퇴장 후 새 방 입장: userId=${userId}, 기존방=${oldRoomId}, 새방=${newRoomId}`,
      level: 'log',
    }),
    UNAUTH_JOIN: (socketId: string): LogMessage => ({
      message: `인증되지 않은 사용자의 방 입장 시도: socketId=${socketId}`,
      level: 'warn',
    }),
    UNAUTH_LEAVE: (socketId: string): LogMessage => ({
      message: `인증되지 않은 사용자의 방 퇴장 시도: socketId=${socketId}`,
      level: 'warn',
    }),
    NO_PERMISSION: (userId: string, roomId: string): LogMessage => ({
      message: `방 입장 권한 없음: userId=${userId}, roomId=${roomId}`,
      level: 'warn',
    }),
    ALREADY_IN: (userId: string, roomId: string): LogMessage => ({
      message: `이미 참여 중인 방: userId=${userId}, roomId=${roomId}`,
      level: 'debug',
    }),
    NOT_IN: (userId: string, roomId: string): LogMessage => ({
      message: `참여하지 않은 방: userId=${userId}, roomId=${roomId}`,
      level: 'debug',
    }),
    USER_JOINED: (userId: string, roomId: string): LogMessage => ({
      message: `사용자 ${userId}가 방 ${roomId}에 참여했습니다.`,
      level: 'log',
    }),
    USER_LEFT: (userId: string, roomId: string): LogMessage => ({
      message: `사용자 ${userId}가 방 ${roomId}에서 퇴장했습니다.`,
      level: 'log',
    }),
    PERMISSION_CHECK: (userId: string, roomId: string): LogMessage => ({
      message: `권한 검증: userId=${userId}, roomId=${roomId}`,
      level: 'debug',
    }),
    INITIALIZED: {
      message: `RoomService가 Redis 클라이언트와 함께 초기화되었습니다.`,
      level: 'log',
    },
    ERROR_INITIALIZING_GLOBAL_ROOM: (error: string): LogMessage => ({
      message: `글로벌 방 초기화 중 오류 발생: ${error}`,
      level: 'error',
    }),
  },
} as const;

/**
 * Logger 헬퍼 함수
 * 로그 레벨에 따른 메서드 호출
 */
export function logMessage(logger: LoggerLike, logMsg: LogMessage): void {
  const { message, level } = logMsg;

  // prettier-ignore
  switch (level) {
    case 'log': return logger.log(message);
    case 'warn': return logger.warn(message);
    case 'debug': return logger.debug(message);
    case 'error': return logger.error(message);
  }
}
