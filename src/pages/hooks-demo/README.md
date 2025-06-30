# React Hooks 常用场景学习指南

这个项目展示了React中最常用的6个Hook的实际使用场景和最佳实践。

## 🎯 Hook 列表

### 1. useEffect

**用途**: 处理副作用，如数据获取、订阅、DOM操作
**特点**: 在组件渲染后异步执行

#### 使用场景:

- 数据获取和API调用
- 设置定时器和事件监听
- 手动DOM操作
- 资源清理

#### 最佳实践:

```typescript
// ✅ 正确：数据获取
useEffect(() => {
  const fetchData = async () => {
    const result = await api.getData();
    setData(result);
  };
  fetchData();
}, []);

// ✅ 正确：清理副作用
useEffect(() => {
  const timer = setInterval(() => {
    console.log('Timer tick');
  }, 1000);

  return () => clearInterval(timer); // 清理函数
}, []);

// ❌ 错误：忘记依赖项
useEffect(() => {
  fetchData(userId); // userId变化时不会重新执行
}, []); // 应该包含 [userId]
```

### 2. useLayoutEffect

**用途**: 同步执行副作用，在DOM更新后立即执行
**特点**: 会阻塞浏览器绘制，适合关键的DOM操作

#### 使用场景:

- DOM尺寸测量
- 避免页面闪烁的DOM操作
- 动画的初始设置
- 第三方库的同步初始化

#### 最佳实践:

```typescript
// ✅ 正确：DOM测量
useLayoutEffect(() => {
  const rect = elementRef.current?.getBoundingClientRect();
  if (rect) {
    setDimensions({ width: rect.width, height: rect.height });
  }
});

// ✅ 正确：避免闪烁
useLayoutEffect(() => {
  // 在浏览器绘制前同步执行，避免闪烁
  if (shouldHideElement) {
    elementRef.current.style.display = 'none';
  }
}, [shouldHideElement]);

// ❌ 错误：用于异步操作
useLayoutEffect(() => {
  fetchData(); // 这会阻塞浏览器绘制，应该用useEffect
}, []);
```

### 3. useState (高级用法)

**用途**: 基础状态管理，支持函数式更新和懒初始化
**特点**: 可以避免闭包陷阱，优化初始化性能

#### 使用场景:

- 函数式更新避免闭包陷阱
- 懒初始化优化性能
- 复杂对象和数组状态管理

#### 最佳实践:

```typescript
// ✅ 正确：懒初始化
const [expensiveValue] = useState(() => {
  return heavyComputation(); // 只在首次渲染时执行
});

// ✅ 正确：函数式更新
const incrementAsync = () => {
  setTimeout(() => {
    setCount((prevCount) => prevCount + 1); // 总是基于最新状态
  }, 1000);
};

// ✅ 正确：复杂对象更新
const updateUser = (field, value) => {
  setUserInfo((prev) => ({
    ...prev,
    [field]: value,
  }));
};

// ❌ 错误：闭包陷阱
const incrementAsync = () => {
  setTimeout(() => {
    setCount(count + 1); // 可能基于过期的count值
  }, 1000);
};
```

### 4. useId

**用途**: 生成唯一ID，支持服务端渲染
**特点**: 在客户端和服务端生成一致的ID

#### 使用场景:

- 表单元素关联
- 可访问性属性
- 避免ID冲突
- 服务端渲染兼容

#### 最佳实践:

```typescript
// ✅ 正确：表单关联
const MyForm = () => {
  const nameId = useId();
  const emailId = useId();

  return (
    <form>
      <label htmlFor={nameId}>姓名:</label>
      <input id={nameId} />

      <label htmlFor={emailId}>邮箱:</label>
      <input id={emailId} />
    </form>
  );
};

// ✅ 正确：无障碍属性
const MyComponent = () => {
  const describedById = useId();

  return (
    <>
      <input aria-describedby={describedById} />
      <div id={describedById}>这是输入框的描述</div>
    </>
  );
};

// ❌ 错误：手动生成ID
const badId = Math.random().toString(); // 服务端渲染不一致
```

### 5. useDeferredValue

**用途**: 延迟非紧急状态更新，优化用户体验
**特点**: 与useTransition配合使用，提高响应性

#### 使用场景:

- 搜索功能优化
- 大列表过滤
- 复杂计算的延迟
- 提高输入响应性

#### 最佳实践:

```typescript
// ✅ 正确：搜索优化
const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearchTerm = useDeferredValue(searchTerm);

  const results = useMemo(() => {
    return data.filter(item =>
      item.name.includes(deferredSearchTerm)
    );
  }, [data, deferredSearchTerm]);

  return (
    <>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {results.map(item => <Item key={item.id} {...item} />)}
    </>
  );
};

// ✅ 正确：配合useTransition
const [isPending, startTransition] = useTransition();
const handleSearch = (value) => {
  startTransition(() => {
    setSearchTerm(value);
  });
};

// ❌ 错误：用于紧急更新
const deferredCount = useDeferredValue(count); // 计数器应该立即更新
```

### 6. useRef

**用途**: DOM操作和持久化值存储
**特点**: 不会触发组件重新渲染

#### 使用场景:

- 直接操作DOM元素 (聚焦、滚动、测量)
- 存储可变值但不触发重新渲染
- 保存定时器引用
- 缓存昂贵的计算结果

#### 最佳实践:

```typescript
// ✅ 正确：DOM操作
const inputRef = useRef<HTMLInputElement>(null);
const focusInput = () => inputRef.current?.focus();

// ✅ 正确：持久化值
const countRef = useRef(0);
const increment = () => (countRef.current += 1);

// ❌ 错误：用于触发重新渲染的状态
const [count, setCount] = useState(0); // 应该用useState
```

### 7. useCallback

**用途**: 缓存函数，防止子组件不必要的重新渲染
**特点**: 依赖项不变时返回相同的函数引用

#### 使用场景:

- 传递给子组件的回调函数
- 依赖项变化频繁的事件处理器
- 自定义Hook中的函数

#### 最佳实践:

```typescript
// ✅ 正确：配合React.memo使用
const handleClick = useCallback(
  (id: string) => {
    onItemClick(id);
  },
  [onItemClick],
);

// ❌ 错误：没有依赖项或依赖项不变
const handleClick = useCallback(() => {
  console.log('clicked');
}, []); // 不如直接定义函数

// ✅ 正确：有变化的依赖项
const handleSubmit = useCallback(
  (data) => {
    apiCall(data, userId);
  },
  [userId],
); // userId变化时重新创建函数
```

### 8. useMemo

**用途**: 缓存计算结果，优化性能
**特点**: 依赖项不变时返回缓存的计算结果

#### 使用场景:

- 昂贵的计算操作
- 复杂的对象或数组转换
- 过滤、排序、分组等操作

#### 最佳实践:

```typescript
// ✅ 正确：昂贵的计算
const expensiveValue = useMemo(() => {
  return data.reduce((sum, item) => sum + item.value, 0);
}, [data]);

// ✅ 正确：复杂的对象转换
const processedData = useMemo(() => {
  return data.filter((item) => item.active).sort((a, b) => b.priority - a.priority);
}, [data]);

// ❌ 错误：简单的计算
const doubledValue = useMemo(() => value * 2, [value]); // 直接计算更快
```

### 9. useContext

**用途**: 跨组件传递数据，避免prop drilling
**特点**: 提供者改变时所有消费者都会重新渲染

#### 使用场景:

- 主题切换
- 用户认证状态
- 国际化设置
- 全局状态管理

#### 最佳实践:

```typescript
// ✅ 正确：创建Context和Provider
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const ThemeProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={{theme, setTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};

// ✅ 正确：创建自定义Hook
const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

// ❌ 错误：频繁变化的值
// 不要把经常变化的值放在Context中，会导致所有消费者重新渲染
```

### 10. useReducer

**用途**: 管理复杂的状态逻辑
**特点**: 适合处理多个相关状态和复杂的状态转换

#### 使用场景:

- 复杂的表单状态
- 购物车逻辑
- 游戏状态管理
- 多步骤流程

#### 最佳实践:

```typescript
// ✅ 正确：定义清晰的Action类型
type CartAction =
  | { type: 'ADD_ITEM'; payload: Item }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } };

// ✅ 正确：纯函数Reducer
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM':
      // 返回新的状态对象
      return { ...state, items: [...state.items, action.payload] };
    default:
      return state;
  }
};

// ❌ 错误：直接修改状态
const badReducer = (state, action) => {
  state.items.push(action.payload); // 不要直接修改状态
  return state;
};
```

### 11. useImperativeHandle

**用途**: 暴露组件实例的方法给父组件
**特点**: 需要配合forwardRef使用

#### 使用场景:

- 自定义输入组件
- 视频播放器控制
- 图表组件的API
- 第三方库的封装

#### 最佳实践:

```typescript
// ✅ 正确：配合forwardRef使用
const CustomInput = forwardRef<CustomInputRef, Props>((props, ref) => {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    clear: () => setValue(''),
    getValue: () => value
  }));

  return <input ref={inputRef} value={value} onChange={...} />;
});

// ❌ 错误：过度使用
// 不要用它来替代props传递，只在必要时使用
```

## 🔄 Hook 使用顺序

React Hook有使用规则：

1. 只在React函数组件或自定义Hook中使用
2. 只在顶层调用Hook，不要在循环、条件或嵌套函数中调用
3. 自定义Hook的名称必须以"use"开头

## 🚀 性能优化建议

### 1. 避免过度优化

- 不是所有函数都需要useCallback
- 不是所有计算都需要useMemo
- 简单的计算直接执行可能更快

### 2. 合理使用依赖项

- 依赖项数组要包含所有使用的变量
- 使用ESLint插件检查依赖项
- 考虑使用useCallback和useMemo的依赖项

### 3. Context使用技巧

- 避免在Context中放置频繁变化的值
- 考虑将Context分层，减少不必要的重新渲染
- 使用memo包装消费者组件

## 📚 进阶技巧

### 1. 自定义Hook模式

```typescript
// 自定义Hook：管理本地存储
const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setStoredValue = useCallback(
    (newValue: T) => {
      setValue(newValue);
      window.localStorage.setItem(key, JSON.stringify(newValue));
    },
    [key],
  );

  return [value, setStoredValue] as const;
};
```

### 2. 组合Hook模式

```typescript
// 组合多个Hook创建复杂逻辑
const useShoppingCart = () => {
  const [cartState, dispatch] = useReducer(cartReducer, initialState);
  const [isLoading, setIsLoading] = useState(false);

  const addItem = useCallback(async (item: Item) => {
    setIsLoading(true);
    try {
      // API调用
      await addItemToCart(item);
      dispatch({ type: 'ADD_ITEM', payload: item });
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    ...cartState,
    isLoading,
    addItem,
    removeItem: useCallback((id: string) => {
      dispatch({ type: 'REMOVE_ITEM', payload: id });
    }, []),
  };
};
```

## 🎮 实际项目中的应用

在实际项目中，这些Hook经常组合使用：

1. **表单管理**: useState + useCallback + useMemo
2. **数据获取**: useEffect + useState + useCallback
3. **全局状态**: useContext + useReducer
4. **性能优化**: useMemo + useCallback + React.memo
5. **组件通信**: useImperativeHandle + forwardRef

记住：选择合适的Hook来解决特定的问题，不要为了使用而使用！
