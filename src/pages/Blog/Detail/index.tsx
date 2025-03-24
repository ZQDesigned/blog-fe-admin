import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Space, Tag, Skeleton, message } from 'antd';
import { EditOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import ReactMarkdown from 'react-markdown';
import { blogService, BlogPost } from '../../../services/blog';
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
  margin: 0 0 16px;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
`;

const MetaContainer = styled.div`
  display: flex;
  align-items: center;
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
  margin-bottom: 16px;

  & > * {
    margin-right: 16px;
  }
`;

const ContentContainer = styled.div`
  font-size: 16px;
  line-height: 1.8;
  color: rgba(0, 0, 0, 0.85);

  img {
    max-width: 100%;
  }

  pre {
    background-color: #f6f8fa;
    padding: 16px;
    border-radius: 4px;
    overflow-x: auto;
  }

  code {
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
  }

  blockquote {
    margin: 0;
    padding-left: 16px;
    border-left: 4px solid #dfe2e5;
    color: rgba(0, 0, 0, 0.65);
  }
`;

const BlogDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState<BlogPost | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await blogService.getDetail(Number(id));
        setBlog(data);
      } catch (error) {
        console.error('获取文章详情失败:', error);
        message.error('获取文章详情失败');
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

  if (!blog) {
    return (
      <Container>
        <div>文章不存在或已被删除</div>
      </Container>
    );
  }

  return (
    <Container>
      <HeaderContainer>
        <Space style={{ marginBottom: 16 }}>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/blog/list')}>
            返回列表
          </Button>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/blog/${id}/edit`)}
          >
            编辑文章
          </Button>
        </Space>
        <Title>{blog.title}</Title>
        <MetaContainer>
          <span>分类：{blog.categoryName}</span>
          <span>
            标签：
            {blog.tagNames?.map((tag) => (
              <Tag key={tag} color="blue">
                {tag}
              </Tag>
            ))}
          </span>
          <span>访问量：{blog.viewCount}</span>
          <span>创建时间：{dayjs(blog.createTime).format('YYYY-MM-DD HH:mm:ss')}</span>
          <span>更新时间：{dayjs(blog.updateTime).format('YYYY-MM-DD HH:mm:ss')}</span>
        </MetaContainer>
      </HeaderContainer>
      <ContentContainer>
        <ReactMarkdown>{blog.content}</ReactMarkdown>
      </ContentContainer>
    </Container>
  );
};

export default BlogDetail; 