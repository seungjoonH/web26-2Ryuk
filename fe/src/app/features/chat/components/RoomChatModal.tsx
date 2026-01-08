'use client';

import ChatModalBase from './ChatModalBase';
import { RoomChatModalProps } from './type';
import { GhostIconButton } from '@/app/components/shared/icon/IconButton';
import styles from './chat.module.css';

export default function RoomChatModal({
  participantCount,
  chats,
  onMessageSubmit,
  onMicToggle,
  onSpeakerToggle,
}: RoomChatModalProps) {
  const headerChildren = (
    <div className={styles.roomChatHeaderControls}>
      {/* <Avatar profileImage={myAvatar} /> */}
      <GhostIconButton name="mic" size="medium" onClick={onMicToggle} />
      <GhostIconButton name="speaker" size="medium" onClick={onSpeakerToggle} />
    </div>
  );

  return (
    <ChatModalBase
      iconName="voice"
      title="음성 채팅"
      participantCount={participantCount}
      chats={chats}
      onMessageSubmit={onMessageSubmit}
      headerChildren={headerChildren}
    />
  );
}
