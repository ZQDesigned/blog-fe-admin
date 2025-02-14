import http from '../utils/request';

export interface Tag {
  id: number;
  name: string;
  description: string;
  articleCount: number;
  createTime: string;
  updateTime: string;
}

export const tagService = {
  // 获取标签列表
  getList() {
    return http.get<Tag[]>('/tag/list');
  },

  // 获取标签详情
  getDetail(id: number) {
    return http.get<Tag>(`/tag/${id}`);
  },

  // 创建标签
  create(data: Pick<Tag, 'name' | 'description'>) {
    return http.post<Tag>('/tag', data);
  },

  // 更新标签
  update(id: number, data: Pick<Tag, 'name' | 'description'>) {
    return http.put<Tag>(`/tag/${id}`, data);
  },

  // 删除标签
  delete(id: number) {
    return http.delete<null>(`/tag/${id}`);
  }
}; 