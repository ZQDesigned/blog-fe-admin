import React, { useEffect, useState } from 'react';
import { Card, Form, Input, Switch, Button, message, Space, Modal } from 'antd';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import { getSidebarConfig, updateSidebarConfig, SidebarConfig as ISidebarConfig } from '../../services/sidebar';
import AnnouncementEditor from '../../components/Sidebar/AnnouncementEditor';
import AnnouncementList from '../../components/Sidebar/AnnouncementList';
import ImageUploader from '../../components/ImageUploader';

const SidebarConfig: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [config, setConfig] = useState<ISidebarConfig | null>(null);
  const [visualEditorVisible, setVisualEditorVisible] = useState(false);
  const [form] = Form.useForm();

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const response = await getSidebarConfig();
      setConfig(response);
      if (isEditing) {
        form.setFieldsValue(response);
      }
    } catch (error) {
      message.error('获取侧边栏配置失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  useEffect(() => {
    if (isEditing && config) {
      form.setFieldsValue(config);
    }
  }, [isEditing, config]);

  const handleSubmit = async (values: Omit<ISidebarConfig, 'id' | 'createTime' | 'updateTime'>) => {
    setSubmitting(true);
    try {
      await updateSidebarConfig(values);
      message.success('更新成功');
      setIsEditing(false);
      fetchConfig();
    } catch (error) {
      message.error('更新失败');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleVisualEdit = () => {
    setVisualEditorVisible(true);
  };

  const handleVisualEditCancel = () => {
    setVisualEditorVisible(false);
  };

  const handleVisualEditOk = () => {
    setVisualEditorVisible(false);
  };

  return (
    <>
      {isEditing && <ImageUploader />}
      <Card
        title="侧边栏配置"
        extra={
          !isEditing && (
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => setIsEditing(true)}
            >
              编辑
            </Button>
          )
        }
      >
        {isEditing ? (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            disabled={loading}
            initialValues={config || undefined}
          >
            <Form.Item
              label="头像"
              name="avatar"
              rules={[{ required: true, message: '请输入头像路径' }]}
              extra="可以使用右上角的图片上传工具获取图片路径"
            >
              <Input placeholder="请输入头像路径" />
            </Form.Item>

            <Form.Item
              label="名称"
              name="name"
              rules={[{ required: true, message: '请输入名称' }]}
            >
              <Input placeholder="请输入名称" />
            </Form.Item>

            <Form.Item
              label="个人简介"
              name="bio"
              rules={[{ required: true, message: '请输入个人简介' }]}
            >
              <Input.TextArea rows={3} placeholder="请输入个人简介" />
            </Form.Item>

            <Form.Item
              label="在线状态"
              name="online"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              label="状态文本"
              name="statusText"
              rules={[{ required: true, message: '请输入状态文本' }]}
            >
              <Input placeholder="请输入状态文本" />
            </Form.Item>

            <Form.Item
              label={
                <Space>
                  公告列表
                  <Button
                    type="link"
                    icon={<EyeOutlined />}
                    onClick={handleVisualEdit}
                    size="small"
                  >
                    可视化编辑
                  </Button>
                </Space>
              }
              name="announcements"
              rules={[
                { required: true, message: '请添加至少一条公告' },
                {
                  validator: async (_, value) => {
                    if (value) {
                      try {
                        const announcements = JSON.parse(value);
                        if (!Array.isArray(announcements) || announcements.length === 0) {
                          throw new Error('公告列表格式不正确');
                        }
                      } catch (error) {
                        throw new Error('公告列表格式不正确');
                      }
                    }
                  },
                },
              ]}
            >
              <Input.TextArea
                rows={10}
                placeholder="请输入 JSON 格式的公告列表"
              />
            </Form.Item>

            <Form.Item
              label="联系邮箱"
              name="email"
              rules={[
                { required: true, message: '请输入联系邮箱' },
                { type: 'email', message: '请输入有效的邮箱地址' },
              ]}
            >
              <Input placeholder="请输入联系邮箱" />
            </Form.Item>

            <Form.Item
              label="显示天气"
              name="showWeather"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" loading={submitting}>
                  保存
                </Button>
                <Button onClick={handleCancel}>
                  取消
                </Button>
              </Space>
            </Form.Item>
          </Form>
        ) : (
          <div>
            <p><strong>名称：</strong>{config?.name || '-'}</p>
            <p><strong>个人简介：</strong>{config?.bio || '-'}</p>
            <p><strong>在线状态：</strong>{config?.online ? '在线' : '离线'}</p>
            <p><strong>状态文本：</strong>{config?.statusText || '-'}</p>
            <p><strong>联系邮箱：</strong>{config?.email || '-'}</p>
            <p><strong>显示天气：</strong>{config?.showWeather ? '是' : '否'}</p>
            <p><strong>头像：</strong>{config?.avatar || '-'}</p>
            <p><strong>公告列表：</strong></p>
            {config?.announcements ? (
              <AnnouncementList announcements={config.announcements} />
            ) : '-'}
          </div>
        )}
      </Card>

      <Modal
        title="可视化编辑公告"
        open={visualEditorVisible}
        onCancel={handleVisualEditCancel}
        onOk={handleVisualEditOk}
        width={800}
        destroyOnClose
      >
        <AnnouncementEditor
          value={form.getFieldValue('announcements')}
          onChange={(value) => form.setFieldValue('announcements', value)}
        />
      </Modal>
    </>
  );
};

export default SidebarConfig; 