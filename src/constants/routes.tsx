import { MenuProps } from 'antd';
import { 
  FileTextOutlined,
  ProjectOutlined,
  TagOutlined,
  AppstoreOutlined
} from '@ant-design/icons';

export interface RouteConfig {
  path: string;
  label: string;
  icon?: React.ReactNode;
  children?: RouteConfig[];
}

export const routes: RouteConfig[] = [
  {
    path: '/blog',
    label: '文章管理',
    icon: <FileTextOutlined />,
    children: [
      {
        path: '/blog/list',
        label: '文章列表'
      },
      {
        path: '/blog/create',
        label: '发布文章'
      }
    ]
  },
  {
    path: '/project',
    label: '项目管理',
    icon: <ProjectOutlined />,
    children: [
      {
        path: '/project/list',
        label: '项目列表'
      },
      {
        path: '/project/create',
        label: '创建项目'
      }
    ]
  },
  {
    path: '/category',
    label: '分类管理',
    icon: <AppstoreOutlined />,
    children: [
      {
        path: '/category/list',
        label: '分类列表'
      }
    ]
  },
  {
    path: '/tag',
    label: '标签管理',
    icon: <TagOutlined />,
    children: [
      {
        path: '/tag/list',
        label: '标签列表'
      }
    ]
  }
];

export const getMenuItems = (routes: RouteConfig[]): MenuProps['items'] => {
  return routes.map(route => ({
    key: route.path,
    icon: route.icon,
    label: route.label,
    children: route.children ? getMenuItems(route.children) : undefined
  }));
};
