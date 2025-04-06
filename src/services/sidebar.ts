import request from '../utils/request';

export interface Announcement {
  title: string;
  content: string;
  type: 'text' | 'link';
  link?: string;
}

export interface SidebarConfig {
  id?: number;
  avatar: string;
  name: string;
  bio: string;
  online: boolean;
  statusText: string;
  announcements: string;
  email: string;
  showWeather: boolean;
  createTime?: string;
  updateTime?: string;
}

// 获取侧边栏配置
export const getSidebarConfig = () => {
  return request.get<SidebarConfig>('/home/sidebar/config');
};

// 更新侧边栏配置
export const updateSidebarConfig = (data: Omit<SidebarConfig, 'id' | 'createTime' | 'updateTime'>) => {
  return request.put<SidebarConfig>('/home/sidebar/config', data);
}; 