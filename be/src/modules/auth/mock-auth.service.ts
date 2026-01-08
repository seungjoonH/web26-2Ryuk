import { Injectable } from '@nestjs/common';
import mockUsersData from '../../mocks/users.js';

export interface MockUser {
  id: string;
  email: string;
  nickname: string;
  profile_image: string | null;
  role: 'USER' | 'ADMIN';
  is_blacklisted: boolean;
  warning_count: number;
  create_date: Date;
  update_date: Date | null;
}

@Injectable()
export class MockAuthService {
  // 개발용 Mock 사용자 목록 (users.js에서 로드)
  private readonly mockUsers: MockUser[];

  constructor() {
    // JSON 데이터를 MockUser 형식으로 변환 (Date 객체 변환)
    this.mockUsers = mockUsersData.map((user: any) => ({
      ...user,
      create_date: new Date(user.create_date),
      update_date: user.update_date ? new Date(user.update_date) : null,
    }));
  }

  /**
   * Mock JWT 토큰 생성 (실제 검증 없이)
   * 형식: mock_token_{userId}_{timestamp}
   */
  generateMockToken(userId: string): string {
    const timestamp = Date.now();
    return `mock_token_${userId}_${timestamp}`;
  }

  /**
   * Mock 토큰에서 userId 추출
   * @returns { userId: string } | null
   */
  verifyMockToken(token: string): { userId: string } | null {
    if (!token || !token.startsWith('mock_token_')) return null;

    const match = token.match(/^mock_token_(.+)_\d+$/);
    if (!match) return null;

    const userId = match[1];

    // Mock 사용자 목록에 있는지 확인
    const userExists = this.mockUsers.some((user) => user.id === userId);
    if (!userExists) return null;

    return { userId };
  }

  /**
   * 개발용 Mock 사용자 목록 반환
   */
  getMockUsers(): MockUser[] {
    return this.mockUsers;
  }

  /**
   * userId로 Mock 사용자 조회
   */
  getMockUserById(userId: string): MockUser | undefined {
    return this.mockUsers.find((user) => user.id === userId);
  }
}
