import React, { useEffect, useState } from 'react';
import { Table, Card, Button, Space, Switch, message, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { AboutSection, getAllAboutSections, deleteAboutSection, updateAboutSection } from '../../services/about';
import AboutSectionForm from './AboutSectionForm';
import { formatDateTime } from '../../utils/date';

const AboutSectionList: React.FC = () => {
  const [sections, setSections] = useState<AboutSection[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingSection, setEditingSection] = useState<AboutSection | null>(null);
  const [formVisible, setFormVisible] = useState(false);
  const [nextSortOrder, setNextSortOrder] = useState(0);

  const fetchSections = async () => {
    try {
      setLoading(true);
      const response = await getAllAboutSections();
      setSections(response);
    } catch (error) {
      message.error('获取区块列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const handleAdd = () => {
    // 计算当前最大的排序值
    const maxSortOrder = sections.length > 0
      ? Math.max(...sections.map(section => section.sortOrder))
      : -1;
    
    setEditingSection(null);
    setFormVisible(true);
    
    // 将最大排序值+1保存，以便传递给表单组件
    setNextSortOrder(maxSortOrder + 1);
  };

  const handleEdit = (section: AboutSection) => {
    setEditingSection(section);
    setFormVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteAboutSection(id);
      message.success('删除成功');
      fetchSections();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleToggleEnabled = async (id: number, enabled: boolean) => {
    try {
      await updateAboutSection(id, { enabled });
      message.success('更新状态成功');
      fetchSections();
    } catch (error) {
      message.error('更新状态失败');
    }
  };

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeMap = {
          profile: '个人简介',
          skills: '技能特长',
          journey: '成长历程',
          contact: '联系方式',
          custom: '自定义',
        };
        return typeMap[type as keyof typeof typeMap] || type;
      },
    },
    {
      title: '排序',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      key: 'enabled',
      width: 100,
      render: (enabled: boolean, record: AboutSection) => (
        <Switch
          checked={enabled}
          onChange={(checked) => handleToggleEnabled(record.id!, checked)}
        />
      ),
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 180,
      render: (time: string) => formatDateTime(time),
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_: any, record: AboutSection) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个区块吗？"
            onConfirm={() => handleDelete(record.id!)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="区块管理"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          添加区块
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={sections}
        rowKey="id"
        loading={loading}
        pagination={false}
      />
      <AboutSectionForm
        visible={formVisible}
        section={editingSection}
        nextSortOrder={nextSortOrder}
        onCancel={() => setFormVisible(false)}
        onSuccess={() => {
          setFormVisible(false);
          fetchSections();
        }}
      />
    </Card>
  );
};

export default AboutSectionList;
