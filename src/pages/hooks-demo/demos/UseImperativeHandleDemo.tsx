import React, { useRef } from 'react';
import { CustomInput } from '../components/CustomInput';
import { CustomInputRef } from '../types';
import styles from '../index.module.css';

export const UseImperativeHandleDemo: React.FC = () => {
  const customInputRef = useRef<CustomInputRef>(null);

  return (
    <section className={styles.section}>
      <h2>6. useImperativeHandle - 暴露组件方法</h2>
      <div className={styles.subSection}>
        <h3>自定义输入组件:</h3>
        <CustomInput
          ref={customInputRef}
          placeholder="自定义输入框"
          onChange={(value) => console.log('输入值变化:', value)}
        />
        <div className={styles.buttonGroup}>
          <button onClick={() => customInputRef.current?.focus()} className={styles.button}>
            聚焦
          </button>
          <button onClick={() => customInputRef.current?.clear()} className={styles.button}>
            清空
          </button>
          <button
            onClick={() => customInputRef.current?.setValue('Hello World!')}
            className={styles.button}
          >
            设置值
          </button>
          <button
            onClick={() => alert(`当前值: ${customInputRef.current?.getValue()}`)}
            className={styles.button}
          >
            获取值
          </button>
        </div>
        <p>💡 父组件可以直接调用子组件的方法</p>
      </div>
    </section>
  );
};
