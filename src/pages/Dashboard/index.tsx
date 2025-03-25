import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Spin, message } from 'antd';
import { Line, Column, Pie } from '@ant-design/charts';
import styled from '@emotion/styled';
import { statsService, DashboardStats } from '../../services/stats';

const Container = styled.div`
  background: #fff;
  padding: 24px;
  border-radius: 4px;
`;

const ChartCard = styled(Card)`
  margin-bottom: 24px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
`;

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await statsService.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('获取统计数据失败:', error);
        message.error('获取统计数据失败');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading || !stats) {
    return (
      <Container>
        <LoadingContainer>
          <Spin size="large" />
        </LoadingContainer>
      </Container>
    );
  }

  const visitConfig = {
    data: stats.visitTrend,
    xField: 'date',
    yField: 'value',
    point: {
      size: 5,
      shape: 'diamond',
    },
    label: {
      style: {
        fill: '#aaa',
      },
    },
  };

  const categoryConfig = {
    data: stats.categoryStats,
    xField: 'category',
    yField: 'value',
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
  };

  const projectConfig = {
    data: stats.projectStats,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
    },
  };

  return (
    <Container>
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic title="文章总数" value={stats.totalArticles} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="项目总数" value={stats.totalProjects} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="分类总数" value={stats.totalCategories} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="标签总数" value={stats.totalTags} />
          </Card>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={24}>
          <ChartCard title="访问量趋势">
            <Line {...visitConfig} />
          </ChartCard>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={12}>
          <ChartCard title="文章分类统计">
            <Column {...categoryConfig} />
          </ChartCard>
        </Col>
        <Col span={12}>
          <ChartCard title="项目状态分布">
            <Pie {...projectConfig} />
          </ChartCard>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard; 