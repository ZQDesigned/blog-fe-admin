import React from 'react';
import { Form, Input, Select, Switch, Button } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { FooterLink } from '../../services/footer';
import * as Icons from '@ant-design/icons';

const StyledInputGroup = styled(Input.Group)`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  .ant-form-item {
    margin-bottom: 8px;
    flex: 1 1 auto;
  }

  .title-input {
    min-width: 150px;
    flex-grow: 1;
  }

  .url-input {
    min-width: 250px;
    flex-grow: 2;
  }

  .icon-select {
    min-width: 180px;
    width: 180px;
  }
`;

interface LinkEditorProps {
  value?: string;
  onChange?: (value: string) => void;
}

// 获取所有可用的图标
const iconList = Object.keys(Icons)
  .filter(key => key.endsWith('Outlined'))
  .map(key => ({
    label: key.replace('Outlined', ''),
    value: key,
    icon: React.createElement((Icons as any)[key])
  }));

const LinkEditor: React.FC<LinkEditorProps> = ({ value, onChange }) => {
  const [form] = Form.useForm();

  const initialLinks = value ? JSON.parse(value) as FooterLink[] : [];

  const handleValuesChange = () => {
    const values = form.getFieldsValue();
    onChange?.(JSON.stringify(values.links));
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{ links: initialLinks }}
      onValuesChange={handleValuesChange}
    >
      <Form.List name="links">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field, index) => (
              <div key={field.key} style={{ display: 'flex', marginBottom: 24 }}>
                <div style={{ flex: 1, marginRight: 8 }}>
                  <Form.Item
                    {...field}
                    label={`链接 ${index + 1}`}
                    required={false}
                    style={{ marginBottom: 0 }}
                  >
                    <StyledInputGroup>
                      <Form.Item
                        name={[field.name, 'title']}
                        validateTrigger={['onChange', 'onBlur']}
                        rules={[
                          { required: true, whitespace: true, message: '请输入标题' },
                        ]}
                      >
                        <Input className="title-input" placeholder="标题" />
                      </Form.Item>
                      <Form.Item
                        name={[field.name, 'url']}
                        validateTrigger={['onChange', 'onBlur']}
                        rules={[
                          { required: true, whitespace: true, message: '请输入链接' },
                        ]}
                      >
                        <Input className="url-input" placeholder="链接地址" />
                      </Form.Item>
                      <Form.Item
                        name={[field.name, 'icon']}
                        validateTrigger={['onChange', 'onBlur']}
                      >
                        <Select
                          className="icon-select"
                          placeholder="选择图标（可选）"
                          showSearch
                          optionFilterProp="label"
                          allowClear
                        >
                          {iconList.map(icon => (
                            <Select.Option key={icon.value} value={icon.value}>
                              {icon.icon} {icon.label}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                      <Form.Item
                        name={[field.name, 'isExternal']}
                        valuePropName="checked"
                        initialValue={false}
                      >
                        <Switch checkedChildren="外链" unCheckedChildren="内链" />
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
                添加链接
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </Form>
  );
};

export default LinkEditor; 