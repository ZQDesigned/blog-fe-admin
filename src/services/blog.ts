import http from '../utils/request';

export interface BlogPost {
  id: number;
  title: string;
  content: string;
  summary: string;
  categoryId: number;
  categoryName: string;
  tagIds: number[];
  tagNames: string[];
  viewCount: number;
  createTime: string;
  updateTime: string;
}

export interface PageableSort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: PageableSort;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface BlogListResponse {
  content: BlogPost[];
  pageable: Pageable;
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: PageableSort;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface BlogListParams {
  page?: number;
  size?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  tag?: string;
  category?: string;
}

export const blogService = {
  // 获取文章列表
  getList(params: BlogListParams) {
    return http.get<BlogListResponse>('/blog/list', { params });
  },

  // 获取文章详情
  getDetail(id: number) {
    return http.get<BlogPost>(`/blog/${id}`);
  },

  // 创建文章
  create(data: {
    title: string;
    content: string;
    summary: string;
    categoryId: number;
    tagIds: number[];
  }) {
    return http.post<{ id: number }>('/blog', data);
  },

  // 更新文章
  update(id: number, data: Partial<{
    title: string;
    content: string;
    summary: string;
    categoryId: number;
    tagIds: number[];
  }>) {
    return http.put<null>(`/blog/${id}`, data);
  },

  // 删除文章
  delete(id: number) {
    return http.delete<null>(`/blog/${id}`);
  }
}; 