// 🔥 【REDUX STORE】- 应用的全局状态管理中心
import { configureStore } from '@reduxjs/toolkit';
import languageReducer from './slices/languageSlice';
import userReducer from './slices/userSlice';

// 🎯 【STORE 配置】- 使用RTK的configureStore创建store
export const store = configureStore({
  reducer: {
    // 🔥 将languageReducer注册到store中，对应state.language
    language: languageReducer,
    user: userReducer,
  },
  // RTK默认包含redux-thunk中间件和开发工具支持
});

// 🔥 【TypeScript类型支持】
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// 🔥 【类型化的Hooks】- 避免每次使用时都要类型断言
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
