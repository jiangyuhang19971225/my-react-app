// 学习使用slice 创建redux
// 🔥【slice】
// 从 @reduxjs/toolkit 库导入 createSlice、PayloadAction 和 createAsyncThunk 函数
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

/**
 * 用户状态的接口定义
 * 包含用户信息、请求状态和错误信息
 */

export interface UserState {
  // 用户信息，可为 null 表示没有用户信息
  user: {
    id: number;
    name: string;
    email: string;
    /** 用户手机号码（可选） */
    phone?: string;
    /** 用户头像URL（可选） */
    avatar?: string;
    /** 用户职业（可选） */
    job?: string;
    /** 用户所在公司（可选） */
    company?: string;
    /** 用户地址（可选） */
    address?: string;
    /** 最后登录时间（可选） */
    lastLogin?: string;
  } | null;
  // 请求状态，有空闲、加载中、失败三种状态
  status: 'idle' | 'loading' | 'failed';
  // 错误信息，可为 null 表示没有错误
  error: string | null;
}

// 初始化用户状态
const initialState: UserState = {
  user: null,
  status: 'idle',
  error: null,
};

/**
 * 创建用户状态的 slice
 * 包含状态名称、初始状态、同步 action 和异步 action 的处理
 */
export const userSlice = createSlice({
  // slice 的名称，用于在 Redux store 中标识该 slice
  name: 'user',
  // 初始状态
  initialState,
  // 同步 action 的 reducer
  reducers: {
    // 🔥【action】
    /**
     * 设置用户信息的 action
     * @param state - 当前的用户状态
     * @param action - 包含用户信息的 action
     */
    setUser: (state, action: PayloadAction<UserState['user']>) => {
      console.log('action', action);
      // 将 action 中的 payload 设置为当前用户信息
      state.user = action.payload;
    },
    /**
     * 设置请求状态的 action
     * @param state - 当前的用户状态
     * @param action - 包含请求状态的 action
     */
    setStatus: (state, action: PayloadAction<UserState['status']>) => {
      // 将 action 中的 payload 设置为当前请求状态
      state.status = action.payload;
    },
    /**
     * 设置错误信息的 action
     * @param state - 当前的用户状态
     * @param action - 包含错误信息的 action
     */
    setError: (state, action: PayloadAction<UserState['error']>) => {
      // 将 action 中的 payload 设置为当前错误信息
      state.error = action.payload;
    },
  },
  // 异步 action 的 reducer
  extraReducers: (builder) => {
    builder
      /**
       * 处理 fetchUser 请求开始的 action
       * @param state - 当前的用户状态
       */
      .addCase(fetchUser.pending, (state) => {
        // 将请求状态设置为加载中
        state.status = 'loading';
      })
      /**
       * 处理 fetchUser 请求成功的 action
       * @param state - 当前的用户状态
       * @param action - 包含请求成功返回数据的 action
       */
      .addCase(fetchUser.fulfilled, (state, action) => {
        // 将请求状态设置为空闲
        state.status = 'idle';
        // 将 action 中的 payload 设置为当前用户信息
        state.user = action.payload;
      })
      /**
       * 处理 fetchUser 请求失败的 action
       * @param state - 当前的用户状态
       * @param action - 包含请求失败错误信息的 action
       */
      .addCase(fetchUser.rejected, (state, action) => {
        // 将请求状态设置为失败
        state.status = 'failed';
        // 将 action 中的错误信息设置为当前错误信息，如果没有错误信息则使用默认值
        state.error = action.error.message || 'An unknown error occurred';
      });
  },
});

/**
 * 🔥【createAsyncThunk】- 创建异步action
 * 使用createAsyncThunk创建异步action，自动处理pending、fulfilled、rejected状态
 * @param userId - 用户的 ID
 * @returns Promise<UserState['user']> - 返回用户信息
 */
export const fetchUser = createAsyncThunk(
  'user/fetchUser', // action type前缀
  async (userId: number) => {
    try {
      // 🔥 使用mock接口地址
      const response = await axios.get<{ code: number; data: UserState['user'] }>(
        `/api/users/${userId}`,
      );

      // 🔥 处理mock接口返回的数据结构
      if (response.data.code === 200) {
        return response.data.data; // 返回实际的用户数据
      } else {
        throw new Error('API returned error code');
      }
    } catch (error) {
      console.log('Error fetching user data:', error);
      // 抛出错误，createAsyncThunk会自动处理为rejected状态
      throw new Error('Failed to fetch user data');
    }
  },
);

// 导出同步 action
export const { setUser, setStatus, setError } = userSlice.actions;

// 导出用户状态的 reducer
export default userSlice.reducer;
