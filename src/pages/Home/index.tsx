import React from 'react';
import { Space } from 'antd';
import SectionList from './SectionList';
import WebsiteMeta from './WebsiteMeta';

const HomePage: React.FC = () => {
  return (
    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
      <WebsiteMeta />
      <SectionList />
    </Space>
  );
};

export default HomePage; 