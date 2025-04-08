import React, { useEffect, useState } from 'react';
import { Card, message, Tree, Button, Tag, Space } from 'antd';
import { HolderOutlined, SaveOutlined, UndoOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { AboutSection, getAllAboutSections, updateAboutSectionSort } from '../../services/about';
import type { DataNode, TreeProps } from 'antd/es/tree';

const Container = styled.div`
  padding: 24px;
`;

const StyledTree = styled(Tree)`
  .ant-tree-treenode {
    padding: 8px 0;
    width: 100%;
    
    &:hover {
      background-color: #f5f5f5;
    }
  }
  
  .ant-tree-node-content-wrapper {
    flex: 1;
    width: calc(100% - 40px);
  }
  
  .section-item {
    display: flex;
    align-items: center;
    padding: 12px;
    border: 1px solid #f0f0f0;
    border-radius: 4px;
    background: white;
    cursor: grab;
    transition: all 0.3s;
    
    &:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
    }
  }
  
  .section-info {
    flex: 1;
    margin-left: 10px;
  }
  
  .section-title {
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    margin-bottom: 4px;
    display: flex;
    align-items: center;
  }
  
  .section-description {
    color: rgba(0, 0, 0, 0.45);
    font-size: 12px;
    margin-bottom: 4px;
  }

  .section-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.45);
  }
  
  .drag-handle {
    color: #999;
    cursor: grab;
    margin-right: 8px;
  }

  .type-tag {
    margin-left: 8px;
  }
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
  gap: 12px;
`;

// 定义包含必要 ID 的 Section 类型
interface SectionWithId extends AboutSection {
  id: number;
}

// 获取区块类型对应的中文名称和标签颜色
const getSectionTypeInfo = (type: AboutSection['type']) => {
  const typeMap: Record<AboutSection['type'], { label: string; color: string }> = {
    'profile': { label: '个人简介', color: '#1890ff' },
    'skills': { label: '技能特长', color: '#52c41a' },
    'journey': { label: '成长历程', color: '#722ed1' },
    'contact': { label: '联系方式', color: '#faad14' },
    'custom': { label: '自定义', color: '#f5222d' }
  };
  
  return typeMap[type] || { label: type, color: '#d9d9d9' };
};

const AboutSectionSort: React.FC = () => {
  const [sections, setSections] = useState<SectionWithId[]>([]);
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isDataChanged, setIsDataChanged] = useState(false);
  // 保存原始区块排序，用于重置更改
  const [originalSections, setOriginalSections] = useState<SectionWithId[]>([]);

  // 将区块数据转换为树节点数据
  const convertSectionsToTreeData = (sections: SectionWithId[]): DataNode[] => {
    return sections.map((section, index) => {
      const typeInfo = getSectionTypeInfo(section.type);
      
      return {
        key: `${section.id}`,
        title: (
          <div className="section-item">
            <HolderOutlined className="drag-handle" />
            <div className="section-info">
              <div className="section-title">
                {section.title}
                <Tag color={typeInfo.color} className="type-tag">{typeInfo.label}</Tag>
                {!section.enabled && <Tag color="red" className="type-tag">已禁用</Tag>}
              </div>
              <div className="section-description">{section.description}</div>
              <div className="section-meta">
                <span>ID: {section.id}</span>
                <span>排序: {section.sortOrder}</span>
              </div>
            </div>
          </div>
        ),
        data: section
      };
    });
  };

  const fetchSections = async () => {
    setLoading(true);
    try {
      const response = await getAllAboutSections();
      // 过滤掉没有 id 的区块，并按 sortOrder 排序
      const filteredSections = response.filter((section): section is SectionWithId =>
        typeof section.id === 'number' && section.id !== undefined
      );

      const sortedSections = [...filteredSections].sort(
        (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)
      );

      setSections(sortedSections);
      // 保存原始排序
      setOriginalSections([...sortedSections]);
      setTreeData(convertSectionsToTreeData(sortedSections));
      setIsDataChanged(false);
    } catch (error) {
      message.error('获取区块列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  // 处理拖拽结束事件
  const onDrop: TreeProps['onDrop'] = (info) => {
    const dropKey = info.node.key as string;
    const dragKey = info.dragNode.key as string;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const data = [...treeData];

    // 查找被拖拽的项
    let dragObj: DataNode;
    const loop = (data: DataNode[], key: string, callback: (item: DataNode, index: number, arr: DataNode[]) => void) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          callback(data[i], i, data);
          return;
        }
      }
    };

    // 找到拖拽项并移除
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (dropPosition === 0) {
      // 插入到目标节点后面
      loop(data, dropKey, (_, index, arr) => {
        arr.splice(index + 1, 0, dragObj);
      });
    } else {
      // 插入到目标节点的指定位置
      const insertIndex = info.dropPosition;
      data.splice(insertIndex, 0, dragObj);
    }

    setTreeData(data);
    setIsDataChanged(true);
  };

  // 丢弃更改，恢复到原始排序
  const handleDiscardChanges = () => {
    // 恢复到原始排序
    setSections([...originalSections]);
    setTreeData(convertSectionsToTreeData([...originalSections]));
    setIsDataChanged(false);
    message.info('已恢复到原始排序');
  };

  // 保存排序
  const handleSave = async () => {
    setSaving(true);
    try {
      // 从树形数据中提取区块ID数组，按照当前顺序排列
      const sectionIds = treeData.map(node => Number(node.key));
      
      // 调用更新排序接口
      await updateAboutSectionSort(sectionIds);
      
      message.success('保存成功');
      setIsDataChanged(false);
      
      // 刷新数据以显示最新的排序结果
      fetchSections();
    } catch (error) {
      message.error('保存失败');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container>
      {isDataChanged && (
        <ActionBar>
          <Button
            icon={<UndoOutlined />}
            onClick={handleDiscardChanges}
          >
            丢弃更改
          </Button>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSave}
            loading={saving}
          >
            保存排序
          </Button>
        </ActionBar>
      )}

      <Card title="区块排序" loading={loading}>
        <StyledTree
          draggable
          blockNode
          showLine={false}
          treeData={treeData}
          onDrop={onDrop}
        />

        {sections.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '20px 0', color: 'rgba(0,0,0,0.45)' }}>
            暂无区块数据
          </div>
        )}
      </Card>
    </Container>
  );
};

export default AboutSectionSort; 