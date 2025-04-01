import React, { useEffect, useState } from 'react';
import { Table, Space, Button, Popconfirm, message, Modal, Form, Input } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { tagService, Tag } from '../../../services/tag';
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
  margin-bottom: 16px;
`;

const Title = styled.h2`
  margin: 0;
  color: rgba(0, 0, 0, 0.85);
`;

const TagList: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const [data, setData] = useState<Tag[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await tagService.getList();
      setData(response);
    } catch (error) {
      console.error('获取标签列表失败:', error);
      message.error('获取标签列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    setDeleteLoading(id);
    try {
      await tagService.delete(id);
      message.success('删除成功');
      fetchData();
    } catch (error) {
      console.error('删除失败:', error);
      message.error('删除失败');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleModalOk = async () => {
    setModalLoading(true);
    try {
      const values = await form.validateFields();
      if (editingTag) {
        await tagService.update(editingTag.id, values);
        message.success('更新成功');
      } else {
        await tagService.create(values);
        message.success('创建成功');
      }
      setModalVisible(false);
      form.resetFields();
      setEditingTag(null);
      fetchData();
    } catch (error) {
      console.error('提交失败:', error);
      message.error('提交失败');
    } finally {
      setModalLoading(false);
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    form.resetFields();
    setEditingTag(null);
  };

  const handleEdit = (record: Tag) => {
    setEditingTag(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const columns = [
    {
      title: '标签名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: 300,
      ellipsis: true,
    },
    {
      title: '文章数量',
      dataIndex: 'articleCount',
      key: 'articleCount',
      width: 120,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 180,
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: Tag) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个标签吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
            okButtonProps={{ loading: deleteLoading === record.id }}
          >
            <Button type="text" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Container>
      <HeaderContainer>
        <Title>标签列表</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
        >
          新建标签
        </Button>
      </HeaderContainer>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={false}
      />
      <Modal
        title={editingTag ? '编辑标签' : '新建标签'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        destroyOnClose
        confirmLoading={modalLoading}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ name: '', description: '' }}
        >
          <Form.Item
            name="name"
            label="标签名称"
            rules={[{ required: true, message: '请输入标签名称' }]}
          >
            <Input placeholder="请输入标签名称" />
          </Form.Item>
          <Form.Item
            name="description"
            label="标签描述"
            rules={[{ required: true, message: '请输入标签描述' }]}
          >
            <Input.TextArea rows={4} placeholder="请输入标签描述" />
          </Form.Item>
        </Form>
      </Modal>
    </Container>
  );
};

export default TagList; 