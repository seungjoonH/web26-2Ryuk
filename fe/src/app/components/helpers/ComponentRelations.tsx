'use client';

import Link from 'next/link';
import styles from './components.module.css';
import { getChildComponents, getParentComponents, getCategoryPath } from './type';
import { SecondaryChip, PrimaryChip } from '../shared/chip/Chip';

interface ComponentRelationsProps {
  componentId: string;
}

export default function ComponentRelations({ componentId }: ComponentRelationsProps) {
  const children = getChildComponents(componentId);
  const parents = getParentComponents(componentId);

  if (children.length === 0 && parents.length === 0) {
    return null;
  }

  return (
    <div className={styles.componentRelations}>
      {children.map((child) => (
        <Link
          key={child.id}
          href={`${getCategoryPath(child.category)}#${child.id}`}
          className={styles.relationChipLink}
        >
          <SecondaryChip icon="down" label={child.title} size="medium" />
        </Link>
      ))}
      {parents.map((parent) => (
        <Link
          key={parent.id}
          href={`${getCategoryPath(parent.category)}#${parent.id}`}
          className={styles.relationChipLink}
        >
          <PrimaryChip icon="up" label={parent.title} size="medium" />
        </Link>
      ))}
    </div>
  );
}
