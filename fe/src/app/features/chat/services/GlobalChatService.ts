'use client';

import { ChatData } from '@/app/features/chat/dtos/type';
import { ChatChannel } from './type';
import { WebSocketService } from '@/app/services/websocket.service';
import { authStore } from '@/app/features/user/stores/auth';

type MessageCallback = (message: ChatData) => void;
type ConnectionCallback = (isConnected: boolean) => void;

interface GlobalMessageData {
  userId: string;
  message: string;
  timestamp: string;
}

interface WebSocketError {
  message: string;
}

/**
 * GlobalChat 클라이언트 서비스
 * 클라이언트에서 WebSocket 연결 및 메시지 관리 담당
 */
export class GlobalChatService implements ChatChannel {
  private messageCallbacks: Set<MessageCallback> = new Set();
  private connectionCallbacks: Set<ConnectionCallback> = new Set();
  private isSubscribed = false;
  private messages: ChatData[] = [];

  /**
   * WebSocket 연결 및 글로벌 채팅 구독
   */
  subscribe(): void {
    if (this.isSubscribed) {
      console.warn('[GlobalChatService] Already subscribed');
      return;
    }

    const wsUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    WebSocketService.connect(wsUrl);

    this.registerEventHandlers();
    this.notifyConnection(WebSocketService.isConnected());
    this.isSubscribed = true;
  }

  /**
   * WebSocket 이벤트 핸들러 등록
   */
  private registerEventHandlers(): void {
    WebSocketService.on('connect', this.handleConnect.bind(this));
    WebSocketService.on('disconnect', this.handleDisconnect.bind(this));
    WebSocketService.on('chat:global:new-message', this.handleGlobalMessage.bind(this));
    WebSocketService.on('error', this.handleError.bind(this));
  }

  /**
   * WebSocket 연결 이벤트 핸들러
   */
  private handleConnect(): void {
    this.notifyConnection(true);
    console.log('[GlobalChatService] WebSocket connected');
  }

  /**
   * WebSocket 연결 해제 이벤트 핸들러
   */
  private handleDisconnect(): void {
    this.notifyConnection(false);
    console.log('[GlobalChatService] WebSocket disconnected');
  }

  /**
   * 글로벌 채팅 메시지 수신 이벤트 핸들러
   */
  private handleGlobalMessage(data: GlobalMessageData): void {
    const { userId, message, timestamp } = data;
    const currentUserId = authStore.getState().userId;

    const chatData: ChatData = {
      id: `global_${Date.now()}_${Math.random()}`,
      authorId: userId,
      authorNickname: '', // TODO: 사용자 정보 조회 필요
      message,
      createDate: new Date(timestamp),
      isMe: userId === currentUserId,
    };

    this.messages.push(chatData);
    this.notifyMessage(chatData);
  }

  /**
   * WebSocket 에러 이벤트 핸들러
   */
  private handleError(error: WebSocketError): void {
    console.error('[GlobalChatService] WebSocket error:', error);
    if (error.message === '인증이 필요합니다.') {
      console.warn('[GlobalChatService] Authentication required');
    }
  }

  /**
   * 글로벌 채팅 구독 해제
   */
  unsubscribe(): void {
    if (!this.isSubscribed) return;

    WebSocketService.off('connect');
    WebSocketService.off('disconnect');
    WebSocketService.off('chat:global:new-message');
    WebSocketService.off('error');

    this.isSubscribed = false;
  }

  /**
   * 메시지 전송
   */
  sendMessage(message: string): void {
    const isAuthenticated = authStore.getState().isAuthenticated;

    if (!isAuthenticated) {
      alert('메시지를 보내려면 로그인이 필요합니다.');
      return;
    }

    if (!WebSocketService.isConnected()) {
      alert('WebSocket이 연결되지 않았습니다.');
      return;
    }

    WebSocketService.send('chat:global:send', { message });
  }

  /**
   * 메시지 수신 콜백 등록
   */
  onMessage(callback: MessageCallback): () => void {
    this.messageCallbacks.add(callback);
    return () => this.messageCallbacks.delete(callback);
  }

  /**
   * 연결 상태 변경 콜백 등록
   */
  onConnectionChange(callback: ConnectionCallback): () => void {
    this.connectionCallbacks.add(callback);
    return () => this.connectionCallbacks.delete(callback);
  }

  /**
   * 현재 연결 상태 확인
   */
  isConnected(): boolean {
    return WebSocketService.isConnected();
  }

  /**
   * 저장된 메시지 가져오기
   */
  getMessages(): ChatData[] {
    return [...this.messages];
  }

  private notifyMessage(message: ChatData): void {
    this.messageCallbacks.forEach((callback) => callback(message));
  }

  private notifyConnection(isConnected: boolean): void {
    this.connectionCallbacks.forEach((callback) => callback(isConnected));
  }
}

export const globalChatService = new GlobalChatService();
