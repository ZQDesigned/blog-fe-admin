import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, InputNumber, Switch, message, Button, Space } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { AboutSection, AboutSectionType, createAboutSection, updateAboutSection } from '../../services/about';
import ContentEditor from '../../components/About/ContentEditor';

interface AboutSectionFormProps {
  visible: boolean;
  section: AboutSection | null;
  onCancel: () => void;
  onSuccess: () => void;
  nextSortOrder?: number;
}

const AboutSectionForm: React.FC<AboutSectionFormProps> = ({
  visible,
  section,
  onCancel,
  onSuccess,
  nextSortOrder = 0,
}) => {
  const [form] = Form.useForm();
  const [visualEditorVisible, setVisualEditorVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      if (section) {
        form.setFieldsValue(section);
      } else {
        form.resetFields();
        form.setFieldsValue({ 
          enabled: true, 
          sortOrder: nextSortOrder 
        });
      }
    }
  }, [visible, section, form, nextSortOrder]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (section) {
        await updateAboutSection(section.id!, values);
        message.success('更新成功');
      } else {
        await createAboutSection(values);
        message.success('创建成功');
      }
      onSuccess();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleVisualEdit = () => {
    setVisualEditorVisible(true);
  };

  const handleVisualEditCancel = () => {
    setVisualEditorVisible(false);
  };

  const handleVisualEditOk = () => {
    setVisualEditorVisible(false);
  };

  const getContentTypeLabel = (type: AboutSectionType) => {
    const typeMap: Record<AboutSectionType, string> = {
      profile: '个人简介',
      skills: '技能特长',
      journey: '成长历程',
      contact: '联系方式',
      custom: '自定义内容',
    };
    return typeMap[type] || type;
  };

  return (
    <>
      <Modal
        title={section ? '编辑区块' : '添加区块'}
        open={visible}
        onCancel={onCancel}
        onOk={handleSubmit}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="type"
            label="类型"
            rules={[{ required: true, message: '请选择区块类型' }]}
          >
            <Select>
              <Select.Option value="profile">个人简介</Select.Option>
              <Select.Option value="skills">技能特长</Select.Option>
              <Select.Option value="journey">成长历程</Select.Option>
              <Select.Option value="contact">联系方式</Select.Option>
              <Select.Option value="custom">自定义</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={
              <Space>
                内容
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={handleVisualEdit}
                  size="small"
                >
                  可视化编辑
                </Button>
              </Space>
            }
            name="content"
            rules={[
              { required: true, message: '请输入内容' },
              {
                validator: async (_, value) => {
                  if (value) {
                    try {
                      JSON.parse(value);
                    } catch (error) {
                      throw new Error('内容必须是有效的 JSON 格式');
                    }
                  }
                },
              },
            ]}
            dependencies={['type']}
          >
            <Input.TextArea rows={6} placeholder="请输入 JSON 格式的内容" />
          </Form.Item>

          <Form.Item
            name="sortOrder"
            label="排序"
            rules={[{ required: true, message: '请输入排序号' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="enabled"
            label="启用状态"
            valuePropName="checked"
          >
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`编辑${getContentTypeLabel(form.getFieldValue('type'))}内容`}
        open={visualEditorVisible}
        onCancel={handleVisualEditCancel}
        onOk={handleVisualEditOk}
        width={800}
        destroyOnClose
      >
        <ContentEditor
          type={form.getFieldValue('type')}
          value={form.getFieldValue('content')}
          onChange={(value) => form.setFieldValue('content', value)}
        />
      </Modal>
    </>
  );
};

export default AboutSectionForm; 