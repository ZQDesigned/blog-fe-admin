import http from '../utils/request';

export interface DashboardStats {
  totalArticles: number;
  totalProjects: number;
  totalCategories: number;
  totalTags: number;
  visitTrend: Array<{
    date: string;
    value: number;
  }>;
  categoryStats: Array<{
    category: string;
    value: number;
  }>;
  projectStats: Array<{
    type: string;
    value: number;
  }>;
}

export const statsService = {
  // 获取仪表盘统计数据
  getDashboardStats() {
    return http.get<DashboardStats>('/stats/dashboard');
  },
}; 