import request from '../utils/request';

export interface FooterLink {
  title: string;
  url: string;
  icon: string;
  isExternal: boolean;
}

export interface FooterConfig {
  id?: number;
  links: string;
  createTime?: string;
  updateTime?: string;
}

// 获取页脚配置
export const getFooterConfig = () => {
  return request.get<FooterConfig>('/footer/profile/config');
};

// 更新页脚配置
export const updateFooterConfig = (data: Omit<FooterConfig, 'id' | 'createTime' | 'updateTime'>) => {
  return request.put<FooterConfig>('/footer/profile/config', data);
}; 