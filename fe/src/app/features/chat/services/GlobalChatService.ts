'use client';

import { ChatReceiveDto, ChatReceiveData } from '@/app/features/chat/dtos/type';
import { ChatConverter } from '@/app/features/chat/dtos/Chat';
import { ChatChannel } from './type';
import { WebSocketService } from '@/app/services/websocket.service';
import { authStore } from '@/app/features/user/stores/auth';

type MessageCallback = (message: ChatReceiveData) => void;
type ConnectionCallback = (isConnected: boolean) => void;
type ParticipantsCallback = (count: number) => void;

interface WebSocketError {
  message: string;
}

interface ParticipantsUpdatedDto {
  roomId: string;
  current_participants: number;
}

/**
 * GlobalChat 클라이언트 서비스
 * 클라이언트에서 WebSocket 연결 및 메시지 관리 담당
 */
export class GlobalChatService implements ChatChannel {
  private messageCallbacks: Set<MessageCallback> = new Set();
  private connectionCallbacks: Set<ConnectionCallback> = new Set();
  private participantsCallbacks: Set<ParticipantsCallback> = new Set();
  private isSubscribed = false;
  private messages: ChatReceiveData[] = [];

  /**
   * WebSocket 연결 및 글로벌 채팅 구독
   */
  subscribe(): void {
    // 프로덕션 환경에서는 상대 경로 사용 (같은 도메인)
    let wsUrl: string;
    if (typeof window !== 'undefined' && window.location.protocol === 'https:') wsUrl = '';
    else wsUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

    // 이미 구독 중이면 재연결 (인증 토큰 업데이트를 위해)
    if (this.isSubscribed) this.unsubscribe();

    // 이벤트 핸들러 등록 (socket 생성 전에도 등록 가능하도록)
    this.registerEventHandlers();

    WebSocketService.connect(wsUrl);

    // 연결 상태는 connect 이벤트 핸들러에서 업데이트됨
    // 이미 연결된 경우를 대비해 약간의 지연 후 확인 (비동기 연결 완료 대기)
    setTimeout(() => {
      if (WebSocketService.isConnected()) this.notifyConnection(true);
    }, 100);

    this.isSubscribed = true;
  }

  /**
   * WebSocket 이벤트 핸들러 등록
   */
  private registerEventHandlers(): void {
    // connect 핸들러
    WebSocketService.on('connect', () => this.handleConnect());

    // 다른 이벤트 핸들러들
    WebSocketService.on('disconnect', () => {
      this.handleDisconnect();
    });

    WebSocketService.on('chat:global:new-message', (dto: ChatReceiveDto) => {
      this.handleGlobalMessage(dto);
    });

    WebSocketService.on('chat:global:participants-updated', (dto: ParticipantsUpdatedDto) => {
      this.handleParticipantsUpdated(dto);
    });

    WebSocketService.on('error', (error: WebSocketError) => {
      this.handleError(error);
    });
  }

  /**
   * WebSocket 연결 이벤트 핸들러
   */
  private handleConnect(): void {
    this.notifyConnection(true);
  }

  /**
   * WebSocket 연결 해제 이벤트 핸들러
   */
  private handleDisconnect(): void {
    this.notifyConnection(false);
  }

  /**
   * 글로벌 채팅 메시지 수신 이벤트 핸들러
   */
  private handleGlobalMessage(dto: ChatReceiveDto): void {
    const chatData = ChatConverter.toReceiveData(dto);

    this.messages.push(chatData);
    this.notifyMessage(chatData);
  }

  /**
   * 참여자 수 업데이트 이벤트 핸들러
   */
  private handleParticipantsUpdated(dto: ParticipantsUpdatedDto): void {
    this.notifyParticipants(dto.current_participants);
  }

  /**
   * WebSocket 에러 이벤트 핸들러
   */
  private handleError(error: WebSocketError): void {
    console.error('[GlobalChatService] WebSocket error:', error);
  }

  /**
   * 글로벌 채팅 구독 해제
   */
  unsubscribe(): void {
    if (!this.isSubscribed) return;

    // 연결 상태를 먼저 false로 업데이트
    this.notifyConnection(false);

    // 모든 이벤트 핸들러 제거
    WebSocketService.off('connect');
    WebSocketService.off('disconnect');
    WebSocketService.off('chat:global:new-message');
    WebSocketService.off('chat:global:participants-updated');
    WebSocketService.off('error');

    WebSocketService.disconnect();
    this.isSubscribed = false;
  }

  /**
   * 메시지 전송
   */
  sendMessage(message: string): void {
    const isAuthenticated = authStore.getState().isAuthenticated;

    if (!isAuthenticated) throw new Error('메시지를 보내려면 로그인이 필요합니다.');
    if (!WebSocketService.isConnected()) throw new Error('WebSocket이 연결되지 않았습니다.');

    const sendData = ChatConverter.toSendData(message);
    const dto = ChatConverter.toSendDto(sendData);
    WebSocketService.send('chat:global:send', dto);
  }

  /**
   * 로그아웃 알림 (백엔드에 로그아웃 이벤트 전송)
   * WebSocket 연결은 유지하되, 참여자 수에서 제외됨
   */
  notifyLogout(): void {
    if (!WebSocketService.isConnected()) return;
    WebSocketService.send('auth:logout', {});
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
   * 참여자 수 변경 콜백 등록
   */
  onParticipantsChange(callback: ParticipantsCallback): () => void {
    this.participantsCallbacks.add(callback);
    return () => this.participantsCallbacks.delete(callback);
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
  getMessages(): ChatReceiveData[] {
    return [...this.messages];
  }

  private notifyMessage(message: ChatReceiveData): void {
    this.messageCallbacks.forEach((callback) => callback(message));
  }

  private notifyConnection(isConnected: boolean): void {
    this.connectionCallbacks.forEach((callback) => callback(isConnected));
  }

  private notifyParticipants(count: number): void {
    this.participantsCallbacks.forEach((callback) => callback(count));
  }
}

export const globalChatService = new GlobalChatService();
