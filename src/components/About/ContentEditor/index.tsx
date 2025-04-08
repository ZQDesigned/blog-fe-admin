import React from 'react';
import { AboutSection } from '../../../services/about';
import ProfileForm from './ProfileForm';
import SkillsForm from './SkillsForm';
import JourneyForm from './JourneyForm';
import ContactForm from './ContactForm';
import CustomForm from './CustomForm';

interface ContentEditorProps {
  type: AboutSection['type'];
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
    case 'profile':
      return <ProfileForm value={content} onChange={handleVisualChange} />;
    case 'skills':
      return <SkillsForm value={content} onChange={handleVisualChange} />;
    case 'journey':
      return <JourneyForm value={content} onChange={handleVisualChange} />;
    case 'contact':
      return <ContactForm value={content} onChange={handleVisualChange} />;
    case 'custom':
      return <CustomForm value={content} onChange={handleVisualChange} />;
    default:
      return null;
  }
};

export default ContentEditor; 