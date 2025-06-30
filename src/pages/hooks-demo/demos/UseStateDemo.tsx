import React, { useState } from 'react';
import styles from '../index.module.css';

export const UseStateDemo: React.FC = () => {
  // 函数式更新
  const [count, setCount] = useState(0);

  // 懒初始化
  const [expensiveValue] = useState(() => {
    console.log('懒初始化：只在组件首次渲染时执行');
    return Array.from({ length: 1000 }, (_, i) => i).reduce((sum, num) => sum + num, 0);
  });

  // 对象状态管理
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    age: 0,
    preferences: {
      theme: 'light' as 'light' | 'dark',
      language: 'zh' as 'zh' | 'en',
    },
  });

  // 数组状态管理
  const [todos, setTodos] = useState<Array<{ id: number; text: string; completed: boolean }>>([]);
  const [newTodo, setNewTodo] = useState('');

  // 函数式更新避免闭包陷阱
  const incrementAsync = () => {
    setTimeout(() => {
      setCount((prevCount) => prevCount + 1); // 总是基于最新状态
    }, 1000);
  };

  // 复杂对象更新
  const updateUserInfo = (field: string, value: string | number) => {
    setUserInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updatePreferences = (key: string, value: string) => {
    setUserInfo((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value,
      },
    }));
  };

  // 数组操作
  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: newTodo.trim(),
          completed: false,
        },
      ]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)),
    );
  };

  const deleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  return (
    <section className={styles.section}>
      <h2>9. useState - 高级用法</h2>
      <div className={styles.stateAdvanced}>
        {/* 函数式更新示例 */}
        <div className={styles.subSection}>
          <h4>函数式更新:</h4>
          <p>
            当前计数: <strong>{count}</strong>
          </p>
          <div className={styles.buttonGroup}>
            <button onClick={() => setCount(count + 1)} className={styles.button}>
              直接更新 (+1)
            </button>
            <button onClick={() => setCount((prev) => prev + 1)} className={styles.button}>
              函数式更新 (+1)
            </button>
            <button onClick={incrementAsync} className={styles.button}>
              异步更新 (+1)
            </button>
          </div>
          <p className={styles.tip}>💡 异步更新使用函数式更新避免闭包陷阱</p>
        </div>

        {/* 复杂对象状态 */}
        <div className={styles.subSection}>
          <h4>复杂对象状态:</h4>
          <div className={styles.formGroup}>
            <input
              placeholder="姓名"
              value={userInfo.name}
              onChange={(e) => updateUserInfo('name', e.target.value)}
              className={styles.input}
            />
            <input
              placeholder="邮箱"
              value={userInfo.email}
              onChange={(e) => updateUserInfo('email', e.target.value)}
              className={styles.input}
            />
            <input
              type="number"
              placeholder="年龄"
              value={userInfo.age || ''}
              onChange={(e) => updateUserInfo('age', parseInt(e.target.value) || 0)}
              className={styles.input}
            />
          </div>

          <div className={styles.preferences}>
            <label>
              主题:
              <select
                value={userInfo.preferences.theme}
                onChange={(e) => updatePreferences('theme', e.target.value)}
                className={styles.select}
              >
                <option value="light">浅色</option>
                <option value="dark">深色</option>
              </select>
            </label>
            <label>
              语言:
              <select
                value={userInfo.preferences.language}
                onChange={(e) => updatePreferences('language', e.target.value)}
                className={styles.select}
              >
                <option value="zh">中文</option>
                <option value="en">English</option>
              </select>
            </label>
          </div>

          <div className={styles.userPreview}>
            <h5>用户信息预览:</h5>
            <pre>{JSON.stringify(userInfo, null, 2)}</pre>
          </div>
        </div>

        {/* 数组状态管理 */}
        <div className={styles.subSection}>
          <h4>数组状态管理 (Todo List):</h4>
          <div className={styles.todoInput}>
            <input
              placeholder="添加新任务..."
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              className={styles.input}
            />
            <button onClick={addTodo} className={styles.button}>
              添加
            </button>
          </div>

          <div className={styles.todoList}>
            {todos.map((todo) => (
              <div
                key={todo.id}
                className={`${styles.todoItem} ${todo.completed ? styles.completed : ''}`}
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                />
                <span>{todo.text}</span>
                <button onClick={() => deleteTodo(todo.id)} className={styles.dangerButton}>
                  删除
                </button>
              </div>
            ))}
          </div>
          <p>
            懒初始化计算结果: <strong>{expensiveValue}</strong>
          </p>
        </div>
      </div>
    </section>
  );
};
