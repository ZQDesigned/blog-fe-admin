import React from 'react';
import { Form, Input, Button, Upload, Space } from 'antd';
import { UploadOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';

const StyledForm = styled(Form)`
  .ant-form-item {
    margin-bottom: 16px;
  }
`;

const StyledUpload = styled(Upload)`
  .ant-upload-list {
    margin-top: 8px;
  }
`;

interface Education {
  school: string;
  degree: string;
  major: string;
  time?: string;
}

interface ProfileContent {
  avatar?: string;
  bio: string;
  education: Education[];
  location: string;
  highlights: string[];
}

interface ProfileFormProps {
  value?: ProfileContent;
  onChange?: (value: ProfileContent) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ value, onChange }) => {
  const [form] = Form.useForm();

  const initialValues = value || {
    avatar: '',
    bio: '',
    education: [
      {
        school: '',
        degree: '',
        major: '',
        time: ''
      }
    ],
    location: '',
    highlights: ['']
  };

  const handleValuesChange = () => {
    const values = form.getFieldsValue();
    onChange?.(values);
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <StyledForm
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onValuesChange={handleValuesChange}
    >
      <Form.Item
        label="头像"
        name="avatar"
        extra="可选，上传头像图片"
      >
        <Input placeholder="头像URL" />
      </Form.Item>

      <Form.Item
        label="个人简介"
        name="bio"
        rules={[{ required: true, message: '请输入个人简介' }]}
      >
        <Input.TextArea rows={4} placeholder="请输入个人简介" />
      </Form.Item>

      <Form.Item
        label="所在地"
        name="location"
        rules={[{ required: true, message: '请输入所在地' }]}
      >
        <Input placeholder="请输入所在地" />
      </Form.Item>

      <Form.Item label="教育背景">
        <Form.List name="education">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <div key={field.key} style={{ marginBottom: 16, padding: 16, border: '1px dashed #d9d9d9', borderRadius: 4 }}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Form.Item
                      {...field}
                      name={[field.name, 'school']}
                      label="学校名称"
                      rules={[{ required: true, message: '请输入学校名称' }]}
                    >
                      <Input placeholder="请输入学校名称" />
                    </Form.Item>
                    
                    <Form.Item
                      {...field}
                      name={[field.name, 'degree']}
                      label="学位"
                      rules={[{ required: true, message: '请输入学位' }]}
                    >
                      <Input placeholder="请输入学位" />
                    </Form.Item>
                    
                    <Form.Item
                      {...field}
                      name={[field.name, 'major']}
                      label="专业"
                      rules={[{ required: true, message: '请输入专业' }]}
                    >
                      <Input placeholder="请输入专业" />
                    </Form.Item>
                    
                    <Form.Item
                      {...field}
                      name={[field.name, 'time']}
                      label="学习时间段"
                    >
                      <Input placeholder="如：2019-2023" />
                    </Form.Item>
                    
                    {fields.length > 1 && (
                      <Button 
                        type="link" 
                        danger 
                        icon={<MinusCircleOutlined />} 
                        onClick={() => remove(field.name)}
                      >
                        删除
                      </Button>
                    )}
                  </Space>
                </div>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  添加教育背景
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form.Item>

      <Form.Item label="个人亮点">
        <Form.List name="highlights">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <div key={field.key} style={{ display: 'flex', marginBottom: 8 }}>
                  <Form.Item
                    {...field}
                    name={[field.name]}
                    rules={[{ required: true, message: '请输入个人亮点' }]}
                    style={{ flex: 1, marginRight: 8, marginBottom: 0 }}
                  >
                    <Input placeholder="请输入个人亮点" />
                  </Form.Item>
                  {fields.length > 1 && (
                    <MinusCircleOutlined
                      className="dynamic-delete-button"
                      onClick={() => remove(field.name)}
                    />
                  )}
                </div>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  添加个人亮点
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form.Item>
    </StyledForm>
  );
};

export default ProfileForm; 