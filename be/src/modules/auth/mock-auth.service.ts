import { Injectable } from '@nestjs/common';

export interface MockUser {
  id: string;
  name: string;
  email?: string;
}

@Injectable()
export class MockAuthService {
  // 개발용 Mock 사용자 목록
  private readonly mockUsers: MockUser[] = [
    { id: 'user_1', name: 'Alice', email: 'alice@example.com' },
    { id: 'user_2', name: 'Bob', email: 'bob@example.com' },
    { id: 'user_3', name: 'Charlie', email: 'charlie@example.com' },
    { id: 'test_user', name: 'Test User', email: 'test@example.com' },
  ];

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
