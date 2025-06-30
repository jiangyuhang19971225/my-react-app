import React, { useState, useMemo } from 'react';
import styles from '../index.module.css';

export const UseMemoDemo: React.FC = () => {
  const [items, setItems] = useState<string[]>(['Apple', 'Banana', 'Cherry']);
  const [searchTerm, setSearchTerm] = useState('');
  const [expensiveValue, setExpensiveValue] = useState(1);

  // useMemo 示例 - 昂贵计算的缓存
  const expensiveCalculation = useMemo(() => {
    console.log('执行昂贵的计算...');
    let result = 0;
    for (let i = 0; i < expensiveValue * 1000000; i++) {
      result += i;
    }
    return result;
  }, [expensiveValue]);

  const filteredItems = useMemo(() => {
    console.log('过滤列表...');
    return items.filter((item) => item.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [items, searchTerm]);

  return (
    <section className={styles.section}>
      <h2>4. useMemo - 昂贵计算优化</h2>
      <div className={styles.subSection}>
        <h3>昂贵计算缓存:</h3>
        <label>
          计算参数:
          <input
            type="number"
            value={expensiveValue}
            onChange={(e) => setExpensiveValue(Number(e.target.value))}
            className={styles.input}
          />
        </label>
        <p>计算结果: {expensiveCalculation}</p>
        <p>💡 只有当 expensiveValue 改变时才会重新计算</p>
      </div>

      <button onClick={() => setItems([...items, 'Orange'])}>添加项目</button>

      <div className={styles.subSection}>
        <h3>列表过滤缓存:</h3>
        <input
          placeholder="搜索项目..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.input}
        />
        <ul>
          {filteredItems.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <p>💡 过滤结果被 useMemo 缓存</p>
      </div>
    </section>
  );
};
