import React from 'react';
import { Form, Input, Button, InputNumber } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { getSectionContentTemplate } from '../../../utils/section';

interface SkillsFormProps {
  value?: any[];
  onChange?: (value: any[]) => void;
}

const SkillsForm: React.FC<SkillsFormProps> = ({ value, onChange }) => {
  const [form] = Form.useForm();

  const initialValues = { skills: value || getSectionContentTemplate('skills') };

  const handleValuesChange = () => {
    const values = form.getFieldsValue();
    onChange?.(values.skills);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onValuesChange={handleValuesChange}
    >
      <Form.List name="skills">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field, index) => (
              <div key={field.key} style={{ marginBottom: 24 }}>
                <Form.Item
                  {...field}
                  label={`技能分类 ${index + 1}`}
                  required={false}
                  style={{ marginBottom: 8 }}
                >
                  <Input.Group compact>
                    <Form.Item
                      name={[field.name, 'name']}
                      validateTrigger={['onChange', 'onBlur']}
                      rules={[
                        { required: true, whitespace: true, message: '请输入分类名称' },
                      ]}
                      style={{ marginBottom: 8 }}
                    >
                      <Input placeholder="分类名称" />
                    </Form.Item>

                    <Form.List name={[field.name, 'items']}>
                      {(itemFields, { add: addItem, remove: removeItem }) => (
                        <>
                          {itemFields.map((itemField, itemIndex) => (
                            <div key={itemField.key} style={{ display: 'flex', marginBottom: 8 }}>
                              <div style={{ flex: 1, marginRight: 8 }}>
                                <Form.Item
                                  {...itemField}
                                  label={`技能项 ${itemIndex + 1}`}
                                  required={false}
                                  style={{ marginBottom: 0 }}
                                >
                                  <Input.Group compact>
                                    <Form.Item
                                      name={[itemField.name, 'name']}
                                      validateTrigger={['onChange', 'onBlur']}
                                      rules={[
                                        { required: true, whitespace: true, message: '请输入技能名称' },
                                      ]}
                                      noStyle
                                    >
                                      <Input style={{ width: '30%' }} placeholder="技能名称" />
                                    </Form.Item>
                                    <Form.Item
                                      name={[itemField.name, 'icon']}
                                      validateTrigger={['onChange', 'onBlur']}
                                      rules={[
                                        { required: true, whitespace: true, message: '请输入图标' },
                                      ]}
                                      noStyle
                                    >
                                      <Input style={{ width: '25%' }} placeholder="图标" />
                                    </Form.Item>
                                    <Form.Item
                                      name={[itemField.name, 'level']}
                                      validateTrigger={['onChange', 'onBlur']}
                                      rules={[
                                        { required: true, message: '请输入熟练度' },
                                      ]}
                                      noStyle
                                    >
                                      <InputNumber
                                        style={{ width: '20%' }}
                                        min={0}
                                        max={100}
                                        placeholder="熟练度"
                                      />
                                    </Form.Item>
                                    <Form.Item
                                      name={[itemField.name, 'description']}
                                      validateTrigger={['onChange', 'onBlur']}
                                      noStyle
                                    >
                                      <Input style={{ width: '25%' }} placeholder="描述（可选）" />
                                    </Form.Item>
                                  </Input.Group>
                                </Form.Item>
                              </div>
                              <MinusCircleOutlined
                                className="dynamic-delete-button"
                                onClick={() => removeItem(itemField.name)}
                              />
                            </div>
                          ))}
                          <Form.Item>
                            <Button
                              type="dashed"
                              onClick={() => addItem()}
                              block
                              icon={<PlusOutlined />}
                            >
                              添加技能项
                            </Button>
                          </Form.Item>
                        </>
                      )}
                    </Form.List>
                  </Input.Group>
                </Form.Item>
                <Button
                  type="link"
                  danger
                  icon={<MinusCircleOutlined />}
                  onClick={() => remove(field.name)}
                >
                  删除此分类
                </Button>
              </div>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                添加技能分类
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </Form>
  );
};

export default SkillsForm; 