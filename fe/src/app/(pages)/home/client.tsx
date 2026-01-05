'use client';

import useResponsive from '@/app/hooks/useResponsive';
import CSSUtil from '@/utils/css';
import styles from './page.module.css';
import { PageClientProps } from '../type';

export default function HomePageClient({ children }: PageClientProps) {
  const { status } = useResponsive();
  const className = CSSUtil.buildCls('page', styles[status]);
  return <div className={className}>{children}</div>;
}
