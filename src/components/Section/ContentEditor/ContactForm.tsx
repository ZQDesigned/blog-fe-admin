import React from 'react';
import { Form, Input, Button, Select } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { getSectionContentTemplate } from '../../../utils/section';

interface ContactFormProps {
  value?: any[];
  onChange?: (value: any[]) => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ value, onChange }) => {
  const [form] = Form.useForm();

  const initialValues = { contacts: value || getSectionContentTemplate('contact') };

  const handleValuesChange = () => {
    const values = form.getFieldsValue();
    onChange?.(values.contacts);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onValuesChange={handleValuesChange}
    >
      <Form.List name="contacts">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field, index) => (
              <div key={field.key} style={{ display: 'flex', marginBottom: 24 }}>
                <div style={{ flex: 1, marginRight: 8 }}>
                  <Form.Item
                    {...field}
                    label={`联系方式 ${index + 1}`}
                    required={false}
                    style={{ marginBottom: 0 }}
                  >
                    <Input.Group compact>
                      <Form.Item
                        name={[field.name, 'type']}
                        validateTrigger={['onChange', 'onBlur']}
                        rules={[
                          { required: true, message: '请选择类型' },
                        ]}
                        style={{ marginBottom: 8 }}
                      >
                        <Select style={{ width: '100%' }} placeholder="类型">
                          <Select.Option value="Email">邮箱</Select.Option>
                          <Select.Option value="Phone">电话</Select.Option>
                          <Select.Option value="GitHub">GitHub</Select.Option>
                          <Select.Option value="LinkedIn">LinkedIn</Select.Option>
                          <Select.Option value="Twitter">Twitter</Select.Option>
                          <Select.Option value="WeChat">微信</Select.Option>
                          <Select.Option value="Other">其他</Select.Option>
                        </Select>
                      </Form.Item>
                      <Form.Item
                        name={[field.name, 'icon']}
                        validateTrigger={['onChange', 'onBlur']}
                        rules={[
                          { required: true, whitespace: true, message: '请输入图标' },
                        ]}
                        style={{ marginBottom: 8 }}
                      >
                        <Input placeholder="图标" />
                      </Form.Item>
                      <Form.Item
                        name={[field.name, 'value']}
                        validateTrigger={['onChange', 'onBlur']}
                        rules={[
                          { required: true, whitespace: true, message: '请输入值' },
                        ]}
                        style={{ marginBottom: 8 }}
                      >
                        <Input placeholder="值" />
                      </Form.Item>
                      <Form.Item
                        name={[field.name, 'link']}
                        validateTrigger={['onChange', 'onBlur']}
                        style={{ marginBottom: 8 }}
                      >
                        <Input placeholder="链接（可选）" />
                      </Form.Item>
                    </Input.Group>
                  </Form.Item>
                </div>
                <MinusCircleOutlined
                  className="dynamic-delete-button"
                  style={{ marginTop: 40 }}
                  onClick={() => remove(field.name)}
                />
              </div>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                添加联系方式
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </Form>
  );
};

export default ContactForm;
