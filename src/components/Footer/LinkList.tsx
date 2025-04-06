import React from 'react';
import { List, Tag } from 'antd';
import * as Icons from '@ant-design/icons';
import { FooterLink } from '../../services/footer';

interface LinkListProps {
  links: string;
}

const LinkList: React.FC<LinkListProps> = ({ links }) => {
  const items = JSON.parse(links) as FooterLink[];

  return (
    <List
      itemLayout="horizontal"
      dataSource={items}
      renderItem={(item) => {
        const IconComponent = (Icons as any)[item.icon];
        return (
          <List.Item>
            <List.Item.Meta
              avatar={IconComponent && <IconComponent />}
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>{item.title}</span>
                  {item.isExternal && (
                    <Tag color="blue">外链</Tag>
                  )}
                </div>
              }
              description={
                <a
                  href={item.url}
                  target={item.isExternal ? '_blank' : '_self'}
                  rel={item.isExternal ? 'noopener noreferrer' : undefined}
                >
                  {item.url}
                </a>
              }
            />
          </List.Item>
        );
      }}
    />
  );
};

export default LinkList; 