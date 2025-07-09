// 🔥 【REDUX SLICE】- 包含 Actions + Reducer 的现代Redux写法
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Language, LanguageState } from '../../types/language';

// 🎯 初始状态
const initialState: LanguageState = {
  currentLanguage: 'zh', // 默认中文
};

// 🎯 【REDUX SLICE】- 使用RTK的createSlice，自动生成actions和reducer
const languageSlice = createSlice({
  name: 'language', // slice名称
  initialState,
  reducers: {
    // 🔥 【ACTION + REDUCER】- 切换语言的action和对应的reducer逻辑
    switchLanguage: (state, action: PayloadAction<Language>) => {
      state.currentLanguage = action.payload;
      // 🎯 RTK使用Immer库，可以直接修改state（内部会创建不可变副本）
    },
  },
});

// 🔥 【ACTIONS】- 导出action creators
export const { switchLanguage } = languageSlice.actions;

// 🔥 【REDUCER】- 导出reducer
export default languageSlice.reducer;

// 🔥 【SELECTORS】- 选择器，用于从state中获取数据
export const selectCurrentLanguage = (state: { language: LanguageState }) =>
  state.language.currentLanguage;
