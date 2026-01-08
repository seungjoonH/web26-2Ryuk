'use client';

import { useEffect, useState, useCallback } from 'react';
import { globalChatService } from '../services/GlobalChatService';
import { ChatData } from '../dtos/type';
import ChatModalBase from './ChatModalBase';
import { GlobalChatProps } from './type';

/**
 * GlobalChat 클라이언트 컴포넌트
 * WebSocket 연결 및 메시지 관리 담당
 */
export default function GlobalChat({ chats: initialChats, onlineCount = 0 }: GlobalChatProps) {
  const [chats, setChats] = useState<ChatData[]>(initialChats || []);
  const [isConnected, setIsConnected] = useState(false);

  // WebSocket 연결 및 구독
  useEffect(() => {
    // GlobalChatService를 통해 WebSocket 연결 및 구독
    globalChatService.subscribe();

    // 메시지 수신 콜백 등록
    const unsubscribeMessage = globalChatService.onMessage((message) =>
      setChats((prev) => [...prev, message]),
    );

    // 연결 상태 변경 콜백 등록
    const unsubscribeConnection = globalChatService.onConnectionChange((connected) =>
      setIsConnected(connected),
    );

    // 초기 연결 상태 설정
    setIsConnected(globalChatService.isConnected());

    // 정리 함수
    return () => {
      unsubscribeMessage();
      unsubscribeConnection();
      globalChatService.unsubscribe();
    };
  }, []);

  // 메시지 전송 핸들러
  const handleMessageSubmit = useCallback((message: string) => {
    globalChatService.sendMessage(message);
  }, []);

  return (
    <ChatModalBase
      iconName="globe"
      title="전체 채팅"
      participantCount={onlineCount}
      chats={chats}
      onMessageSubmit={handleMessageSubmit}
      isConnected={isConnected}
    />
  );
}
