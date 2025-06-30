import React from 'react';
import { useTheme } from '../hooks/useTheme';
import styles from '../index.module.css';

export const UseContextDemo: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <section className={styles.section}>
      <h2>1. useContext - 主题切换</h2>
      <p>
        当前主题: <strong>{theme}</strong>
      </p>
      <button onClick={toggleTheme} className={styles.button}>
        切换主题
      </button>
    </section>
  );
};
