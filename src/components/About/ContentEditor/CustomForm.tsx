import React from 'react';
import { Form, Input, Button, Select, Space } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';

const StyledForm = styled(Form)`
  .ant-form-item {
    margin-bottom: 16px;
  }
`;

interface CustomItem {
  title?: string;
  description: string;
  icon?: string;
  imageUrl?: string;
  link?: string;
}

interface CustomContent {
  description: string;
  blockType: 'text' | 'list' | 'cards';
  items?: CustomItem[];
}

interface CustomFormProps {
  value?: CustomContent;
  onChange?: (value: CustomContent) => void;
}

const blockTypes = [
  { label: '文本', value: 'text' },
  { label: '列表', value: 'list' },
  { label: '卡片', value: 'cards' }
];

const CustomForm: React.FC<CustomFormProps> = ({ value, onChange }) => {
  const [form] = Form.useForm();

  const initialValues = value || {
    description: '',
    blockType: 'text',
    items: []
  };

  const handleValuesChange = () => {
    const values = form.getFieldsValue();
    onChange?.(values);
  };

  return (
    <StyledForm
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onValuesChange={handleValuesChange}
    >
      <Form.Item
        name="description"
        label="描述"
        rules={[{ required: true, message: '请输入描述' }]}
      >
        <Input.TextArea rows={4} placeholder="请输入描述" />
      </Form.Item>

      <Form.Item
        name="blockType"
        label="区块类型"
        rules={[{ required: true, message: '请选择区块类型' }]}
      >
        <Select placeholder="选择区块类型">
          {blockTypes.map(type => (
            <Select.Option key={type.value} value={type.value}>
              {type.label}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        noStyle
        shouldUpdate={(prevValues, curValues) => {
          return prevValues.blockType !== curValues.blockType;
        }}
      >
        {({ getFieldValue }) => {
          const blockType = getFieldValue('blockType');
          if (blockType === 'text') {
            return null;
          }

          return (
            <Form.List name="items">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field, index) => (
                    <div key={field.key} style={{ marginBottom: 24, padding: 16, border: '1px dashed #d9d9d9', borderRadius: 4 }}>
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'title']}
                          label="标题"
                        >
                          <Input placeholder="标题（可选）" />
                        </Form.Item>

                        <Form.Item
                          {...field}
                          name={[field.name, 'description']}
                          label="描述"
                          rules={[{ required: true, message: '请输入描述' }]}
                        >
                          <Input.TextArea rows={3} placeholder="请输入描述" />
                        </Form.Item>

                        <Form.Item
                          {...field}
                          name={[field.name, 'icon']}
                          label="图标"
                          extra="请输入 @ant-design/icons 中的图标名称，如 MailOutlined"
                        >
                          <Input placeholder="图标名称（可选）" />
                        </Form.Item>

                        {blockType === 'cards' && (
                          <Form.Item
                            {...field}
                            name={[field.name, 'imageUrl']}
                            label="图片"
                          >
                            <Input placeholder="图片URL（可选）" />
                          </Form.Item>
                        )}

                        <Form.Item
                          {...field}
                          name={[field.name, 'link']}
                          label="链接"
                        >
                          <Input placeholder="链接（可选）" />
                        </Form.Item>

                        {fields.length > 0 && (
                          <Button 
                            type="link" 
                            danger 
                            icon={<MinusCircleOutlined />} 
                            onClick={() => remove(field.name)}
                          >
                            删除此项目
                          </Button>
                        )}
                      </Space>
                    </div>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      添加{blockType === 'list' ? '列表项' : '卡片'}
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          );
        }}
      </Form.Item>
    </StyledForm>
  );
};

export default CustomForm; 