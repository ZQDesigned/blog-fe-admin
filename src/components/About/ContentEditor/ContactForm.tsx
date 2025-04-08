import React from 'react';
import { Form, Input, Button, Select, Space, Switch } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';

const StyledForm = styled(Form)`
  .ant-form-item {
    margin-bottom: 16px;
  }
`;

interface ContactItem {
  type: string;
  icon: string;
  value: string;
  link?: string;
  isQrCode?: boolean;
  qrCodeUrl?: string;
}

interface ContactContent {
  items: ContactItem[];
}

interface ContactFormProps {
  value?: ContactContent;
  onChange?: (value: ContactContent) => void;
}

const contactTypes = [
  { label: '邮箱', value: 'email' },
  { label: '电话', value: 'phone' },
  { label: '微信', value: 'wechat' },
  { label: 'QQ', value: 'qq' },
  { label: 'GitHub', value: 'github' },
  { label: '微博', value: 'weibo' },
  { label: '网站', value: 'website' },
  { label: '其他', value: 'other' }
];

const ContactForm: React.FC<ContactFormProps> = ({ value, onChange }) => {
  const [form] = Form.useForm();

  const initialValues = value || {
    items: [
      {
        type: 'email',
        icon: 'MailOutlined',
        value: '',
        link: '',
        isQrCode: false,
        qrCodeUrl: ''
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
      <Form.List name="items">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field, index) => (
              <div key={field.key} style={{ marginBottom: 24, padding: 16, border: '1px dashed #d9d9d9', borderRadius: 4 }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Form.Item
                    {...field}
                    name={[field.name, 'type']}
                    label="类型"
                    rules={[{ required: true, message: '请选择联系方式类型' }]}
                  >
                    <Select placeholder="选择类型">
                      {contactTypes.map(type => (
                        <Select.Option key={type.value} value={type.value}>
                          {type.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  
                  <Form.Item
                    {...field}
                    name={[field.name, 'icon']}
                    label="图标"
                    rules={[{ required: true, message: '请输入图标名称' }]}
                    extra="请输入 @ant-design/icons 中的图标名称，如 MailOutlined"
                  >
                    <Input placeholder="图标名称" />
                  </Form.Item>
                  
                  <Form.Item
                    {...field}
                    name={[field.name, 'value']}
                    label="值"
                    rules={[{ required: true, message: '请输入联系方式' }]}
                  >
                    <Input placeholder="联系方式" />
                  </Form.Item>
                  
                  <Form.Item
                    {...field}
                    name={[field.name, 'link']}
                    label="链接"
                  >
                    <Input placeholder="链接（可选）" />
                  </Form.Item>
                  
                  <Form.Item
                    {...field}
                    name={[field.name, 'isQrCode']}
                    label="显示为二维码"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                  
                  <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, curValues) => {
                      const prev = prevValues.items?.[field.name]?.isQrCode;
                      const curr = curValues.items?.[field.name]?.isQrCode;
                      return prev !== curr;
                    }}
                  >
                    {({ getFieldValue }) => {
                      const isQrCode = getFieldValue(['items', field.name, 'isQrCode']);
                      return isQrCode ? (
                        <Form.Item
                          {...field}
                          name={[field.name, 'qrCodeUrl']}
                          label="二维码图片"
                          rules={[{ required: true, message: '请输入二维码图片URL' }]}
                        >
                          <Input placeholder="二维码图片URL" />
                        </Form.Item>
                      ) : null;
                    }}
                  </Form.Item>
                  
                  {fields.length > 1 && (
                    <Button 
                      type="link" 
                      danger 
                      icon={<MinusCircleOutlined />} 
                      onClick={() => remove(field.name)}
                    >
                      删除此联系方式
                    </Button>
                  )}
                </Space>
              </div>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                添加联系方式
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </StyledForm>
  );
};

export default ContactForm; 