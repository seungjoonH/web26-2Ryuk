/**
 * 방 타입 상수 및 타입 정의
 */

export const ROOM_TYPE = {
  GLOBAL: 'GLOBAL',
  LOCAL: 'LOCAL',
} as const;

export type RoomType = (typeof ROOM_TYPE)[keyof typeof ROOM_TYPE];
