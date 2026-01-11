'use client';

import ChatPanel from './ChatPanel';
import { RoomChatPanelProps } from './type';
import styles from './chat.module.css';
import AudioControlButtons from '@/app/features/voice/components/AudioControlButtons';

export default function RoomChatPanel({
  participantCount,
  chats,
  onMessageSubmit,
  onMicToggle,
  onSpeakerToggle,
}: RoomChatPanelProps) {
  const headerChildren = (
    <div className={styles.roomChatHeaderControls}>
      {/* <Avatar profileImage={myAvatar} /> */}
      <AudioControlButtons />
    </div>
  );

  return (
    <ChatPanel
      iconName="voice"
      type="local"
      participantCount={participantCount}
      chats={chats}
      onMessageSubmit={onMessageSubmit}
      headerChildren={headerChildren}
    />
  );
}
