import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import AuthGuard from './components/AuthGuard';
import BlogList from './pages/Blog/List';
import BlogEdit from './pages/Blog/Edit';
import BlogDetail from './pages/Blog/Detail';
import ProjectList from './pages/Project/List';
import ProjectEdit from './pages/Project/Edit';
import ProjectDetail from './pages/Project/Detail';
import CategoryList from './pages/Category/List';
import TagList from './pages/Tag/List';
import Profile from './pages/Profile';
import ChangePassword from './pages/Profile/Password';

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
            <Route index element={<Navigate to="/blog/list" replace />} />
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
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;
