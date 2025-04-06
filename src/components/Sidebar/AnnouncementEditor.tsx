import React from 'react';
import { Form, Input, Select, Button } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { Announcement } from '../../services/sidebar';

const StyledInputGroup = styled(Input.Group)`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  .ant-form-item {
    margin-bottom: 8px;
    flex: 1 1 auto;
  }

  .title-input {
    min-width: 200px;
    flex-grow: 1;
  }

  .content-input {
    min-width: 300px;
    flex-grow: 2;
  }

  .type-select {
    min-width: 120px;
    width: 120px;
  }

  .link-input {
    min-width: 200px;
    flex-grow: 1;
  }
`;

interface AnnouncementEditorProps {
  value?: string;
  onChange?: (value: string) => void;
}

const AnnouncementEditor: React.FC<AnnouncementEditorProps> = ({ value, onChange }) => {
  const [form] = Form.useForm();

  const initialAnnouncements = value ? JSON.parse(value) as Announcement[] : [];

  const handleValuesChange = () => {
    const values = form.getFieldsValue();
    onChange?.(JSON.stringify(values.announcements));
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{ announcements: initialAnnouncements }}
      onValuesChange={handleValuesChange}
    >
      <Form.List name="announcements">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field, index) => (
              <div key={field.key} style={{ display: 'flex', marginBottom: 24 }}>
                <div style={{ flex: 1, marginRight: 8 }}>
                  <Form.Item
                    {...field}
                    label={`公告 ${index + 1}`}
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
                        name={[field.name, 'content']}
                        validateTrigger={['onChange', 'onBlur']}
                        rules={[
                          { required: true, whitespace: true, message: '请输入内容' },
                        ]}
                      >
                        <Input className="content-input" placeholder="内容" />
                      </Form.Item>
                      <Form.Item
                        name={[field.name, 'type']}
                        validateTrigger={['onChange', 'onBlur']}
                        rules={[
                          { required: true, message: '请选择类型' },
                        ]}
                      >
                        <Select className="type-select" placeholder="类型">
                          <Select.Option value="text">文本</Select.Option>
                          <Select.Option value="link">链接</Select.Option>
                        </Select>
                      </Form.Item>
                      <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, curValues) => {
                          const prev = prevValues.announcements?.[field.name]?.type;
                          const curr = curValues.announcements?.[field.name]?.type;
                          return prev !== curr;
                        }}
                      >
                        {({ getFieldValue }) => {
                          const type = getFieldValue(['announcements', field.name, 'type']);
                          return type === 'link' ? (
                            <Form.Item
                              name={[field.name, 'link']}
                              validateTrigger={['onChange', 'onBlur']}
                              rules={[
                                { required: true, whitespace: true, message: '请输入链接' },
                              ]}
                            >
                              <Input className="link-input" placeholder="链接" />
                            </Form.Item>
                          ) : null;
                        }}
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
                添加公告
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </Form>
  );
};

export default AnnouncementEditor; 