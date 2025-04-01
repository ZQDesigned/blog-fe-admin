import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { authService, LoginParams } from '../../services/auth';

const LoginContainer = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5;
`;

const LoginCard = styled(Card)`
  width: 400px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

const LoginTitle = styled.h2`
  text-align: center;
  margin-bottom: 30px;
  color: #1890ff;
`;

const LoginButton = styled(Button)`
  width: 100%;
`;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: LoginParams) => {
    setLoading(true);
    try {
      const response = await authService.login(values);
      localStorage.setItem('token', response.token);
      message.success('登录成功');
      navigate('/dashboard');
    } catch (error) {
      console.error('登录失败:', error);
      message.error('登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <LoginTitle>博客后台管理系统</LoginTitle>
        <Form
          form={form}
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              size="large"
            />
          </Form.Item>
          <Form.Item>
            <LoginButton type="primary" htmlType="submit" size="large" loading={loading}>
              登录
            </LoginButton>
          </Form.Item>
        </Form>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login; 