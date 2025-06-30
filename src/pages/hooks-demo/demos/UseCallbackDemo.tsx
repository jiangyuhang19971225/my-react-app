import React, { useState, useCallback } from 'react';
import { ItemComponent } from '../components/ItemComponent';
import styles from '../index.module.css';

export const UseCallbackDemo: React.FC = () => {
  const [items, setItems] = useState<string[]>(['Apple', 'Banana', 'Cherry']);

  // useCallback 示例 - 防止子组件不必要的重渲染
  const handleItemClick = useCallback((item: string) => {
    console.log('Clicked item:', item);
    alert(`你点击了: ${item}`);
  }, []);

  const addItem = useCallback(() => {
    const newItem = `Item ${items.length + 1}`;
    setItems((prev) => [...prev, newItem]);
  }, [items.length]);

  return (
    <section className={styles.section}>
      <h2>3. useCallback - 优化回调函数</h2>
      <div className={styles.itemList}>
        {items.map((item, index) => (
          <ItemComponent key={index} item={item} onClick={handleItemClick} />
        ))}
      </div>
      <button onClick={addItem} className={styles.button}>
        添加项目
      </button>
      <p>💡 ItemComponent 使用 React.memo 优化，useCallback 防止不必要的重渲染</p>
    </section>
  );
};
