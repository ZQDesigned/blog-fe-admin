import request from '../utils/request';

// 区块相关接口
export interface Section {
  id?: number;
  type: 'banner' | 'features' | 'skills' | 'timeline' | 'contact';
  title: string;
  description: string;
  content: string;
  sortOrder: number;
  enabled: boolean;
  createTime?: string;
  updateTime?: string;
}

export interface WebsiteMeta {
  id?: number;
  title: string;
  description: string;
  keywords: string;
  createTime?: string;
  updateTime?: string;
}

// 获取所有区块
export const getAllSections = () => {
  return request.get<Section[]>('/home/sections');
};

// 获取单个区块
export const getSection = (id: number) => {
  return request.get<Section>(`/home/sections/${id}`);
};

// 创建区块
export const createSection = (data: Omit<Section, 'id' | 'createTime' | 'updateTime'>) => {
  return request.post<Section>('/home/sections', data);
};

// 更新区块
export const updateSection = (id: number, data: Partial<Section>) => {
  return request.put<Section>(`/home/sections/${id}`, data);
};

// 获取网站元数据
export const getWebsiteMeta = () => {
  return request.get<WebsiteMeta>('/home/meta');
};

// 更新网站元数据
export const updateWebsiteMeta = (data: Omit<WebsiteMeta, 'id' | 'createTime' | 'updateTime'>) => {
  return request.put<WebsiteMeta>('/home/meta', data);
};
