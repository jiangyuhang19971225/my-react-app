import React, { useState, useMemo, useDeferredValue, useTransition } from 'react';
import styles from '../index.module.css';

// ================================
// 📋 组件总览 & 核心概念
// ================================
/**
 * UseDeferredValueDemo - React 18 并发特性演示
 *
 * 🎯 主要演示的技术：
 * 1. useDeferredValue - 延迟非紧急状态更新
 * 2. useTransition - 标记低优先级状态更新
 * 3. useMemo - 缓存昂贵计算结果
 *
 * 💡 核心解决的问题：
 * - 大量数据搜索时的输入卡顿
 * - UI 响应性与计算性能的平衡
 * - 用户体验优化
 *
 * 🔧 核心原理：
 * 将"输入响应"和"搜索计算"分离，让输入保持流畅，搜索在后台进行
 */

export const UseDeferredValueDemo: React.FC = () => {
  // ================================
  // 🎯 useDeferredValue 核心用法
  // ================================
  /**
   * 作用：创建一个"延迟版本"的状态值
   *
   * 工作机制：
   * - searchTerm 立即更新（保持输入响应）
   * - deferredSearchTerm 延迟更新（避免阻塞UI）
   * - React 自动在合适时机同步两个值
   *
   * 应用场景：
   * ✅ 搜索框实时过滤
   * ✅ 图表数据实时更新
   * ✅ 大列表渲染优化
   * ✅ 复杂计算结果展示
   */
  const [searchTerm, setSearchTerm] = useState(''); // 🚀 立即值：用户输入
  const deferredSearchTerm = useDeferredValue(searchTerm); // 🐌 延迟值：搜索计算

  // ================================
  // 🔄 useTransition 核心用法
  // ================================
  /**
   * 作用：将状态更新标记为"非紧急"，可被中断
   *
   * 返回值：
   * - isPending: boolean - 是否有待处理的非紧急更新
   * - startTransition: function - 包装非紧急状态更新
   *
   * 应用场景：
   * ✅ 大量数据渲染
   * ✅ 复杂计算触发的更新
   * ✅ 页面路由切换
   * ✅ 后台数据同步
   */
  const [isPending, startTransition] = useTransition();

  // ================================
  // 📦 useMemo 性能优化
  // ================================
  /**
   * 作用：缓存昂贵的计算结果
   *
   * 这里缓存：10000个模拟数据的创建
   * 依赖：[] 空数组，只创建一次
   */
  const allItems = useMemo(
    () =>
      Array.from({ length: 10000 }, (_, i) => ({
        id: i,
        name: `项目 ${i + 1}`,
        category: `分类 ${Math.floor(i / 100) + 1}`,
        description: `这是项目 ${i + 1} 的描述信息`,
      })),
    [],
  );

  // ================================
  // 🔍 搜索过滤 - 延迟计算核心
  // ================================
  /**
   * 作用：基于延迟值执行搜索过滤
   *
   * 关键点：
   * - 依赖 deferredSearchTerm（延迟值）不是 searchTerm（立即值）
   * - 避免每次输入都触发昂贵的过滤计算
   * - 只在延迟值更新时重新计算
   */
  const filteredItems = useMemo(() => {
    if (!deferredSearchTerm) return allItems.slice(0, 50);

    console.log('执行搜索过滤...', deferredSearchTerm);

    return allItems
      .filter(
        (item) =>
          item.name.toLowerCase().includes(deferredSearchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(deferredSearchTerm.toLowerCase()),
      )
      .slice(0, 100);
  }, [allItems, deferredSearchTerm]); // 👈 关键：依赖延迟值

  // ================================
  // 🎛️ 输入处理 - 非紧急更新
  // ================================
  /**
   * 作用：将搜索词更新标记为非紧急
   *
   * 工作流程：
   * 1. 用户输入 → handleSearchChange
   * 2. startTransition 包装更新
   * 3. setSearchTerm 被标记为低优先级
   * 4. React 优先处理其他紧急更新
   * 5. 在合适时机更新 searchTerm
   */
  const handleSearchChange = (value: string) => {
    startTransition(() => {
      setSearchTerm(value);
    });
  };

  return (
    <section className={styles.section}>
      <h2>11. useDeferredValue - 延迟值更新</h2>
      <div className={styles.deferredDemo}>
        <h4>搜索优化演示:</h4>

        <div className={styles.searchContainer}>
          <input
            placeholder="搜索项目... (输入'项目'或'分类')"
            value={searchTerm} // 👈 绑定立即值，保持输入流畅
            onChange={(e) => handleSearchChange(e.target.value)}
            className={styles.input}
          />
          {isPending && <span className={styles.pending}>搜索中...</span>}
        </div>

        <div className={styles.searchInfo}>
          <p>
            当前搜索词: <strong>{searchTerm}</strong>
          </p>
          <p>
            延迟搜索词: <strong>{deferredSearchTerm}</strong>
          </p>
          <p>
            找到 <strong>{filteredItems.length}</strong> 个结果
          </p>
        </div>

        <div className={styles.resultsList}>
          {filteredItems.map((item) => (
            <div key={item.id} className={styles.resultItem}>
              <h5>{item.name}</h5>
              <p className={styles.category}>{item.category}</p>
              <p className={styles.description}>{item.description}</p>
            </div>
          ))}
        </div>

        {/* ================================ */}
        {/* 📖 技术总结 & 应用场景 */}
        {/* ================================ */}
        <div className={styles.tip}>
          <h4>🎯 核心技术总结：</h4>

          {/* useDeferredValue 总结 */}
          <div>
            <h5>📦 useDeferredValue</h5>
            <p>
              <strong>函数作用</strong>：创建状态的"延迟版本"，避免昂贵更新阻塞UI
            </p>
            <p>
              <strong>使用场景</strong>：
            </p>
            <ul>
              <li>
                🔍 <strong>搜索框</strong>：实时搜索大量数据
              </li>
              <li>
                📊 <strong>图表组件</strong>：数据变化时的图表重绘
              </li>
              <li>
                📝 <strong>富文本编辑器</strong>：实时预览复杂内容
              </li>
              <li>
                🎮 <strong>游戏界面</strong>：实时更新大量游戏对象
              </li>
              <li>
                📱 <strong>移动端滚动</strong>：滚动时的复杂计算
              </li>
            </ul>
          </div>

          {/* useTransition 总结 */}
          <div>
            <h5>🔄 useTransition</h5>
            <p>
              <strong>函数作用</strong>：标记状态更新为低优先级，可被紧急更新中断
            </p>
            <p>
              <strong>使用场景</strong>：
            </p>
            <ul>
              <li>
                🏠 <strong>页面切换</strong>：路由导航时的页面加载
              </li>
              <li>
                📋 <strong>表格排序</strong>：大量数据的排序操作
              </li>
              <li>
                🎨 <strong>主题切换</strong>：全局样式更新
              </li>
              <li>
                📁 <strong>文件上传</strong>：批量文件处理
              </li>
              <li>
                🔍 <strong>筛选器</strong>：复杂条件的数据筛选
              </li>
            </ul>
          </div>

          {/* 实际业务场景 */}
          <div>
            <h5>🏢 实际业务应用：</h5>
            <ul>
              <li>
                🛒 <strong>电商平台</strong>：商品搜索、筛选
              </li>
              <li>
                📺 <strong>视频网站</strong>：视频列表、弹幕渲染
              </li>
              <li>
                💼 <strong>企业系统</strong>：数据表格、报表生成
              </li>
              <li>
                🎵 <strong>音乐应用</strong>：歌曲搜索、播放列表
              </li>
              <li>
                📱 <strong>社交软件</strong>：消息列表、动态加载
              </li>
              <li>
                🎯 <strong>后台管理</strong>：用户管理、数据统计
              </li>
            </ul>
          </div>

          {/* 何时使用指南 */}
          <div>
            <h5>⚡ 何时使用这些技术：</h5>
            <ul>
              <li>
                ✅ <strong>输入卡顿</strong>：用户输入时界面不流畅
              </li>
              <li>
                ✅ <strong>大量数据</strong>：处理1000+条记录
              </li>
              <li>
                ✅ <strong>复杂计算</strong>：过滤、排序、统计等耗时操作
              </li>
              <li>
                ✅ <strong>实时搜索</strong>：每次输入都要查询
              </li>
              <li>
                ✅ <strong>多步骤操作</strong>：需要保持界面响应的长流程
              </li>
            </ul>
          </div>

          {/* 性能对比 */}
          <div>
            <h5>📈 性能提升效果：</h5>
            <ul>
              <li>
                🚀 <strong>输入延迟</strong>：从100ms+ 降到 16ms以内
              </li>
              <li>
                🎯 <strong>CPU使用</strong>：减少50-80%的无效计算
              </li>
              <li>
                💫 <strong>用户体验</strong>：输入流畅度显著提升
              </li>
              <li>
                🔋 <strong>电池续航</strong>：移动设备续航增加
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
