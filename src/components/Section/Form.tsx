import React, { useEffect } from 'react';
import { Form, Input, Select, InputNumber, Switch, Button, Space } from 'antd';
import { Section } from '../../services/home';
import { getSectionContentTemplate, stringifySectionContent } from '../../utils/section';

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

  useEffect(() => {
    if (initialValues) {
      const formData = {
        ...initialValues,
        content: typeof initialValues.content === 'string'
          ? JSON.stringify(JSON.parse(initialValues.content), null, 2)
          : JSON.stringify(initialValues.content, null, 2),
      };
      form.setFieldsValue(formData);
    }
  }, [initialValues, form]);

  const handleTypeChange = (type: Section['type']) => {
    const template = getSectionContentTemplate(type);
    if (template) {
      form.setFieldValue('content', JSON.stringify(template, null, 2));
    }
  };

  const handleSubmit = (values: any) => {
    try {
      // 验证 content 是否为有效的 JSON
      const content = JSON.parse(values.content);
      onSubmit({
        ...values,
        content: stringifySectionContent(content),
      });
    } catch (error) {
      console.error('内容格式错误:', error);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        enabled: true,
        sortOrder: 0,
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
        label="内容"
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
    </Form>
  );
};

export default SectionForm; 