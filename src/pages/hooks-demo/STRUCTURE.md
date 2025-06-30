# Hooks Demo 文件结构说明

这个文件夹包含了 React Hooks 的各种使用示例，已经按功能拆分成清晰的模块化结构。

## 文件结构

```
src/pages/hooks-demo/
├── index.tsx                    # 主入口文件，整合所有演示组件
├── index.module.css            # 样式文件
├── README.md                   # 原始说明文档
├── STRUCTURE.md               # 本文件 - 结构说明
├── types/
│   └── index.ts               # 共享类型定义
├── hooks/
│   └── useTheme.ts           # 自定义 hook
├── components/
│   ├── ThemeProvider.tsx     # 主题上下文提供者
│   ├── CustomInput.tsx       # 自定义输入组件
│   ├── ItemComponent.tsx     # 列表项组件
│   └── PerformanceMonitor.tsx # 性能监控组件 (已存在)
└── demos/                    # 各个 Hook 的演示组件
    ├── UseContextDemo.tsx         # useContext 演示
    ├── UseRefDemo.tsx            # useRef 演示
    ├── UseCallbackDemo.tsx       # useCallback 演示
    ├── UseMemoDemo.tsx          # useMemo 演示
    ├── UseReducerDemo.tsx       # useReducer 演示
    ├── UseImperativeHandleDemo.tsx # useImperativeHandle 演示
    ├── UseEffectDemo.tsx        # useEffect 演示
    ├── UseLayoutEffectDemo.tsx  # useLayoutEffect 演示
    ├── UseStateDemo.tsx         # useState 高级用法演示
    ├── UseIdDemo.tsx           # useId 演示
    └── UseDeferredValueDemo.tsx # useDeferredValue 演示
```

## 模块说明

### 主要文件

- **index.tsx**: 主入口文件，导入并组合所有演示组件
- **types/index.ts**: 包含所有组件共享的 TypeScript 类型定义
- **hooks/useTheme.ts**: 自定义主题切换 hook

### 组件模块

- **components/**: 包含可复用的组件
  - `ThemeProvider.tsx`: 提供主题上下文
  - `CustomInput.tsx`: 演示 useImperativeHandle 的自定义输入组件
  - `ItemComponent.tsx`: 演示 React.memo 和 useCallback 配合的列表项组件

### 演示模块

- **demos/**: 每个 Hook 都有独立的演示组件
  - 每个文件都包含一个特定 Hook 的完整使用示例
  - 保持了原始功能不变，只是进行了模块化拆分

## 优势

1. **可读性提升**: 每个文件专注于一个特定功能，代码更易理解
2. **可维护性**: 修改某个 Hook 的演示不会影响其他部分
3. **可复用性**: 组件可以在其他地方复用
4. **类型安全**: 集中的类型定义确保类型一致性
5. **开发效率**: 开发者可以快速定位到特定功能的代码

## 使用方式

直接导入 `index.tsx` 即可使用完整的 Hooks 演示：

```tsx
import HooksDemoWithProvider from './pages/hooks-demo';

// 在你的应用中使用
<HooksDemoWithProvider />;
```

## 注意事项

- 所有演示保持原有功能不变
- 样式文件 `index.module.css` 保持不变，所有组件继续使用相同的样式类
- 主题功能通过 `ThemeProvider` 提供，确保所有子组件都能访问主题状态
