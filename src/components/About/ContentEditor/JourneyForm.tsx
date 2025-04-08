import React from 'react';
import { Form, Input, Button, DatePicker, Space } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import dayjs from 'dayjs';

const StyledForm = styled(Form)`
  .ant-form-item {
    margin-bottom: 16px;
  }
`;

interface Milestone {
  date: string;
  title: string;
  description: string;
}

interface JourneyContent {
  description: string[];
  milestones?: Milestone[];
}

interface JourneyFormProps {
  value?: JourneyContent;
  onChange?: (value: JourneyContent) => void;
}

const JourneyForm: React.FC<JourneyFormProps> = ({ value, onChange }) => {
  const [form] = Form.useForm();

  const initialValues = value ? {
    description: value.description || [''],
    milestones: value.milestones?.map(milestone => ({
      ...milestone,
      year: milestone.date ? dayjs(milestone.date) : dayjs()
    })) || []
  } : {
    description: [''],
    milestones: []
  };

  const handleValuesChange = () => {
    const values = form.getFieldsValue();
    const formattedValues = {
      description: values.description,
      milestones: values.milestones?.map((milestone: any) => ({
        ...milestone,
        year: milestone.date ? milestone.date.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD')
      }))
    };
    onChange?.(formattedValues);
  };

  return (
    <StyledForm
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onValuesChange={handleValuesChange}
    >
      <Form.Item label="旅程描述">
        <Form.List name="description">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <div key={field.key} style={{ marginBottom: 16 }}>
                  <Space align="baseline">
                    <Form.Item
                      {...field}
                      rules={[{ required: true, message: '请输入描述文本' }]}
                      style={{ marginBottom: 0, flex: 1 }}
                    >
                      <Input.TextArea rows={2} placeholder="请输入描述文本" />
                    </Form.Item>
                    {fields.length > 1 && (
                      <MinusCircleOutlined
                        className="dynamic-delete-button"
                        onClick={() => remove(field.name)}
                      />
                    )}
                  </Space>
                </div>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add('')} block icon={<PlusOutlined />}>
                  添加描述
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form.Item>

      <Form.Item label="里程碑事件">
        <Form.List name="milestones">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <div key={field.key} style={{ marginBottom: 24, padding: 16, border: '1px dashed #d9d9d9', borderRadius: 4 }}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Form.Item
                      {...field}
                      name={[field.name, 'year']}
                      label="日期"
                      rules={[{ required: true, message: '请选择日期' }]}
                    >
                      <DatePicker style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                      {...field}
                      name={[field.name, 'title']}
                      label="标题"
                      rules={[{ required: true, message: '请输入标题' }]}
                    >
                      <Input placeholder="请输入标题" />
                    </Form.Item>

                    <Form.Item
                      {...field}
                      name={[field.name, 'description']}
                      label="描述"
                      rules={[{ required: true, message: '请输入描述' }]}
                    >
                      <Input.TextArea rows={3} placeholder="请输入描述" />
                    </Form.Item>

                    <Button
                      type="link"
                      danger
                      icon={<MinusCircleOutlined />}
                      onClick={() => remove(field.name)}
                    >
                      删除此里程碑
                    </Button>
                  </Space>
                </div>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  添加里程碑
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form.Item>
    </StyledForm>
  );
};

export default JourneyForm;
