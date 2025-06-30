import React from 'react';
import { ThemeProvider } from './components/ThemeProvider';
import { UseContextDemo } from './demos/UseContextDemo';
import { UseRefDemo } from './demos/UseRefDemo';
import { UseCallbackDemo } from './demos/UseCallbackDemo';
import { UseMemoDemo } from './demos/UseMemoDemo';
import { UseReducerDemo } from './demos/UseReducerDemo';
import { UseImperativeHandleDemo } from './demos/UseImperativeHandleDemo';
import { UseEffectDemo } from './demos/UseEffectDemo';
import { UseLayoutEffectDemo } from './demos/UseLayoutEffectDemo';
import { UseStateDemo } from './demos/UseStateDemo';
import { UseIdDemo } from './demos/UseIdDemo';
import { UseDeferredValueDemo } from './demos/UseDeferredValueDemo';
import { useTheme } from './hooks/useTheme';
import styles from './index.module.css';

// ================================
// 主组件 - 展示所有 hooks 的使用
// ================================
const HooksDemo: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className={`${styles.container} ${theme === 'dark' ? styles.dark : styles.light}`}>
      <h1>React Hooks 常用场景示例</h1>

      {/* useContext 示例 */}
      <UseContextDemo />

      {/* useRef 示例 */}
      <UseRefDemo />

      {/* useCallback 示例 */}
      <UseCallbackDemo />

      {/* useMemo 示例 */}
      <UseMemoDemo />

      {/* useReducer 示例 */}
      <UseReducerDemo />

      {/* useImperativeHandle 示例 */}
      <UseImperativeHandleDemo />

      {/* useEffect 示例 */}
      <UseEffectDemo />

      {/* useLayoutEffect 示例 */}
      <UseLayoutEffectDemo />

      {/* useState 高级用法 */}
      <UseStateDemo />

      {/* useId 示例 */}
      <UseIdDemo />

      {/* useDeferredValue 示例 */}
      <UseDeferredValueDemo />

      <section className={styles.section}>
        <h2>🎯 Hooks 使用总结</h2>
        <ul className={styles.summary}>
          <li>
            <strong>useRef</strong>: DOM 操作、保存可变值且不触发重渲染
          </li>
          <li>
            <strong>useCallback</strong>: 缓存函数，避免子组件不必要的重渲染
          </li>
          <li>
            <strong>useMemo</strong>: 缓存计算结果，优化性能
          </li>
          <li>
            <strong>useContext</strong>: 跨组件传递数据，避免 prop drilling
          </li>
          <li>
            <strong>useReducer</strong>: 管理复杂状态逻辑，替代 useState
          </li>
          <li>
            <strong>useImperativeHandle</strong>: 暴露组件实例方法给父组件
          </li>
          <li>
            <strong>useEffect</strong>: 处理副作用，数据获取、订阅、DOM操作
          </li>
          <li>
            <strong>useLayoutEffect</strong>: 同步副作用，DOM测量、避免闪烁
          </li>
          <li>
            <strong>useState</strong>: 基础状态管理，函数式更新、懒初始化
          </li>
          <li>
            <strong>useId</strong>: 生成唯一ID，支持服务端渲染
          </li>
          <li>
            <strong>useDeferredValue</strong>: 延迟非紧急更新，优化用户体验
          </li>
        </ul>
      </section>
    </div>
  );
};

// ================================
// 主导出组件 (包装 ThemeProvider)
// ================================
const HooksDemoWithProvider: React.FC = () => {
  return (
    <ThemeProvider>
      <HooksDemo />
    </ThemeProvider>
  );
};

export default HooksDemoWithProvider;
