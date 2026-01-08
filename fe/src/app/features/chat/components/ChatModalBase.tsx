'use client';

import { useState } from 'react';
import ChatBubbles from './ChatBubbles';
import styles from './chat.module.css';
import MessageForm from '@/app/components/shared/form/message/MessageForm';
import { ChatModalBaseProps, ChatModalHeaderProps } from './type';
import * as IconCircle from '@/app/components/shared/icon/IconCircle';
import { GhostIconButton } from '@/app/components/shared/icon/IconButton';
import CSSUtil from '@/utils/css';

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
}: ChatModalBaseProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleMessageSubmit = (message: string) => {
    onMessageSubmit?.(message);

    // TODO: 로그 수집 및 비속어 필터링
  };

  const className = CSSUtil.buildCls(styles.chatModal, isCollapsed && styles.collapsed);

  return (
    <div className={className}>
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
        <ChatBubbles chats={chats} />
        <div className={styles.messageForm}>
          <MessageForm placeholder="메시지를 입력하세요..." onSubmit={handleMessageSubmit} />
        </div>
      </div>
    </div>
  );
}
