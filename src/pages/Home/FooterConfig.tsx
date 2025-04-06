import React, { useEffect, useState } from 'react';
import { Card, Form, Button, message } from 'antd';
import { getFooterConfig, updateFooterConfig, FooterConfig as IFooterConfig } from '../../services/footer';
import LinkEditor from '../../components/Footer/LinkEditor';
import LinkList from '../../components/Footer/LinkList';

const FooterConfig: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [config, setConfig] = useState<IFooterConfig | null>(null);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const response = await getFooterConfig();
      setConfig(response);
      if (isEditing) {
        form.setFieldsValue(response);
      }
    } catch (error) {
      message.error('获取页脚配置失败');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    form.setFieldsValue(config);
    setIsEditing(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsEditing(false);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await updateFooterConfig(values);
      message.success('更新成功');
      setIsEditing(false);
      fetchConfig();
    } catch (error) {
      message.error('更新失败');
    }
  };

  const extra = isEditing ? (
    <>
      <Button onClick={handleCancel} style={{ marginRight: 8 }}>
        取消
      </Button>
      <Button type="primary" onClick={handleSubmit}>
        保存
      </Button>
    </>
  ) : (
    <Button type="primary" onClick={handleEdit}>
      编辑
    </Button>
  );

  return (
    <Card title="页脚配置" extra={extra} loading={loading}>
      {isEditing ? (
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="links"
            label="链接列表"
            rules={[{ required: true, message: '请添加至少一个链接' }]}
          >
            <LinkEditor />
          </Form.Item>
        </Form>
      ) : (
        config?.links && <LinkList links={config.links} />
      )}
    </Card>
  );
};

export default FooterConfig; 