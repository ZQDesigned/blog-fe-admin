import React, { useState } from 'react';
import { Form, Input, Select, InputNumber, Switch, Button, Space, Modal } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { Section } from '../../services/home';
import ContentEditor from './ContentEditor';

interface SectionFormProps {
  initialValues?: Section;
  onSubmit: (values: Omit<Section, 'id' | 'createTime' | 'updateTime'>) => void;
  onCancel?: () => void;
  loading?: boolean;
}

const SectionForm: React.FC<SectionFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  loading,
}) => {
  const [form] = Form.useForm();
  const [visualEditorVisible, setVisualEditorVisible] = useState(false);

  const handleTypeChange = (type: Section['type']) => {
    form.setFieldValue('content', '');
  };

  const handleSubmit = (values: any) => {
    onSubmit(values);
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

  const getContentTypeLabel = (type: Section['type']) => {
    const typeMap: Record<Section['type'], string> = {
      banner: '横幅',
      features: '特性',
      skills: '技能',
      timeline: '时间线',
      contact: '联系方式',
    };
    return typeMap[type] || type;
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        enabled: true,
        sortOrder: 0,
        ...initialValues,
      }}
    >
      <Form.Item
        label="区块类型"
        name="type"
        rules={[{ required: true, message: '请选择区块类型' }]}
      >
        <Select onChange={handleTypeChange}>
          <Select.Option value="banner">横幅</Select.Option>
          <Select.Option value="features">特性</Select.Option>
          <Select.Option value="skills">技能</Select.Option>
          <Select.Option value="timeline">时间线</Select.Option>
          <Select.Option value="contact">联系方式</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="标题"
        name="title"
        rules={[{ required: true, message: '请输入标题' }]}
      >
        <Input placeholder="请输入标题" />
      </Form.Item>

      <Form.Item
        label="描述"
        name="description"
        rules={[{ required: true, message: '请输入描述' }]}
      >
        <Input.TextArea rows={4} placeholder="请输入描述" />
      </Form.Item>

      <Form.Item
        label={
          <Space>
            内容
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={handleVisualEdit}
              size="small"
            >
              可视化编辑
            </Button>
          </Space>
        }
        name="content"
        rules={[
          { required: true, message: '请输入内容' },
          {
            validator: async (_, value) => {
              if (value) {
                try {
                  JSON.parse(value);
                } catch (error) {
                  throw new Error('内容必须是有效的 JSON 格式');
                }
              }
            },
          },
        ]}
        dependencies={['type']}
      >
        <Input.TextArea rows={10} placeholder="请输入 JSON 格式的内容" />
      </Form.Item>

      <Form.Item
        label="排序"
        name="sortOrder"
        rules={[{ required: true, message: '请输入排序值' }]}
      >
        <InputNumber min={0} placeholder="请输入排序值" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        label="状态"
        name="enabled"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading}>
            保存
          </Button>
          {onCancel && (
            <Button onClick={onCancel}>
              取消
            </Button>
          )}
        </Space>
      </Form.Item>

      <Modal
        title={`编辑${getContentTypeLabel(form.getFieldValue('type'))}内容`}
        open={visualEditorVisible}
        onCancel={handleVisualEditCancel}
        onOk={handleVisualEditOk}
        okText="确认"
        cancelText="取消"
        width={800}
        destroyOnClose
      >
        <ContentEditor
          type={form.getFieldValue('type')}
          value={form.getFieldValue('content')}
          onChange={(value) => form.setFieldValue('content', value)}
        />
      </Modal>
    </Form>
  );
};

export default SectionForm;
