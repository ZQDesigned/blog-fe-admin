import request from '../utils/request';

// 关于我的页面区块类型
export type AboutSectionType = 'profile' | 'skills' | 'journey' | 'contact' | 'custom';

// 关于我的页面区块接口
export interface AboutSection {
  id?: number;
  type: AboutSectionType;
  title: string;
  description: string;
  content: string;
  sortOrder: number;
  enabled: boolean;
  createTime?: string;
  updateTime?: string;
}

// 获取所有关于我的页面区块
export const getAllAboutSections = () => {
  return request.get<AboutSection[]>('/about/sections');
};

// 获取单个关于我的页面区块
export const getAboutSection = (id: number) => {
  return request.get<AboutSection>(`/about/sections/${id}`);
};

// 创建关于我的页面区块
export const createAboutSection = (data: Omit<AboutSection, 'id' | 'createTime' | 'updateTime'>) => {
  return request.post<AboutSection>('/about/sections', data);
};

// 更新关于我的页面区块
export const updateAboutSection = (id: number, data: Partial<Omit<AboutSection, 'id' | 'createTime' | 'updateTime'>>) => {
  return request.put<AboutSection>(`/about/sections/${id}`, data);
};

// 删除关于我的页面区块
export const deleteAboutSection = (id: number) => {
  return request.delete<null>(`/about/sections/${id}`);
};

// 更新关于我的页面区块排序
export const updateAboutSectionSort = (sectionIds: number[]) => {
  return request.put<null>('/about/sections/order', sectionIds);
};

// 更新关于我的页面区块状态
export const updateAboutSectionStatus = (id: number, enabled: boolean) => {
  return request.put<null>(`/about/sections/${id}/status`, { enabled });
}; 