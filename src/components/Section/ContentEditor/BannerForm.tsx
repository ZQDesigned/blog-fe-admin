import React from 'react';
import { Form, Input, Button, Select } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { getSectionContentTemplate } from '../../../utils/section';

interface BannerFormProps {
  value?: any;
  onChange?: (value: any) => void;
}

const BannerForm: React.FC<BannerFormProps> = ({ value, onChange }) => {
  const [form] = Form.useForm();

  const initialValues = value || getSectionContentTemplate('banner');

  const handleValuesChange = () => {
    const values = form.getFieldsValue();
    onChange?.(values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onValuesChange={handleValuesChange}
    >
      <Form.Item
        label="副标题"
        name="subtitle"
        rules={[{ required: true, message: '请输入副标题' }]}
      >
        <Input placeholder="请输入副标题" />
      </Form.Item>

      <Form.Item
        label="背景图片"
        name="backgroundImage"
        rules={[{ required: true, message: '请输入背景图片 URL' }]}
      >
        <Input placeholder="请输入背景图片 URL" />
      </Form.Item>

      <Form.List name="buttons">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field, index) => (
              <div key={field.key} style={{ display: 'flex', marginBottom: 8 }}>
                <div style={{ flex: 1, marginRight: 8 }}>
                  <Form.Item
                    {...field}
                    label={`按钮 ${index + 1}`}
                    required={false}
                    style={{ marginBottom: 0 }}
                  >
                    <Input.Group compact>
                      <Form.Item
                        name={[field.name, 'text']}
                        validateTrigger={['onChange', 'onBlur']}
                        rules={[
                          { required: true, whitespace: true, message: '请输入按钮文本' },
                        ]}
                        noStyle
                      >
                        <Input style={{ width: '30%' }} placeholder="按钮文本" />
                      </Form.Item>
                      <Form.Item
                        name={[field.name, 'link']}
                        validateTrigger={['onChange', 'onBlur']}
                        rules={[
                          { required: true, whitespace: true, message: '请输入链接' },
                        ]}
                        noStyle
                      >
                        <Input style={{ width: '30%' }} placeholder="链接" />
                      </Form.Item>
                      <Form.Item
                        name={[field.name, 'type']}
                        noStyle
                      >
                        <Select style={{ width: '20%' }} placeholder="类型">
                          <Select.Option value="default">默认</Select.Option>
                          <Select.Option value="primary">主要</Select.Option>
                          <Select.Option value="link">链接</Select.Option>
                        </Select>
                      </Form.Item>
                      <Form.Item
                        name={[field.name, 'icon']}
                        noStyle
                      >
                        <Input style={{ width: '20%' }} placeholder="图标" />
                      </Form.Item>
                    </Input.Group>
                  </Form.Item>
                </div>
                {fields.length > 1 && (
                  <MinusCircleOutlined
                    className="dynamic-delete-button"
                    onClick={() => remove(field.name)}
                  />
                )}
              </div>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                添加按钮
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </Form>
  );
};

export default BannerForm; 