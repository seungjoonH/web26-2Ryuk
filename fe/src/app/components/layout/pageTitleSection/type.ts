import { ReactNode } from 'react';

export interface PageTitleSectionProps {
  label: string;
  title: string;
  description?: string;
  children?: ReactNode;
}

export interface BoardPageTitleSectionProps {
  onSearch?: (query: string) => void;
  onCreate?: () => void;
}

export interface GamePageTitleSectionProps {
  onSearch?: (query: string) => void;
  children?: ReactNode;
}
