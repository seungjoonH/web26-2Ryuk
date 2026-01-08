import { Injectable } from '@nestjs/common';

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
  // 개발용 Mock 사용자 목록
  private readonly mockUsers: MockUser[] = [
    {
      id: 'user_1',
      email: 'alice@example.com',
      nickname: '앨리스',
      profile_image: 'https://cdn.example.com/u1.png',
      role: 'USER',
      is_blacklisted: false,
      warning_count: 0,
      create_date: new Date('2024-01-01'),
      update_date: null,
    },
    {
      id: 'user_2',
      email: 'bob@example.com',
      nickname: '밥',
      profile_image: 'https://cdn.example.com/u2.png',
      role: 'USER',
      is_blacklisted: false,
      warning_count: 0,
      create_date: new Date('2024-01-02'),
      update_date: null,
    },
    {
      id: 'user_3',
      email: 'charlie@example.com',
      nickname: '찰리',
      profile_image: null,
      role: 'USER',
      is_blacklisted: false,
      warning_count: 0,
      create_date: new Date('2024-01-03'),
      update_date: null,
    },
    {
      id: 'test_user',
      email: 'test@example.com',
      nickname: '테스트',
      profile_image: 'https://cdn.example.com/test.png',
      role: 'ADMIN',
      is_blacklisted: false,
      warning_count: 0,
      create_date: new Date('2024-01-04'),
      update_date: null,
    },
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
