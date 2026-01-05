import { memo } from 'react';
import Paths from '@/app/shared/path';
import styles from './icon.module.css';
import { IconProps } from './type';
import CSSUtil from '@/app/utils/css';

export type { IconVariant, IconSize } from './type';

const DEFAULT_ICON = 'photo';

const Icon = memo(function Icon({ name, size }: IconProps) {
  const resolvedName = name || DEFAULT_ICON;
  const href = Paths.icons(resolvedName);
  const className = CSSUtil.buildCls(styles.icon, styles[size]);
  return (
    <svg className={className} viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
      <use href={href} />
    </svg>
  );
});

export default Icon;
