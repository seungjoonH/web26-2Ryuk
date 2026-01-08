'use client';

import { useState, useEffect, useRef } from 'react';
import ChatBubbles from './ChatBubbles';
import styles from './chat.module.css';
import MessageForm from '@/app/components/shared/form/message/MessageForm';
import { ChatModalBaseProps, ChatModalHeaderProps } from './type';
import * as IconCircle from '@/app/components/shared/icon/IconCircle';
import { GhostIconButton } from '@/app/components/shared/icon/IconButton';
import CSSUtil from '@/utils/css';
import { useClickOutside } from '@/app/hooks/useClickOutside';

function ChatModalHeader({
  iconName,
  title,
  participantCount,
  isCollapsed,
  onToggle,
  headerChildren,
  isConnected = true,
}: ChatModalHeaderProps) {
  const iconNameToggle = isCollapsed ? 'up' : 'down';

  return (
    <div className={styles.header}>
      <IconCircle.Primary name={iconName} size="medium" />
      <div className={styles.headerContent}>
        <div className={styles.title}>{title}</div>
        <div className={styles.status}>
          <span
            className={CSSUtil.buildCls(styles.onlineDot, !isConnected && styles.disconnected)}
          />
          <span>{participantCount.toLocaleString()}명 참여중</span>
          {!isConnected && <span className={styles.connectionStatus}> (연결 중...)</span>}
        </div>
      </div>
      {headerChildren}
      <GhostIconButton name={iconNameToggle} size="medium" onClick={onToggle} />
    </div>
  );
}

export default function ChatModalBase({
  iconName,
  title,
  participantCount,
  chats,
  onMessageSubmit,
  headerChildren,
  participantsAvatars,
  isConnected = true,
  disabled = true,
}: ChatModalBaseProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const chattingAreaRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const scrollToBottom = () => {
    if (!chattingAreaRef.current) return;
    chattingAreaRef.current.scrollTop = chattingAreaRef.current.scrollHeight;
  };

  // 외부 클릭 감지하여 모달 닫기
  useClickOutside(modalRef, () => setIsCollapsed(true), !isCollapsed);

  // 메시지가 추가되거나 변경될 때 스크롤을 맨 아래로 이동
  useEffect(() => {
    if (!isCollapsed) requestAnimationFrame(() => scrollToBottom());
  }, [chats, isCollapsed]);

  const handleMessageSubmit = (message: string) => {
    onMessageSubmit?.(message);

    // 메시지 전송 후 스크롤을 맨 아래로 이동
    requestAnimationFrame(() => scrollToBottom());

    // TODO: 로그 수집 및 비속어 필터링
  };

  const className = CSSUtil.buildCls(styles.chatModal, isCollapsed && styles.collapsed);

  return (
    <div ref={modalRef} className={className}>
      <ChatModalHeader
        iconName={iconName}
        title={title}
        participantCount={participantCount}
        isCollapsed={isCollapsed}
        onToggle={handleToggle}
        headerChildren={headerChildren}
        isConnected={isConnected}
      />
      {participantsAvatars && (
        <div className={styles.participantsAvatars}>{participantsAvatars}</div>
      )}
      <div className={styles.content}>
        <div ref={chattingAreaRef} className={styles.chattingArea}>
          <ChatBubbles chats={chats} />
        </div>
        <div className={styles.messageForm}>
          <MessageForm
            placeholder="메시지를 입력하세요..."
            onSubmit={handleMessageSubmit}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
}
