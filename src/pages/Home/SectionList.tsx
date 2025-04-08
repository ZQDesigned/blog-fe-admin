import React, { useEffect, useState } from 'react';
import { Table, Card, Button, Space, Switch, message, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Section, getAllSections, updateSection, createSection, getSection, deleteSection } from '../../services/home';
import { formatDateTime } from '../../utils/date';
import Modal from '../../components/Section/Modal';
import ImageUploader from '../../components/ImageUploader';
import { DragOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

const SectionList: React.FC = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [maxSortOrder, setMaxSortOrder] = useState(0);

  const fetchSections = async () => {
    setLoading(true);
    try {
      const response = await getAllSections();
      setSections(response);
      const maxOrder = Math.max(...response.map(section => section.sortOrder), 0);
      setMaxSortOrder(maxOrder);
    } catch (error) {
      message.error('获取区块列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const handleToggleEnabled = async (id: number, enabled: boolean) => {
    try {
      await updateSection(id, { enabled });
      message.success('更新成功');
      fetchSections();
    } catch (error) {
      message.error('更新失败');
    }
  };

  const handleEdit = async (id: number) => {
    try {
      const response = await getSection(id);
      setEditingSection(response);
      setModalVisible(true);
    } catch (error) {
      message.error('获取区块详情失败');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteSection(id);
      message.success('删除成功');
      fetchSections();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleCreate = () => {
    setEditingSection(undefined);
    const initialValues: Partial<Section> = {
      sortOrder: maxSortOrder + 1,
      enabled: true,
    };
    setEditingSection(initialValues as Section);
    setModalVisible(true);
  };

  const handleModalSubmit = async (values: Omit<Section, 'id' | 'createTime' | 'updateTime'>) => {
    setSubmitting(true);
    try {
      if (editingSection?.id) {
        await updateSection(editingSection.id, values);
        message.success('更新成功');
      } else {
        await createSection(values);
        message.success('创建成功');
      }
      setModalVisible(false);
      fetchSections();
    } catch (error) {
      message.error(editingSection?.id ? '更新失败' : '创建失败');
    } finally {
      setSubmitting(false);
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setEditingSection(undefined);
  };

  const handleSort = () => {
    setModalVisible(false);
    window.open('/home/sections/sort', '_blank');
  };

  const columns: ColumnsType<Section> = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 120,
    },
    {
      title: '标题',
      dataIndex: 'title',
    },
    {
      title: '描述',
      dataIndex: 'description',
      ellipsis: true,
    },
    {
      title: '排序',
      dataIndex: 'sortOrder',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      width: 100,
      render: (enabled: boolean, record) => (
        <Switch
          checked={enabled}
          onChange={(checked) => handleToggleEnabled(record.id!, checked)}
        />
      ),
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      width: 180,
      render: (time) => formatDateTime(time),
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.id!)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个区块吗？"
            description="删除后不可恢复，请确认是否继续。"
            onConfirm={() => handleDelete(record.id!)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              danger
              size="small"
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <ImageUploader />
      <Card
        title="区块管理"
        extra={
          <Space>
            <Button icon={<DragOutlined />} onClick={handleSort}>
              排序管理
            </Button>
            <Button type="primary" onClick={handleCreate}>
              新建区块
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={sections}
          rowKey="id"
          loading={loading}
          pagination={false}
        />
      </Card>

      <Modal
        open={modalVisible}
        title={editingSection?.id ? '编辑区块' : '新建区块'}
        initialValues={editingSection}
        onSubmit={handleModalSubmit}
        onCancel={handleModalCancel}
        confirmLoading={submitting}
      />
    </>
  );
};

export default SectionList;
