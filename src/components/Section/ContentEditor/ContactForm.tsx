import React from 'react';
import { Form, Input, Button, Select } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { getSectionContentTemplate } from '../../../utils/section';
import styled from '@emotion/styled';

const StyledInputGroup = styled(Input.Group)`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  .ant-form-item {
    margin-bottom: 8px;
    flex: 1 1 auto;
  }

  .type-select {
    min-width: 120px;
    width: 120px;
  }

  .icon-input {
    min-width: 100px;
    width: 100px;
  }

  .value-input {
    min-width: 200px;
    flex-grow: 2;
  }

  .link-input {
    min-width: 200px;
    flex-grow: 1;
  }
`;

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
                    <StyledInputGroup>
                      <Form.Item
                        name={[field.name, 'type']}
                        validateTrigger={['onChange', 'onBlur']}
                        rules={[
                          { required: true, message: '请选择类型' },
                        ]}
                      >
                        <Select className="type-select" placeholder="类型">
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
                      >
                        <Input className="icon-input" placeholder="图标" />
                      </Form.Item>
                      <Form.Item
                        name={[field.name, 'value']}
                        validateTrigger={['onChange', 'onBlur']}
                        rules={[
                          { required: true, whitespace: true, message: '请输入值' },
                        ]}
                      >
                        <Input className="value-input" placeholder="值" />
                      </Form.Item>
                      <Form.Item
                        name={[field.name, 'link']}
                        validateTrigger={['onChange', 'onBlur']}
                      >
                        <Input className="link-input" placeholder="链接（可选）" />
                      </Form.Item>
                    </StyledInputGroup>
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
