import styles from './avatar.module.css';
import CSSUtil from '@/app/utils/css';
import { AvatarCountProps } from './type';

function AvatarCount({ count, onClick }: AvatarCountProps) {
  const className = CSSUtil.buildCls(styles.avatar, styles.count);

  return (
    <div className={className} onClick={onClick}>
      <span className={styles.text}>+{count}</span>
    </div>
  );
}

export default AvatarCount;
