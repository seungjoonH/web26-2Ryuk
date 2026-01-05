'use client';

import styles from './pageTitleSection.module.css';
import CSSUtil from '@/app/utils/css';
import useResponsive from '@/app/hooks/useResponsive';
import {
  BoardPageTitleSectionProps,
  GamePageTitleSectionProps,
  PageTitleSectionProps,
} from './type';
import { PrimaryTextButton } from '../../shared/button/TextButton';
import SearchForm from '../../shared/form/search/SearchForm';
import RadioButton from '../../shared/radioButton/RadioButton';

export function PageTitleSection({ label, title, description, children }: PageTitleSectionProps) {
  const { status } = useResponsive();

  const containerClassName = CSSUtil.buildCls(styles.container, styles[status]);

  return (
    <div className={containerClassName}>
      <div className={styles.content}>
        {label && <span className={styles.label}>{label}</span>}
        <h1 className={styles.title}>{title}</h1>
        {description && <p className={styles.description}>{description}</p>}
      </div>
      {children && <div className={styles.actions}>{children}</div>}
    </div>
  );
}

export function BoardPageTitleSection({ onSearch, onCreate }: BoardPageTitleSectionProps) {
  return (
    <PageTitleSection label="BOARD" title="게시판" description="다른 사람들과 소통해보세요.">
      <SearchForm placeholder="제목, 내용, 작성자 검색" onSubmit={onSearch} />
      <PrimaryTextButton text="글 쓰기" size="medium" iconName="add" onClick={onCreate} />
    </PageTitleSection>
  );
}

export function GamePageTitleSection({ onSearch }: GamePageTitleSectionProps) {
  return (
    <PageTitleSection
      label="MINIGAMES"
      title="미니게임"
      description="또록이와 즐거운 미니게임들을 즐겨보세요!"
    >
      <SearchForm placeholder="게임 검색" onSubmit={onSearch} />
      <RadioButton name="game-filter" values={['전체', '경쟁', '협동']} />
    </PageTitleSection>
  );
}
