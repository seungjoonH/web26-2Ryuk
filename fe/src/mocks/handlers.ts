/**
 * MSW 핸들러 정의
 *
 * 개발 환경에서 API 요청을 모킹하기 위한 핸들러들을 정의
 */
import { http, HttpResponse } from 'msw';
import roomsMock from './data/rooms.json';
import postListCardMock from './data/postListCard.json';
import profilesMock from './data/profiles.json';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const handlers = [
  // Rooms API (전체 방 목록 조회)
  http.get(`${baseUrl}/api/rooms/all`, () => {
    // 빈 배열인 경우 204 응답
    if (!roomsMock.rooms || roomsMock.rooms.length === 0) {
      return HttpResponse.json(
        {
          success: true,
          message: '방 목록 조회에 성공 했습니다.',
          data: {
            rooms: [],
          },
        },
        { status: 204 },
      );
    }

    // 정상 응답
    return HttpResponse.json({
      success: true,
      message: '방 목록 조회에 성공 했습니다.',
      data: {
        rooms: roomsMock.rooms,
      },
    });
  }),

  // Room API (단일 방 조회)
  http.get(`${baseUrl}/api/rooms/:roomId`, ({ params }) => {
    const { roomId } = params;
    const room = roomsMock.rooms.find((r) => r.id === roomId);
    if (!room) {
      return HttpResponse.json(
        { success: false, message: '존재하지 않는 방입니다.' },
        { status: 404 },
      );
    }
    return HttpResponse.json({
      success: true,
      message: '방 상세 조회에 성공 했습니다.',
      data: room,
    });
  }),

  // Popular Posts API
  http.get(`${baseUrl}/api/posts/popular`, ({ request }) => {
    const url = new URL(request.url);
    const limit = url.searchParams.get('limit');

    // limit 파라미터가 있으면 posts를 제한
    if (limit) {
      const limitNum = parseInt(limit, 10);
      return HttpResponse.json({
        ...postListCardMock,
        posts: postListCardMock.posts.slice(0, limitNum),
      });
    }

    return HttpResponse.json(postListCardMock);
  }),

  // User Profile API (특정 사용자 정보)
  http.get(`${baseUrl}/api/users/:userId/profile`, ({ params }) => {
    const { userId } = params;
    const profile = profilesMock.find((p) => p.id === userId);

    if (!profile) return HttpResponse.json({ error: 'Profile not found' }, { status: 404 });
    return HttpResponse.json(profile);
  }),
];
