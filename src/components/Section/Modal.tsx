import React from 'react';
import { Modal } from 'antd';
import { Section } from '../../services/home';
import Form from './Form';

interface SectionModalProps {
  open: boolean;
  title: string;
  initialValues?: Section;
  onSubmit: (values: Omit<Section, 'id' | 'createTime' | 'updateTime'>) => void;
  onCancel: () => void;
  confirmLoading?: boolean;
}

const SectionModal: React.FC<SectionModalProps> = ({
  open,
  title,
  initialValues,
  onSubmit,
  onCancel,
  confirmLoading,
}) => {
  return (
    <Modal
      open={open}
      title={title}
      onCancel={onCancel}
      footer={null}
      width={800}
      destroyOnClose
    >
      <Form
        initialValues={initialValues}
        onSubmit={onSubmit}
        loading={confirmLoading}
      />
    </Modal>
  );
};

export default SectionModal; 