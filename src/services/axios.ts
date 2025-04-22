import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { message } from 'antd';

// 创建axios实例
const instance = axios.create({
  baseURL: '/api', // 基准路径前缀
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 在请求头中添加token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error: AxiosError) => {
    if (error.response) {
      // 请求已发出，但服务器返回状态码不在2xx范围内
      switch (error.response.status) {
        case 401:
          message.error('未授权，请重新登录');
          // 可以在这里处理登出逻辑
          localStorage.removeItem('token');
          break;
        case 403:
          message.error('拒绝访问');
          break;
        case 404:
          message.error('请求的资源不存在');
          break;
        case 500:
          message.error('服务器内部错误');
          break;
        default:
          message.error(`请求失败: ${error.message}`);
      }
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      message.error('网络异常，请检查网络连接');
    } else {
      // 请求配置有误
      message.error(`请求错误: ${error.message}`);
    }
    return Promise.reject(error);
  },
);

export default instance;
