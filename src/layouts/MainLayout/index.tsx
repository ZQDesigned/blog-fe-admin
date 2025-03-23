import React, { useEffect, useState } from 'react';
import { Layout, Menu, Breadcrumb, Dropdown, Space, Avatar, message } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { UserOutlined, LogoutOutlined, KeyOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { routes, getMenuItems } from '../../constants/routes';
import { authService, UserInfo } from '../../services/auth';
import type { MenuProps } from 'antd';

const { Header, Content, Sider, Footer } = Layout;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

const StyledHeader = styled(Header)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: #fff;
  padding: 0 24px;
  display: flex;
  align-items: center;
  height: 64px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
`;

const MainContainer = styled(Layout)`
  padding-top: 64px;
  min-height: calc(100vh - 64px);
`;

const StyledSider = styled(Sider)`
  position: fixed;
  top: 64px;
  left: 0;
  bottom: 0;
  overflow-y: auto;
  background: #fff;
  border-right: 1px solid #f0f0f0;
  z-index: 99;
  
  .ant-menu {
    background: transparent;
    border-right: none;
    height: 100%;
  }

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
`;

const ContentWrapper = styled(Layout)`
  margin-left: 200px;
  min-height: calc(100vh - 64px);
  padding: 24px;
  background: #f5f5f5;
  position: relative;
  padding-bottom: 74px; /* 50px footer + 24px padding */
`;

const StyledContent = styled(Content)`
  background: #fff;
  border-radius: 4px;
  padding: 24px;
  width: 100%;
  min-height: 100%;
`;

const BreadcrumbContainer = styled.div`
  margin-bottom: 16px;
  background: #fff;
  padding: 12px 24px;
  border-radius: 4px;
`;

const StyledFooter = styled(Footer)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 99;
  text-align: center;
  background: #fff;
  padding: 12px 24px;
  height: 50px;
  border-top: 1px solid #f0f0f0;
  margin: 0 24px;
`;

const UserContainer = styled.div`
  margin-left: auto;
  color: rgba(0, 0, 0, 0.85);
  cursor: pointer;
`;

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const info = await authService.getCurrentUser();
        setUserInfo(info);
      } catch (error) {
        console.error('获取用户信息失败:', error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      localStorage.removeItem('token');
      message.success('退出成功');
      navigate('/login');
    } catch (error) {
      console.error('退出失败:', error);
      message.error('退出失败');
    }
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人信息',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'changePassword',
      icon: <KeyOutlined />,
      label: '修改密码',
      onClick: () => navigate('/profile/password'),
    },
    {
      key: 'divider',
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  // 根据当前路径生成面包屑
  const generateBreadcrumb = () => {
    const pathSnippets = location.pathname.split('/').filter(i => i);
    const breadcrumbItems = [
      { title: 'Home', path: '/' },
      ...pathSnippets.map((_, index) => {
        const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
        return {
          title: pathSnippets[index].charAt(0).toUpperCase() + pathSnippets[index].slice(1),
          path: url
        };
      })
    ];

    return (
      <Breadcrumb>
        {breadcrumbItems.map((item, index) => (
          <Breadcrumb.Item key={item.path}>
            {index === breadcrumbItems.length - 1 ? (
              item.title
            ) : (
              <a onClick={() => navigate(item.path)}>{item.title}</a>
            )}
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>
    );
  };

  return (
    <StyledLayout>
      <StyledHeader>
        <div>博客后台管理系统</div>
        <UserContainer>
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Space>
              <Avatar icon={<UserOutlined />} />
              <span>{userInfo?.username}</span>
            </Space>
          </Dropdown>
        </UserContainer>
      </StyledHeader>
      <MainContainer>
        <StyledSider width={200}>
          <Menu
            mode="inline"
            defaultSelectedKeys={[location.pathname]}
            defaultOpenKeys={['/blog', '/project', '/category', '/tag']}
            items={getMenuItems(routes)}
            onClick={handleMenuClick}
          />
        </StyledSider>
        <ContentWrapper>
          <BreadcrumbContainer>
            {generateBreadcrumb()}
          </BreadcrumbContainer>
          <StyledContent>
            <Outlet />
          </StyledContent>
          <StyledFooter>Footer</StyledFooter>
        </ContentWrapper>
      </MainContainer>
    </StyledLayout>
  );
};

export default MainLayout; 