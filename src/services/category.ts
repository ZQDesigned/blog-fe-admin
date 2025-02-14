import http from '../utils/request';

export interface Category {
  id: number;
  name: string;
  description: string;
  articleCount: number;
  createTime: string;
  updateTime: string;
}

export const categoryService = {
  // 获取分类列表
  getList() {
    return http.get<Category[]>('/category/list');
  },

  // 获取分类详情
  getDetail(id: number) {
    return http.get<Category>(`/category/${id}`);
  },

  // 创建分类
  create(data: Pick<Category, 'name' | 'description'>) {
    return http.post<Category>('/category', data);
  },

  // 更新分类
  update(id: number, data: Pick<Category, 'name' | 'description'>) {
    return http.put<Category>(`/category/${id}`, data);
  },

  // 删除分类
  delete(id: number) {
    return http.delete<null>(`/category/${id}`);
  }
}; 