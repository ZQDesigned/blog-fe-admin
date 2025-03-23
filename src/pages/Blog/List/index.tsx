import React, { useEffect, useState } from 'react';
import { Table, Space, Button, Popconfirm, message, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { blogService, BlogPost } from '../../../services/blog';
import dayjs from 'dayjs';

const TableContainer = styled.div`
  background: #fff;
  padding: 24px;
  border-radius: 4px;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const Title = styled.h2`
  margin: 0;
  color: rgba(0, 0, 0, 0.85);
`;

const BlogList: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<BlogPost[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchData = async (page = 1, size = 10) => {
    setLoading(true);
    try {
      const response = await blogService.getList({
        page,
        size,
        sort: 'createTime',
        order: 'desc',
      });
      setData(response.content);
      setPagination({
        ...pagination,
        current: response.number + 1,
        total: response.totalElements,
      });
    } catch (error) {
      console.error('获取博客列表失败:', error);
      message.error('获取博客列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await blogService.delete(id);
      message.success('删除成功');
      fetchData(pagination.current);
    } catch (error) {
      console.error('删除失败:', error);
      message.error('删除失败');
    }
  };

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 300,
      ellipsis: true,
    },
    {
      title: '分类',
      dataIndex: 'categoryName',
      key: 'categoryName',
      width: 120,
    },
    {
      title: '标签',
      dataIndex: 'tagNames',
      key: 'tagNames',
      width: 200,
      render: (tags: string[]) => (
        <>
          {tags.map((tag) => (
            <Tag key={tag} color="blue">
              {tag}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: '访问量',
      dataIndex: 'viewCount',
      key: 'viewCount',
      width: 100,
      sorter: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_: any, record: BlogPost) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/blog/${record.id}`)}
          >
            查看
          </Button>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => navigate(`/blog/${record.id}/edit`)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这篇文章吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="text" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleTableChange = (pagination: any) => {
    fetchData(pagination.current, pagination.pageSize);
  };

  return (
    <TableContainer>
      <HeaderContainer>
        <Title>文章列表</Title>
        <Button type="primary" onClick={() => navigate('/blog/create')}>
          发布文章
        </Button>
      </HeaderContainer>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
      />
    </TableContainer>
  );
};

export default BlogList; 