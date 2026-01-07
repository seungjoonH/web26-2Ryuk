import CSSUtil from '@/utils/css';
import styles from './statusChip.module.css';
import { StatusChipProps } from './type';

export default function StatusChip({ status, label, size = 'medium' }: StatusChipProps) {
  const className = CSSUtil.buildCls(styles.statusChip, styles[size], styles[status]);

  return (
    <div className={className}>
      <span className={styles.dot} />
      <span className={styles.label}>{label}</span>
    </div>
  );
}
