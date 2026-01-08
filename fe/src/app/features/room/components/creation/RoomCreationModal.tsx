'use client';

import RoomCreationForm from './RoomCreationForm';
import { RoomCreationFormProps } from '../type';
import styles from './roomCreationModal.module.css';
import Paths from '@/app/shared/path';
import Image from 'next/image';

export default function RoomCreationModal(props: RoomCreationFormProps) {
  const { onCancel } = props;

  return (
    <div className={styles.backdrop} onClick={onCancel}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>대화방 만들기</h1>
            <p className={styles.subtitle}>새로운 물방울을 띄워보세요!</p>
          </div>
          <Image src={Paths.images('mascot')} alt="mascot" width={72} height={72} />
        </div>
        <RoomCreationForm {...props} />
      </div>
    </div>
  );
}
