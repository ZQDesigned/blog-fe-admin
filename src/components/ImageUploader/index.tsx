import React, { useState, useRef, useEffect } from 'react';
import { Upload, Input, Space, Button, message, Dropdown, Tooltip } from 'antd';
import { UploadOutlined, CopyOutlined, DragOutlined, DownOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { uploadService } from '../../services/upload';
import type { UploadProps } from 'antd';
import type { MenuProps } from 'antd';

const Container = styled.div<{ $isDragging: boolean }>`
  position: fixed;
  width: 300px;
  background: #fff;
  padding: 16px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 100;
  cursor: ${props => props.$isDragging ? 'move' : 'default'};
  user-select: none;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  cursor: move;
`;

const Title = styled.h3`
  margin: 0;
  color: rgba(0, 0, 0, 0.85);
`;

const DragHandle = styled.div`
  color: #999;
  cursor: move;
  &:hover {
    color: #666;
  }
`;

const UrlContainer = styled.div`
  margin-top: 16px;
`;

const CopyButtonGroup = styled.div`
  display: flex;
  .ant-btn {
    width: 40px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .ant-btn:first-of-type {
    border-right: none;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  .ant-btn:last-of-type {
    width: 32px;
    border-left: 1px solid #d9d9d9;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
`;

const ImageUploader: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [position, setPosition] = useState({ x: window.innerWidth - 324, y: 88 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && containerRef.current) {
        const newX = Math.min(
          Math.max(0, e.clientX - dragOffset.x),
          window.innerWidth - containerRef.current.offsetWidth
        );
        const newY = Math.min(
          Math.max(0, e.clientY - dragOffset.y),
          window.innerHeight - containerRef.current.offsetHeight
        );
        setPosition({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsDragging(true);
    }
  };

  const uploadProps: UploadProps = {
    name: 'image',
    multiple: false,
    showUploadList: false,
    accept: 'image/*',
    customRequest: async (options) => {
      const { file, onSuccess, onError } = options;

      try {
        const response = await uploadService.uploadImage(file as File);
        const fullUrl = uploadService.getImageUrl(response.url);
        setImageUrl(fullUrl);
        message.success('上传成功');
        if (onSuccess) {
          onSuccess(response);
        }
      } catch (error) {
        console.error('上传失败:', error);
        message.error('上传失败');
        if (onError) {
          onError(new Error('上传失败'));
        }
      }
    },
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('只能上传图片文件！');
        return false;
      }

      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('图片大小不能超过 5MB！');
        return false;
      }

      return true;
    },
  };

  const handleCopyMarkdown = async () => {
    try {
      const markdownText = `![image](${imageUrl})`;
      await navigator.clipboard.writeText(markdownText);
      message.success('已复制 Markdown 格式的图片链接');
    } catch (error) {
      console.error('复制失败:', error);
      message.error('复制失败');
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(imageUrl);
      message.success('已复制图片链接');
    } catch (error) {
      console.error('复制失败:', error);
      message.error('复制失败');
    }
  };

  const copyMenuItems: MenuProps['items'] = [
    {
      key: 'url',
      label: '复制链接',
      icon: <CopyOutlined />,
      onClick: handleCopyUrl,
    },
  ];

  return (
    <Container
      ref={containerRef}
      style={{
        left: position.x,
        top: position.y,
      }}
      $isDragging={isDragging}
    >
      <Header onMouseDown={handleMouseDown}>
        <Title>图片上传</Title>
        <DragHandle>
          <DragOutlined />
        </DragHandle>
      </Header>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Upload.Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <UploadOutlined />
          </p>
          <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
          <p className="ant-upload-hint">
            支持单个图片上传，大小不超过 5MB
          </p>
        </Upload.Dragger>

        {imageUrl && (
          <UrlContainer>
            <Space.Compact style={{ width: '100%' }}>
              <Input value={imageUrl} readOnly />
              <CopyButtonGroup>
                <Tooltip title="复制为 Markdown 格式">
                  <Button icon={<CopyOutlined />} onClick={handleCopyMarkdown} />
                </Tooltip>
                <Tooltip title="更多复制选项">
                  <Dropdown menu={{ items: copyMenuItems }} placement="bottomRight">
                    <Button>
                      <DownOutlined />
                    </Button>
                  </Dropdown>
                </Tooltip>
              </CopyButtonGroup>
            </Space.Compact>
          </UrlContainer>
        )}
      </Space>
    </Container>
  );
};

export default ImageUploader;
