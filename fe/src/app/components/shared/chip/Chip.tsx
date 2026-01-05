import CSSUtil from '@/app/utils/css';
import styles from './chip.module.css';
import { ChipProps } from './type';
import Icon, { IconSize } from '@/app/components/shared/icon/Icon';

export function ChipBase({ variant, icon, label, size }: ChipProps) {
  const className = CSSUtil.buildCls(styles.chip, size && styles[size], styles[variant]);

  return (
    <div className={className}>
      {icon && <Icon name={icon} size={size as IconSize} />}
      <span className={styles.label}>{label}</span>
    </div>
  );
}

export function PrimaryChip(props: Omit<ChipProps, 'variant'>) {
  return <ChipBase {...props} variant="primary" />;
}

export function SecondaryChip(props: Omit<ChipProps, 'variant'>) {
  return <ChipBase {...props} variant="secondary" />;
}

export function OutlineChip(props: Omit<ChipProps, 'variant'>) {
  return <ChipBase {...props} variant="outline" />;
}

export function DefaultChip(props: Omit<ChipProps, 'variant'>) {
  return <ChipBase {...props} variant="default" />;
}

export {
  PrimaryChip as Primary,
  SecondaryChip as Secondary,
  OutlineChip as Outline,
  DefaultChip as Default,
} from './Chip';
