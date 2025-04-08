import React from 'react';
import { Form, Input, Button, Space } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';

const StyledForm = styled(Form)`
  .ant-form-item {
    margin-bottom: 16px;
  }
`;

interface SkillCategory {
  name: string;
  items: string[];
}

interface SkillsContent {
  categories: SkillCategory[];
}

interface SkillsFormProps {
  value?: SkillsContent;
  onChange?: (value: SkillsContent) => void;
}

const SkillsForm: React.FC<SkillsFormProps> = ({ value, onChange }) => {
  const [form] = Form.useForm();

  const initialValues = value || {
    categories: [
      {
        name: '',
        items: ['']
      }
    ]
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
      <Form.List name="categories">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field, index) => (
              <div key={field.key} style={{ marginBottom: 24, padding: 16, border: '1px dashed #d9d9d9', borderRadius: 4 }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Form.Item
                    {...field}
                    name={[field.name, 'name']}
                    label="分类名称"
                    rules={[{ required: true, message: '请输入分类名称' }]}
                  >
                    <Input placeholder="请输入分类名称" />
                  </Form.Item>

                  <Form.Item label="技能列表">
                    <Form.List name={[field.name, 'items']}>
                      {(itemFields, { add: addItem, remove: removeItem }) => (
                        <>
                          {itemFields.map((itemField, itemIndex) => (
                            <div key={itemField.key} style={{ display: 'flex', marginBottom: 8 }}>
                              <Form.Item
                                {...itemField}
                                name={[itemField.name]}
                                rules={[{ required: true, message: '请输入技能名称' }]}
                                style={{ flex: 1, marginRight: 8, marginBottom: 0 }}
                              >
                                <Input placeholder="请输入技能名称" />
                              </Form.Item>
                              {itemFields.length > 1 && (
                                <MinusCircleOutlined
                                  className="dynamic-delete-button"
                                  onClick={() => removeItem(itemField.name)}
                                />
                              )}
                            </div>
                          ))}
                          <Form.Item>
                            <Button type="dashed" onClick={() => addItem('')} block icon={<PlusOutlined />}>
                              添加技能
                            </Button>
                          </Form.Item>
                        </>
                      )}
                    </Form.List>
                  </Form.Item>

                  {fields.length > 1 && (
                    <Button 
                      type="link" 
                      danger 
                      icon={<MinusCircleOutlined />} 
                      onClick={() => remove(field.name)}
                    >
                      删除此分类
                    </Button>
                  )}
                </Space>
              </div>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                添加技能分类
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </StyledForm>
  );
};

export default SkillsForm; 