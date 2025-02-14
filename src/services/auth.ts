import http from '../utils/request';

export interface LoginParams {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresIn: number;
  tokenType: string;
}

export interface UserInfo {
  id: number;
  username: string;
  lastLoginTime: string;
  lastLoginIp: string;
}

export const authService = {
  // 登录
  login(data: LoginParams) {
    return http.post<LoginResponse>('/auth/login', data);
  },

  // 获取当前用户信息
  getCurrentUser() {
    return http.get<UserInfo>('/auth/info');
  },

  // 修改密码
  changePassword(data: { oldPassword: string; newPassword: string }) {
    return http.put<null>('/auth/password', data);
  },

  // 退出登录
  logout() {
    return http.post<null>('/auth/logout');
  },

  // 刷新令牌
  refreshToken() {
    return http.post<LoginResponse>('/auth/refresh');
  }
}; 