'use client';

import { useState } from 'react';
import ChatBubbles from './ChatBubbles';
import styles from './chat.module.css';
import MessageForm from '@/app/components/shared/form/message/MessageForm';
import { GlobalChatHeaderProps, GlobalChatProps } from './type';
import * as IconCircle from '@/app/components/shared/icon/IconCircle';
import { GhostIconButton } from '@/app/components/shared/icon/IconButton';
import CSSUtil from '@/app/utils/css';

function GlobalChatHeader({ onlineCount, isCollapsed, onToggle }: GlobalChatHeaderProps) {
  const iconName = isCollapsed ? 'up' : 'down';

  return (
    <div className={styles.header}>
      <IconCircle.Primary name="globe" size="medium" />
      <div className={styles.headerContent}>
        <div className={styles.title}>전체 채팅</div>
        <div className={styles.status}>
          <span className={styles.onlineDot} />
          <span>{onlineCount.toLocaleString()}명 접속중</span>
        </div>
      </div>
      <GhostIconButton name={iconName} size="medium" onClick={onToggle} />
    </div>
  );
}

export default function GlobalChat({ chats, onlineCount = 0, onMessageSubmit }: GlobalChatProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleMessageSubmit = (message: string) => {
    onMessageSubmit?.(message);

    // TODO: 로그 수집 및 비속어 필터링
  };

  const className = CSSUtil.buildCls(styles.globalChat, isCollapsed && styles.collapsed);

  return (
    <div className={className}>
      <GlobalChatHeader
        onlineCount={onlineCount}
        isCollapsed={isCollapsed}
        onToggle={handleToggle}
      />
      <div className={styles.content}>
        <ChatBubbles chats={chats} />
        <div className={styles.messageForm}>
          <MessageForm placeholder="메시지를 입력하세요..." onSubmit={handleMessageSubmit} />
        </div>
      </div>
    </div>
  );
}
