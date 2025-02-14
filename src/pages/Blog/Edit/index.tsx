import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, Space, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import styled from '@emotion/styled';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import ReactMarkdown from 'react-markdown';
import { blogService } from '../../../services/blog';
import { categoryService, Category } from '../../../services/category';
import { tagService, Tag } from '../../../services/tag';

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

const BlogEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [content, setContent] = useState('');

  const isEdit = !!id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, tagsData] = await Promise.all([
          categoryService.getList(),
          tagService.getList(),
        ]);
        setCategories(categoriesData);
        setTags(tagsData);

        if (isEdit) {
          const blog = await blogService.getDetail(Number(id));
          form.setFieldsValue({
            title: blog.title,
            categoryId: blog.categoryId,
            tagIds: blog.tagIds,
            summary: blog.summary,
          });
          setContent(blog.content);
        }
      } catch (error) {
        console.error('获取数据失败:', error);
        message.error('获取数据失败');
      }
    };

    fetchData();
  }, [form, id, isEdit]);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const data = {
        ...values,
        content,
      };

      if (isEdit) {
        await blogService.update(Number(id), data);
        message.success('更新成功');
      } else {
        await blogService.create(data);
        message.success('发布成功');
      }
      navigate('/blog/list');
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

  return (
    <Container>
      <HeaderContainer>
        <Title>{isEdit ? '编辑文章' : '发布文章'}</Title>
      </HeaderContainer>
      <StyledForm
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ categoryId: undefined, tagIds: [] }}
      >
        <Form.Item
          name="title"
          label="标题"
          rules={[{ required: true, message: '请输入文章标题' }]}
        >
          <Input placeholder="请输入文章标题" />
        </Form.Item>

        <Form.Item
          name="categoryId"
          label="分类"
          rules={[{ required: true, message: '请选择文章分类' }]}
        >
          <Select placeholder="请选择文章分类">
            {categories.map((category) => (
              <Select.Option key={category.id} value={category.id}>
                {category.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="tagIds"
          label="标签"
          rules={[{ required: true, message: '请选择文章标签' }]}
        >
          <Select mode="multiple" placeholder="请选择文章标签">
            {tags.map((tag) => (
              <Select.Option key={tag.id} value={tag.id}>
                {tag.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="summary"
          label="摘要"
          rules={[{ required: true, message: '请输入文章摘要' }]}
        >
          <Input.TextArea rows={4} placeholder="请输入文章摘要" />
        </Form.Item>

        <Form.Item label="内容" required>
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
              {isEdit ? '更新' : '发布'}
            </Button>
            <Button onClick={() => navigate('/blog/list')}>取消</Button>
          </Space>
        </Form.Item>
      </StyledForm>
    </Container>
  );
};

export default BlogEdit; 