import React, { useEffect, useState } from 'react';
import { Card, Descriptions, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { authService, UserInfo } from '../../services/auth';
import dayjs from 'dayjs';

const Container = styled.div`
  background: #fff;
  padding: 24px;
  border-radius: 4px;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h2`
  margin: 0;
  color: rgba(0, 0, 0, 0.85);
`;

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const info = await authService.getCurrentUser();
        setUserInfo(info);
      } catch (error) {
        console.error('获取用户信息失败:', error);
        message.error('获取用户信息失败');
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <Container>
      <HeaderContainer>
        <Title>个人信息</Title>
        <Button type="primary" onClick={() => navigate('/profile/password')}>
          修改密码
        </Button>
      </HeaderContainer>
      <Card loading={loading}>
        {userInfo && (
          <Descriptions column={1}>
            <Descriptions.Item label="用户名">{userInfo.username}</Descriptions.Item>
            <Descriptions.Item label="上次登录时间">
              {dayjs(userInfo.lastLoginTime).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
            <Descriptions.Item label="上次登录IP">{userInfo.lastLoginIp}</Descriptions.Item>
          </Descriptions>
        )}
      </Card>
    </Container>
  );
};

export default Profile; 