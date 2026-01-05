import CSSUtil from '@/app/utils/css';
import Icon from './Icon';
import styles from './icon.module.css';
import { IconCircleProps } from './type';

export default function IconCircle({ name, size, variant }: IconCircleProps) {
  const className = CSSUtil.buildCls(styles.circle, styles[variant], styles[size]);
  return (
    <span className={className} role="img" aria-label={name}>
      <Icon name={name} size={size} />
    </span>
  );
}

export function PrimaryIconCircle(props: Omit<IconCircleProps, 'variant'>) {
  return <IconCircle {...props} variant="primary" />;
}

export function SecondaryIconCircle(props: Omit<IconCircleProps, 'variant'>) {
  return <IconCircle {...props} variant="secondary" />;
}

export function OutlineIconCircle(props: Omit<IconCircleProps, 'variant'>) {
  return <IconCircle {...props} variant="outline" />;
}

export function GhostIconCircle(props: Omit<IconCircleProps, 'variant'>) {
  return <IconCircle {...props} variant="ghost" />;
}
export {
  PrimaryIconCircle as Primary,
  SecondaryIconCircle as Secondary,
  OutlineIconCircle as Outline,
  GhostIconCircle as Ghost,
} from './IconCircle';
