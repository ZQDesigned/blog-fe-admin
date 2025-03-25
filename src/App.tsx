import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import PageLoading from './components/PageLoading';

// 懒加载组件
const MainLayout = React.lazy(() => import('./layouts/MainLayout'));
const Login = React.lazy(() => import('./pages/Login'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const BlogList = React.lazy(() => import('./pages/Blog/List'));
const BlogEdit = React.lazy(() => import('./pages/Blog/Edit'));
const BlogDetail = React.lazy(() => import('./pages/Blog/Detail'));
const ProjectList = React.lazy(() => import('./pages/Project/List'));
const ProjectEdit = React.lazy(() => import('./pages/Project/Edit'));
const ProjectDetail = React.lazy(() => import('./pages/Project/Detail'));
const CategoryList = React.lazy(() => import('./pages/Category/List'));
const TagList = React.lazy(() => import('./pages/Tag/List'));
const Profile = React.lazy(() => import('./pages/Profile'));
const ChangePassword = React.lazy(() => import('./pages/Profile/Password'));
const AuthGuard = React.lazy(() => import('./components/AuthGuard'));

const App: React.FC = () => {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 4,
        },
      }}
    >
      <BrowserRouter>
        <Suspense fallback={<PageLoading />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <AuthGuard>
                  <MainLayout />
                </AuthGuard>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              {/* 数据大屏 */}
              <Route path="/dashboard" element={<Dashboard />} />
              {/* 博客相关路由 */}
              <Route path="/blog">
                <Route path="list" element={<BlogList />} />
                <Route path="create" element={<BlogEdit />} />
                <Route path=":id" element={<BlogDetail />} />
                <Route path=":id/edit" element={<BlogEdit />} />
              </Route>
              {/* 项目相关路由 */}
              <Route path="/project">
                <Route path="list" element={<ProjectList />} />
                <Route path="create" element={<ProjectEdit />} />
                <Route path=":id" element={<ProjectDetail />} />
                <Route path=":id/edit" element={<ProjectEdit />} />
              </Route>
              {/* 分类相关路由 */}
              <Route path="/category">
                <Route path="list" element={<CategoryList />} />
              </Route>
              {/* 标签相关路由 */}
              <Route path="/tag">
                <Route path="list" element={<TagList />} />
              </Route>
              {/* 个人信息相关路由 */}
              <Route path="/profile">
                <Route index element={<Profile />} />
                <Route path="password" element={<ChangePassword />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;
