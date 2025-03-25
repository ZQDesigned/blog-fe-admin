import React from 'react';
import { Spin } from 'antd';
import styled from '@emotion/styled';

const LoadingContainer = styled.div`
  width: 100%;
  height: 100%;
  min-height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PageLoading: React.FC = () => {
  return (
    <LoadingContainer>
      <Spin size="large" />
    </LoadingContainer>
  );
};

export default PageLoading; 