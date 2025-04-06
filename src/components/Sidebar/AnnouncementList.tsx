import React from 'react';
import { List, Tag } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
import { Announcement } from '../../services/sidebar';

interface AnnouncementListProps {
  announcements: string;
}

const AnnouncementList: React.FC<AnnouncementListProps> = ({ announcements }) => {
  const items = JSON.parse(announcements) as Announcement[];

  return (
    <List
      itemLayout="horizontal"
      dataSource={items}
      renderItem={(item) => (
        <List.Item>
          <List.Item.Meta
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>{item.title}</span>
                <Tag color={item.type === 'link' ? 'blue' : 'default'}>
                  {item.type === 'link' ? (
                    <><LinkOutlined /> 链接</>
                  ) : '文本'}
                </Tag>
              </div>
            }
            description={
              item.type === 'link' ? (
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  {item.content}
                </a>
              ) : (
                item.content
              )
            }
          />
        </List.Item>
      )}
    />
  );
};

export default AnnouncementList; 