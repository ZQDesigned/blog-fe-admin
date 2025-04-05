import { Section } from '../services/home';

export const formatSectionContent = (section: Section) => {
  try {
    return JSON.parse(section.content);
  } catch (error) {
    console.error('解析区块内容失败:', error);
    return null;
  }
};

export const stringifySectionContent = (content: any) => {
  try {
    return JSON.stringify(content);
  } catch (error) {
    console.error('序列化区块内容失败:', error);
    return '';
  }
};

export const getSectionContentTemplate = (type: Section['type']) => {
  switch (type) {
    case 'banner':
      return {
        subtitle: '',
        backgroundImage: '',
        buttons: [
          {
            text: '',
            link: '',
            type: 'default',
            icon: '',
          },
        ],
      };
    case 'features':
      return [
        {
          icon: '',
          title: '',
          description: '',
          link: '',
        },
      ];
    case 'skills':
      return [
        {
          name: '',
          items: [
            {
              name: '',
              icon: '',
              level: 0,
              description: ''
            },
          ],
        },
      ];
    case 'timeline':
      return [
        {
          date: '',
          title: '',
          description: '',
          icon: '',
          color: '',
        },
      ];
    case 'contact':
      return [
        {
          type: '',
          icon: '',
          value: '',
          link: '',
        },
      ];
    default:
      return null;
  }
};
