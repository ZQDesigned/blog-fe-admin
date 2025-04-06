import React from 'react';
import { Form, Input, Button, ColorPicker } from 'antd';
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

  .time-input {
    min-width: 120px;
    width: 120px;
  }

  .title-input {
    min-width: 200px;
    flex-grow: 2;
  }

  .description-input {
    width: 100%;
  }

  .icon-input {
    min-width: 100px;
    width: 100px;
  }

  .color-picker {
    min-width: 100px;
    width: 100px;
  }
`;

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
                    label={`时间线项目 ${index + 1}`}
                    required={false}
                    style={{ marginBottom: 0 }}
                  >
                    <StyledInputGroup>
                      <Form.Item
                        name={[field.name, 'date']}
                        validateTrigger={['onChange', 'onBlur']}
                        rules={[
                          { required: true, whitespace: true, message: '请输入时间' },
                        ]}
                      >
                        <Input className="time-input" placeholder="时间" />
                      </Form.Item>
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
                        name={[field.name, 'description']}
                        validateTrigger={['onChange', 'onBlur']}
                        rules={[
                          { required: true, whitespace: true, message: '请输入描述' },
                        ]}
                      >
                        <Input.TextArea className="description-input" placeholder="描述" rows={2} />
                      </Form.Item>
                      <Form.Item
                        name={[field.name, 'icon']}
                        validateTrigger={['onChange', 'onBlur']}
                      >
                        <Input className="icon-input" placeholder="图标（可选）" />
                      </Form.Item>
                      <Form.Item
                        name={[field.name, 'color']}
                        validateTrigger={['onChange', 'onBlur']}
                        rules={[
                          { required: true, message: '请选择颜色' },
                        ]}
                        getValueFromEvent={(color) => {
                          return color.toHexString();
                        }}
                      >
                        <ColorPicker
                          className="color-picker"
                          showText
                          format="hex"
                        />
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
                添加时间线项目
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </Form>
  );
};

export default TimelineForm; 