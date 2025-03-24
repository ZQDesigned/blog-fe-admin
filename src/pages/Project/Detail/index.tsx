import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Space, Tag, Skeleton, message, Descriptions } from 'antd';
import { EditOutlined, ArrowLeftOutlined, GithubOutlined, GlobalOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { projectService, Project } from '../../../services/project';
import { config } from '../../../config';
import dayjs from 'dayjs';

const Container = styled.div`
  background: #fff;
  padding: 24px;
  border-radius: 4px;
`;

const HeaderContainer = styled.div`
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
`;

const Title = styled.h1`
  margin: 16px 0;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
`;

const Description = styled.p`
  margin: 0 0 16px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
`;

const ProjectImage = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

const statusColors = {
  developing: 'processing',
  maintaining: 'success',
  paused: 'default',
} as const;

const statusTexts = {
  developing: '开发中',
  maintaining: '维护中',
  paused: '暂停维护',
} as const;

const ProjectDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await projectService.getDetail(Number(id));
        setProject(data);
      } catch (error) {
        console.error('获取项目详情失败:', error);
        message.error('获取项目详情失败');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <Container>
        <Skeleton active paragraph={{ rows: 10 }} />
      </Container>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <Container>
      <HeaderContainer>
        <Space style={{ marginBottom: 16 }}>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/project/list')}>
            返回列表
          </Button>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/project/${id}/edit`)}
          >
            编辑项目
          </Button>
          <Button
            icon={<GithubOutlined />}
            href={project.github.url}
            target="_blank"
            disabled={project.github.disabled}
            title={project.github.disabledReason || undefined}
          >
            查看源码
          </Button>
          <Button
            icon={<GlobalOutlined />}
            href={project.demo.url}
            target="_blank"
            disabled={project.demo.disabled}
            title={project.demo.disabledReason || undefined}
          >
            在线演示
          </Button>
        </Space>
        <Title>{project.title}</Title>
        <Description>{project.description}</Description>
        {project.imageUrl && (
          <div style={{ marginBottom: 24 }}>
            <ProjectImage
              src={`${config.endpoint}${project.imageUrl}`}
              alt={project.title}
            />
          </div>
        )}
        <Descriptions column={2}>
          <Descriptions.Item label="项目状态">
            <Tag color={statusColors[project.status]}>{statusTexts[project.status]}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {dayjs(project.createTime).format('YYYY-MM-DD HH:mm:ss')}
          </Descriptions.Item>
          <Descriptions.Item label="技术栈">
            {project.techStack.map((tech) => (
              <Tag key={tech} color="blue">
                {tech}
              </Tag>
            ))}
          </Descriptions.Item>
          <Descriptions.Item label="更新时间">
            {dayjs(project.updateTime).format('YYYY-MM-DD HH:mm:ss')}
          </Descriptions.Item>
        </Descriptions>
      </HeaderContainer>

      <div style={{ marginBottom: 24 }}>
        <h3>项目特性</h3>
        <ul>
          {project.features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </div>
    </Container>
  );
};

export default ProjectDetail;
