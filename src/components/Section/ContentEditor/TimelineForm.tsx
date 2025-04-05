import React from 'react';
import { Form, Input, Button, DatePicker } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { getSectionContentTemplate } from '../../../utils/section';

interface TimelineFormProps {
  value?: any[];
  onChange?: (value: any[]) => void;
}

const TimelineForm: React.FC<TimelineFormProps> = ({ value, onChange }) => {
  const [form] = Form.useForm();

  const initialValues = { timeline: value || getSectionContentTemplate('timeline') };

  const handleValuesChange = () => {
    const values = form.getFieldsValue();
    onChange?.(values.timeline);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onValuesChange={handleValuesChange}
    >
      <Form.List name="timeline">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field, index) => (
              <div key={field.key} style={{ display: 'flex', marginBottom: 24 }}>
                <div style={{ flex: 1, marginRight: 8 }}>
                  <Form.Item
                    {...field}
                    label={`时间线项 ${index + 1}`}
                    required={false}
                    style={{ marginBottom: 0 }}
                  >
                    <Input.Group compact>
                      <Form.Item
                        name={[field.name, 'date']}
                        validateTrigger={['onChange', 'onBlur']}
                        rules={[
                          { required: true, whitespace: true, message: '请输入日期' },
                        ]}
                        style={{ marginBottom: 8 }}
                      >
                        <Input placeholder="日期" />
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
                        name={[field.name, 'icon']}
                        validateTrigger={['onChange', 'onBlur']}
                        style={{ marginBottom: 8 }}
                      >
                        <Input placeholder="图标（可选）" />
                      </Form.Item>
                      <Form.Item
                        name={[field.name, 'color']}
                        validateTrigger={['onChange', 'onBlur']}
                        style={{ marginBottom: 8 }}
                      >
                        <Input placeholder="颜色（可选）" />
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
                添加时间线项
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </Form>
  );
};

export default TimelineForm; 