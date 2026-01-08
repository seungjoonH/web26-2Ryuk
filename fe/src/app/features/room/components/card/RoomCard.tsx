'use client';

import styles from './room.module.css';
import { OutlineChip } from '@/app/components/shared/chip/Chip';
import StatusChip from '@/app/components/shared/chip/StatusChip';
import { SecondaryIconButton } from '@/app/components/shared/icon/IconButton';
import Avatars from '@/app/components/shared/profile/Avatars';
import { RoomCardProps } from '@/app/features/room/components/type';
import TextTooltip from '@/app/components/shared/tooltip/TextTooltip';

function RoomCard({
  id,
  title,
  tags,
  currentParticipants,
  maxParticipants,
  participantProfileImages = [],
}: RoomCardProps) {
  const remainingCount = maxParticipants - currentParticipants;

  const getStatusChipStatus = (): 'success' | 'warning' | 'error' => {
    if (remainingCount === 0) return 'error'; // 풀방
    if (remainingCount === 1) return 'warning'; // 한 자리 남음
    return 'success';
  };

  const anchorId = `room-title-${id}`;

  return (
    <div className={styles.roomCard}>
      <div className={styles.roomCardTop}>
        <div className={styles.roomCardHeader}>
          <h3 className={styles.roomCardTitle} data-anchor={anchorId}>
            {title}
          </h3>
          <TextTooltip text={title} anchorId={anchorId} />
          <StatusChip
            status={getStatusChipStatus()}
            label={`${currentParticipants}/${maxParticipants}`}
            size="small"
          />
        </div>
        {tags.length > 0 && (
          <div className={styles.roomCardTags}>
            {tags.map((tag) => (
              <OutlineChip key={`key-${tag}`} label={tag} size="small" />
            ))}
          </div>
        )}
      </div>
      <div className={styles.roomCardFooter}>
        <Avatars profileImages={participantProfileImages} />
        <SecondaryIconButton name="open" size="small" disabled={remainingCount === 0} />
      </div>
    </div>
  );
}

export default RoomCard;
