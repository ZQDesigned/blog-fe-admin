import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, Space, message, Upload } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { UploadOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import ReactMarkdown from 'react-markdown';
import { projectService } from '../../../services/project';
import { config } from '../../../config';

const Container = styled.div`
  background: #fff;
  padding: 24px;
  border-radius: 4px;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h2`
  margin: 0;
  color: rgba(0, 0, 0, 0.85);
`;

const StyledForm = styled(Form)`
  .editor-container {
    margin-bottom: 24px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
  }
`;

const ProjectImage = styled.img`
  max-width: 200px;
  height: auto;
  border-radius: 4px;
  margin-bottom: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

const ProjectEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');

  const isEdit = !!id;

  useEffect(() => {
    const fetchData = async () => {
      if (!isEdit) return;

      try {
        const project = await projectService.getDetail(Number(id));
        form.setFieldsValue({
          title: project.title,
          description: project.description,
          github: {
            url: project.github.url,
            disabled: project.github.disabled,
            disabledReason: project.github.disabledReason,
          },
          demo: {
            url: project.demo.url,
            disabled: project.demo.disabled,
            disabledReason: project.demo.disabledReason,
          },
          status: project.status,
          features: project.features,
          techStack: project.techStack,
        });
        setContent(project.content);
        if (project.imageUrl) {
          setImageUrl(`${config.endpoint}${project.imageUrl}`);
        }
      } catch (error) {
        console.error('获取项目详情失败:', error);
        message.error('获取项目详情失败');
      }
    };

    fetchData();
  }, [form, id, isEdit]);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('content', content);
      formData.append('github', JSON.stringify(values.github));
      formData.append('demo', JSON.stringify(values.demo));
      formData.append('status', values.status);
      formData.append('features', JSON.stringify(values.features));
      formData.append('techStack', JSON.stringify(values.techStack));
      
      if (imageFile) {
        formData.append('image', imageFile);
      }

      if (isEdit) {
        await projectService.update(Number(id), formData);
        message.success('更新成功');
      } else {
        await projectService.create(formData);
        message.success('创建成功');
      }
      navigate('/project/list');
    } catch (error) {
      console.error('提交失败:', error);
      message.error('提交失败');
    } finally {
      setLoading(false);
    }
  };

  const handleEditorChange = ({ text }: { text: string }) => {
    setContent(text);
  };

  const handleImageChange = (info: any) => {
    if (info.file.status === 'done') {
      setImageFile(info.file.originFileObj);
      setImageUrl(URL.createObjectURL(info.file.originFileObj));
    }
  };

  return (
    <Container>
      <HeaderContainer>
        <Title>{isEdit ? '编辑项目' : '创建项目'}</Title>
      </HeaderContainer>
      <StyledForm
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          status: 'developing',
          features: [],
          techStack: [],
          github: {
            url: '',
            disabled: false,
            disabledReason: '',
          },
          demo: {
            url: '',
            disabled: false,
            disabledReason: '',
          },
        }}
      >
        <Form.Item
          name="title"
          label="项目名称"
          rules={[{ required: true, message: '请输入项目名称' }]}
        >
          <Input placeholder="请输入项目名称" />
        </Form.Item>

        <Form.Item
          name="description"
          label="项目描述"
          rules={[{ required: true, message: '请输入项目描述' }]}
        >
          <Input.TextArea rows={4} placeholder="请输入项目描述" />
        </Form.Item>

        <Form.Item
          label="项目图片"
          required
          tooltip="支持 jpg、jpeg、png、gif 格式，大小不超过 2MB"
        >
          <Upload
            accept="image/*"
            maxCount={1}
            showUploadList={false}
            customRequest={({ onSuccess }) => {
              if (onSuccess) {
                onSuccess({});
              }
            }}
            onChange={handleImageChange}
          >
            {imageUrl ? (
              <div style={{ marginBottom: 8 }}>
                <ProjectImage src={imageUrl} alt="项目图片" />
              </div>
            ) : null}
            <Button icon={<UploadOutlined />}>{imageUrl ? '更换图片' : '上传图片'}</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          name={['github', 'url']}
          label="GitHub 地址"
          rules={[{ required: true, message: '请输入 GitHub 地址' }]}
        >
          <Input placeholder="请输入 GitHub 地址" />
        </Form.Item>

        <Form.Item
          name={['github', 'disabled']}
          label="禁用源码按钮"
        >
          <Select>
            <Select.Option value={false}>否</Select.Option>
            <Select.Option value={true}>是</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.github?.disabled !== currentValues.github?.disabled
          }
        >
          {({ getFieldValue }) =>
            getFieldValue(['github', 'disabled']) ? (
              <Form.Item
                name={['github', 'disabledReason']}
                label="源码按钮禁用原因"
                rules={[{ required: true, message: '请输入源码按钮禁用原因' }]}
              >
                <Input placeholder="请输入源码按钮禁用原因" />
              </Form.Item>
            ) : null
          }
        </Form.Item>

        <Form.Item
          name={['demo', 'url']}
          label="演示地址"
          rules={[{ required: true, message: '请输入演示地址' }]}
        >
          <Input placeholder="请输入演示地址" />
        </Form.Item>

        <Form.Item
          name={['demo', 'disabled']}
          label="禁用演示按钮"
        >
          <Select>
            <Select.Option value={false}>否</Select.Option>
            <Select.Option value={true}>是</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.demo?.disabled !== currentValues.demo?.disabled
          }
        >
          {({ getFieldValue }) =>
            getFieldValue(['demo', 'disabled']) ? (
              <Form.Item
                name={['demo', 'disabledReason']}
                label="演示按钮禁用原因"
                rules={[{ required: true, message: '请输入演示按钮禁用原因' }]}
              >
                <Input placeholder="请输入演示按钮禁用原因" />
              </Form.Item>
            ) : null
          }
        </Form.Item>

        <Form.Item
          name="status"
          label="项目状态"
          rules={[{ required: true, message: '请选择项目状态' }]}
        >
          <Select>
            <Select.Option value="developing">开发中</Select.Option>
            <Select.Option value="maintaining">维护中</Select.Option>
            <Select.Option value="paused">暂停维护</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="features"
          label="项目特性"
          rules={[{ required: true, message: '请输入项目特性' }]}
        >
          <Select mode="tags" placeholder="请输入项目特性，按回车键添加">
            <Select.Option value="feature1">特性1</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="techStack"
          label="技术栈"
          rules={[{ required: true, message: '请输入技术栈' }]}
        >
          <Select mode="tags" placeholder="请输入技术栈，按回车键添加">
            <Select.Option value="tech1">技术1</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="项目详细介绍" required>
          <div className="editor-container">
            <MdEditor
              value={content}
              renderHTML={(text) => <ReactMarkdown>{text}</ReactMarkdown>}
              onChange={handleEditorChange}
              style={{ height: '500px' }}
            />
          </div>
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              {isEdit ? '更新' : '创建'}
            </Button>
            <Button onClick={() => navigate('/project/list')}>取消</Button>
          </Space>
        </Form.Item>
      </StyledForm>
    </Container>
  );
};

export default ProjectEdit;
