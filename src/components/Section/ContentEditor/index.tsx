import React from 'react';
import { Section } from '../../../services/home';
import BannerForm from './BannerForm';
import FeaturesForm from './FeaturesForm';
import SkillsForm from './SkillsForm';
import TimelineForm from './TimelineForm';
import ContactForm from './ContactForm';

interface ContentEditorProps {
  type: Section['type'];
  value?: string;
  onChange?: (value: string) => void;
}

const ContentEditor: React.FC<ContentEditorProps> = ({
  type,
  value,
  onChange,
}) => {
  const handleVisualChange = (content: any) => {
    onChange?.(JSON.stringify(content, null, 2));
  };

  const content = value ? JSON.parse(value) : undefined;

  switch (type) {
    case 'banner':
      return <BannerForm value={content} onChange={handleVisualChange} />;
    case 'features':
      return <FeaturesForm value={content} onChange={handleVisualChange} />;
    case 'skills':
      return <SkillsForm value={content} onChange={handleVisualChange} />;
    case 'timeline':
      return <TimelineForm value={content} onChange={handleVisualChange} />;
    case 'contact':
      return <ContactForm value={content} onChange={handleVisualChange} />;
    default:
      return null;
  }
};

export default ContentEditor; 