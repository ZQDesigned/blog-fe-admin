import { MenuProps } from 'antd';
import {
  FileTextOutlined,
  ProjectOutlined,
  TagOutlined,
  AppstoreOutlined,
  DashboardOutlined,
  HomeOutlined,
  UserOutlined
} from '@ant-design/icons';
import React from 'react';

export interface RouteConfig {
  path: string;
  label: string;
  icon?: React.ReactNode;
  children?: RouteConfig[];
  element?: React.LazyExoticComponent<React.ComponentType<any>>;
  hideInMenu?: boolean;
}

export const routes: RouteConfig[] = [
  {
    path: '/dashboard',
    label: '数据大屏',
    icon: <DashboardOutlined />,
    element: React.lazy(() => import('../pages/Dashboard')),
  },
  {
    path: '/home',
    label: '首页管理',
    icon: <HomeOutlined />,
    children: [
      {
        path: '/home/sections',
        label: '区块管理',
        element: React.lazy(() => import('../pages/Home')),
      },
      {
        path: '/home/sections/sort',
        label: '区块排序',
        element: React.lazy(() => import('../pages/Home/SectionSort')),
        hideInMenu: true,
      },
      {
        path: '/home/sidebar',
        label: '侧边栏管理',
        element: React.lazy(() => import('../pages/Home/SidebarConfig')),
      },
      {
        path: '/home/footer',
        label: '页脚管理',
        element: React.lazy(() => import('../pages/Home/FooterConfig')),
      }
    ]
  },
  {
    path: '/about',
    label: '关于我',
    icon: <UserOutlined />,
    children: [
      {
        path: '/about/sections',
        label: '区块管理',
        element: React.lazy(() => import('../pages/About/AboutSectionList')),
      },
      {
        path: '/about/sections/sort',
        label: '区块排序',
        element: React.lazy(() => import('../pages/About/AboutSectionSort')),
        hideInMenu: true,
      }
    ]
  },
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
