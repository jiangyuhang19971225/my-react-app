import { useState } from 'react';
// <T> 是泛型参数声明，写在函数名之后、参数列表之前
// 表示这个自定义 Hook 可以处理任意类型的 Promise 返回值

// fn: () => Promise<T> 是参数类型定义
// 表示参数 fn 必须是一个返回 Promise 的函数，且该 Promise 的返回类型就是 T
// <T> 相当于说 "我支持任何类型，具体类型由调用者决定"
// () => Promise<T> 相当于要求 "给我一个能生产 T 类型数据的异步方法"
// useState<T | null> 表示 "我会存储 T 类型的数据，初始为 null"
// 调用者给出 T 类型原料工厂 → useRequest 建立 T 类型生产线 → 最终产出 T 类型产品

// const useRequest = <T>(fn: () => Promise<T>) => {
//     // 这里 T 可以是任何类型，比如：
//     // - 如果 fn 返回 Promise<string>，T 就是 string
//     // - 如果 fn 返回 Promise<User>，T 就是 User
//     const [data, setData] = useState<T | null>(null);
//   }

// // 获取字符串数据
// const { data: text } = useRequest(() => axios.get('/api/text'));
// // text 自动识别为 string | null

// // 获取用户对象
// const { data: user } = useRequest(() => axios.get('/api/user'));
// user 自动识别为 { id: number; name: string } | null
const useRequest = <T>(fn: () => Promise<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const request = async () => {
    setLoading(true);
    try {
      const res = await fn();
      setData(res);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    request, // 返回 request 方法让调用方控制何时执行
  };
};

export default useRequest;

// import { useState } from 'react';

// function useRequest<T>(fn: () => Promise<T>) {
//   const [data, setData] = useState<T | null>(null);
//   // ... 中间代码保持不变 ...
//   const request = async () => {
//     setLoading(true);
//     try {
//       const res = await fn();
//       setData(res);
//     } catch (err) {
//       setError(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return {
//     data,
//     loading,
//     error,
//     request,
//   };
// }

// export default useRequest;

// 示例1: 获取用户数据
// interface User {
//   id: number;
//   name: string;
//   email: string;
// }

// const { data, loading, error } = useRequest<User[]>(() => axios.get('/api/users'));
// // 这里 T = User[]
// // data 的类型是 User[] | null

// // 示例2: 获取字符串数据
// const { data: message } = useRequest<string>(() => axios.get('/api/message'));
// // 这里 T = string
// // message 的类型是 string | null

// // 示例3: 获取数字数据
// const { data: count } = useRequest<number>(() => axios.get('/api/count'));
// // 这里 T = number
// // count 的类型是 number | null
