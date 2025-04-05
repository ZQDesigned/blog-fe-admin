import axios, { AxiosResponse, AxiosRequestConfig, AxiosError } from 'axios';
import { message } from 'antd';
import { config } from '../config';

const request = axios.create({
  baseURL: config.api.baseURL,
  timeout: 10000,
});

// 用于存储正在刷新 token 的 Promise
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// 订阅 token 刷新事件
const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

// 执行所有订阅者的回调
const onRefreshed = (token: string) => {
  refreshSubscribers.map(cb => cb(token));
  refreshSubscribers = [];
};

// 检查 token 是否即将过期（默认提前5分钟刷新）
const isTokenExpiringSoon = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    // JWT token 的第二部分是 payload，包含过期时间
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000; // 转换为毫秒
    const currentTime = Date.now();
    const timeUntilExpiry = expirationTime - currentTime;
    
    // 如果 token 将在 5 分钟内过期，返回 true
    return timeUntilExpiry < 5 * 60 * 1000 && timeUntilExpiry > 0;
  } catch (error) {
    return false;
  }
};

// 刷新 token
const refreshToken = async () => {
  try {
    const response = await axios.post(`${config.api.baseURL}/auth/refresh`, null, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const { token } = response.data.data;
    localStorage.setItem('token', token);
    return token;
  } catch (error) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    return null;
  }
};

// 请求拦截器
request.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // 检查 token 是否即将过期
      if (isTokenExpiringSoon() && !config.url?.includes('/auth/refresh')) {
        if (!isRefreshing) {
          isRefreshing = true;
          const newToken = await refreshToken();
          isRefreshing = false;
          if (newToken) {
            onRefreshed(newToken);
          }
        }

        // 等待获取新的 token
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            config.headers.Authorization = `Bearer ${token}`;
            resolve(config);
          });
        });
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    const { code, msg, data } = response.data;
    
    if (code === 200) {
      return data;
    }
    
    message.error(msg || '请求失败');
    return Promise.reject(new Error(msg || '请求失败'));
  },
  (error: AxiosError) => {
    if (error.response) {
      const { status } = error.response;
      switch (status) {
        case 401:
          // 清除本地存储的 token
          localStorage.removeItem('token');
          message.error('登录已过期，请重新登录');
          // 如果不是刷新 token 的请求导致的 401，则跳转到登录页
          if (!error.config?.url?.includes('/auth/refresh')) {
            window.location.href = '/login';
          }
          break;
        case 403:
          message.error('没有权限访问');
          break;
        case 404:
          message.error('请求的资源不存在');
          break;
        case 500:
          message.error('服务器错误');
          break;
        default:
          message.error('网络错误');
      }
    } else {
      message.error('网络错误');
    }
    return Promise.reject(error);
  }
);

export interface ResponseData<T = any> {
  code: number;
  msg: string;
  data: T;
}

const http = {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return request.get(url, config);
  },
  
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return request.post(url, data, config);
  },
  
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return request.put(url, data, config);
  },
  
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return request.delete(url, config);
  }
};

export default http; 