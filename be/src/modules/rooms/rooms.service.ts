import { Injectable, Logger } from '@nestjs/common';
import { RedisClientType } from 'redis';
import { LOG, logMessage } from '@/shared/log-messages';

@Injectable()
export class RoomsService {
  private readonly logger = new Logger(RoomsService.name);
  private redisClient: RedisClientType;

  /**
   * Redis 클라이언트 설정
   */
  setRedisClient(client: RedisClientType) {
    this.redisClient = client;
  }

  /**
   * 사용자가 방에 참여할 수 있는 권한 검증
   *
   * 현재는 모든 사용자가 모든 방에 참여 가능
   * 방 인원 수 제한, 비밀번호 검증 등의 로직이 필요하면 이 메서드 구현 필요
   */
  async canUserJoinRoom(userId: string, roomId: string): Promise<boolean> {
    logMessage(this.logger, LOG.ROOM.PERMISSION_CHECK(userId, roomId));

    // 방이 존재하는지 확인 (필요시 Redis에서 확인)
    // 방 인원 수 제한 확인 (필요시)
    // 비밀번호 검증 (필요시)

    return true;
  }

  /**
   * 사용자 방 참여 처리
   */
  async joinRoom(userId: string, roomId: string, socketId: string): Promise<void> {
    // 방 멤버 목록에 추가, 사용자의 참여 방 목록에 추가
    await this.redisClient.sAdd(`room:${roomId}:members`, userId);
    await this.redisClient.sAdd(`user:${userId}:rooms`, roomId);

    logMessage(this.logger, LOG.ROOM.USER_JOINED(userId, roomId));
  }

  /**
   * 사용자 방 제거 처리
   */
  async leaveRoom(userId: string, roomId: string): Promise<void> {
    // 방 멤버 목록에서 제거, 사용자의 참여 방 목록에서 제거
    await this.redisClient.sRem(`room:${roomId}:members`, userId);
    await this.redisClient.sRem(`user:${userId}:rooms`, roomId);

    logMessage(this.logger, LOG.ROOM.USER_LEFT(userId, roomId));
  }

  /**
   * 사용자 특정 방 참여 여부 확인
   */
  async isUserInRoom(userId: string, roomId: string): Promise<boolean> {
    const isMember = await this.redisClient.sIsMember(`room:${roomId}:members`, userId);
    return Boolean(isMember);
  }

  /**
   * 사용자 참여 중인 모든 방 목록 조회 (글로벌 포함)
   */
  async getUserRooms(userId: string): Promise<string[]> {
    const rooms = await this.redisClient.sMembers(`user:${userId}:rooms`);
    return rooms;
  }

  /**
   * 사용자 참여 중인 로컬 방 하나 조회 (글로벌 제외)
   * 요구사항: 글로벌 채팅 + 로컬 방 하나까지만 접속 가능
   */
  async getUserLocalRoom(userId: string): Promise<string | null> {
    const rooms = await this.getUserRooms(userId);
    // "global"을 제외한 로컬 방 찾기
    // TODO: 글로벌 판단 로직 수정
    const localRooms = rooms.filter((roomId) => roomId !== 'global');
    return localRooms.length > 0 ? localRooms[0] : null;
  }

  /**
   * 방의 모든 멤버 목록 조회
   */
  async getRoomMembers(roomId: string): Promise<string[]> {
    const members = await this.redisClient.sMembers(`room:${roomId}:members`);
    return members;
  }

  /**
   * 사용자 연결 해제 시 모든 방에서 제거
   */
  async leaveAllRooms(userId: string): Promise<void> {
    const rooms = await this.getUserRooms(userId);
    for (const roomId of rooms) {
      await this.leaveRoom(userId, roomId);
    }
  }

  /**
   * 사용자 방 호스트 여부 확인
   */
  async isHost(userId: string, roomId: string): Promise<boolean> {
    const host = await this.redisClient.get(`room:${roomId}:host_id`);
    return host === userId;
  }
}
