import http from '../utils/request';

export interface Project {
  id: number;
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  imageName: string;
  tags: string[] | null;
  github: {
    url: string;
    disabled: boolean;
    disabledReason: string | null;
  };
  demo: {
    url: string;
    disabled: boolean;
    disabledReason: string | null;
  };
  status: 'developing' | 'maintaining' | 'paused';
  features: string[];
  techStack: string[];
  createTime: string;
  updateTime: string;
}

export interface ProjectListResponse {
  list: Project[];
}

export const projectService = {
  // 获取项目列表
  getList() {
    return http.get<Project[]>('/project/list');
  },

  // 获取项目详情
  getDetail(id: number) {
    return http.get<Project>(`/project/${id}`);
  },

  // 创建项目
  create(data: FormData) {
    return http.post<{ id: number }>('/project', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // 更新项目
  update(id: number, data: FormData) {
    return http.put<null>(`/project/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // 删除项目
  delete(id: number) {
    return http.delete<null>(`/project/${id}`);
  }
}; 