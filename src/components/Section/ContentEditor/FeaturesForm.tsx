import React from 'react';
import { Form, Input, Button } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { getSectionContentTemplate } from '../../../utils/section';

interface FeaturesFormProps {
  value?: any[];
  onChange?: (value: any[]) => void;
}

const FeaturesForm: React.FC<FeaturesFormProps> = ({ value, onChange }) => {
  const [form] = Form.useForm();

  const initialValues = { features: value || getSectionContentTemplate('features') };

  const handleValuesChange = () => {
    const values = form.getFieldsValue();
    onChange?.(values.features);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onValuesChange={handleValuesChange}
    >
      <Form.List name="features">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field, index) => (
              <div key={field.key} style={{ display: 'flex', marginBottom: 24 }}>
                <div style={{ flex: 1, marginRight: 8 }}>
                  <Form.Item
                    {...field}
                    label={`特性 ${index + 1}`}
                    required={false}
                    style={{ marginBottom: 0 }}
                  >
                    <Input.Group compact>
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
                        name={[field.name, 'title']}
                        validateTrigger={['onChange', 'onBlur']}
                        rules={[
                          { required: true, whitespace: true, message: '请输入标题' },
                        ]}
                        style={{ marginBottom: 8 }}
                      >
                        <Input placeholder="标题" />
                      </Form.Item>
                      <Form.Item
                        name={[field.name, 'description']}
                        validateTrigger={['onChange', 'onBlur']}
                        rules={[
                          { required: true, whitespace: true, message: '请输入描述' },
                        ]}
                        style={{ marginBottom: 8 }}
                      >
                        <Input.TextArea placeholder="描述" rows={2} />
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
                添加特性
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </Form>
  );
};

export default FeaturesForm; 