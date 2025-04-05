import React, { useEffect, useState } from 'react';
import { Card, Form, Input, Button, message, Descriptions } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { getWebsiteMeta, updateWebsiteMeta, WebsiteMeta as IWebsiteMeta } from '../../services/home';

const WebsiteMeta: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [metaData, setMetaData] = useState<IWebsiteMeta | null>(null);
  const [form] = Form.useForm();

  const fetchMeta = async () => {
    setLoading(true);
    try {
      const response = await getWebsiteMeta();
      setMetaData(response);
      if (isEditing) {
        form.setFieldsValue(response);
      }
    } catch (error) {
      message.error('获取网站元数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeta();
  }, []);

  useEffect(() => {
    if (isEditing && metaData) {
      form.setFieldsValue(metaData);
    }
  }, [isEditing, metaData]);

  const handleSubmit = async (values: Omit<IWebsiteMeta, 'id' | 'createTime' | 'updateTime'>) => {
    setSubmitting(true);
    try {
      await updateWebsiteMeta(values);
      message.success('更新成功');
      setIsEditing(false);
      fetchMeta();
    } catch (error) {
      message.error('更新失败');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <Card
      title="网站元数据"
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
          initialValues={metaData || undefined}
        >
          <Form.Item
            label="网站标题"
            name="title"
            rules={[{ required: true, message: '请输入网站标题' }]}
          >
            <Input placeholder="请输入网站标题" />
          </Form.Item>

          <Form.Item
            label="网站描述"
            name="description"
            rules={[{ required: true, message: '请输入网站描述' }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="请输入网站描述"
            />
          </Form.Item>

          <Form.Item
            label="关键词"
            name="keywords"
            rules={[{ required: true, message: '请输入关键词' }]}
            extra="多个关键词请用英文逗号分隔"
          >
            <Input placeholder="请输入关键词，多个关键词用英文逗号分隔" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={submitting} style={{ marginRight: 8 }}>
              保存
            </Button>
            <Button onClick={handleCancel}>
              取消
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <Descriptions column={1} loading={loading}>
          <Descriptions.Item label="网站标题">{metaData?.title || '-'}</Descriptions.Item>
          <Descriptions.Item label="网站描述">{metaData?.description || '-'}</Descriptions.Item>
          <Descriptions.Item label="关键词">{metaData?.keywords || '-'}</Descriptions.Item>
        </Descriptions>
      )}
    </Card>
  );
};

export default WebsiteMeta; 