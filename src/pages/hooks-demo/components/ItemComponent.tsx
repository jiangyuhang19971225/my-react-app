import React from 'react';
import { ItemComponentProps } from '../types';
import styles from '../index.module.css';

export const ItemComponent = React.memo<ItemComponentProps>(({ item, onClick }) => {
  console.log(`ItemComponent ${item} 渲染`);

  return (
    <div className={styles.item} onClick={() => onClick(item)}>
      {item}
    </div>
  );
});

ItemComponent.displayName = 'ItemComponent';
