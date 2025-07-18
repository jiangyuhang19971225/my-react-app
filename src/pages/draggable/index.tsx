/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useNavigate } from 'react-router-dom';
import RulerCanvas from './components/RulerCanvas';
import DraggableComponent from './components/DraggableComponent';
import PropertyPanel from './components/PropertyPanel';
import PreviewCanvas from './components/PreviewCanvas';

interface ComponentItem {
  id: string;
  type: string;
  x: number;
  y: number;
  props: Record<string, any>;
}

const DraggablePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [components, setComponents] = useState<ComponentItem[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const handleSelectComponent = (id: string) => {
    setSelectedComponentId(id);
  };

  const handleUpdateComponent = (id: string, updates: Partial<ComponentItem>) => {
    setComponents((prev) => prev.map((comp) => (comp.id === id ? { ...comp, ...updates } : comp)));
  };

  const handleAddComponent = (component: ComponentItem) => {
    setComponents((prev) => [...prev, component]);
  };

  const handleCanvasClick = () => {
    setSelectedComponentId(null);
  };

  const handlePreview = () => {
    // 保存到localStorage作为备用
    localStorage.setItem('draggable-components', JSON.stringify(components));

    // 使用URL参数传递数据
    const dataParam = encodeURIComponent(JSON.stringify(components));
    navigate(`/draggable/preview?data=${dataParam}`);
  };

  const handleClearAll = () => {
    if (window.confirm('确定要清空所有组件吗？')) {
      setComponents([]);
      setSelectedComponentId(null);
    }
  };

  const selectedComponent = components.find((comp) => comp.id === selectedComponentId) || null;

  return (
    <div>
      {/* 顶部工具栏 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 0',
          borderBottom: '1px solid #e8e8e8',
          marginBottom: '16px',
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>🎨 拖拽页面设计器</h1>
          <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '14px' }}>
            拖拽组件到画布，点击组件进行配置，实时预览设计效果
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            style={{
              padding: '8px 16px',
              backgroundColor: '#f0f0f0',
              border: '1px solid #d9d9d9',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.2s',
            }}
            onClick={handleClearAll}
            disabled={components.length === 0}
          >
            🗑️ 清空
          </button>

          <button
            style={{
              padding: '8px 16px',
              backgroundColor: showPreview ? '#f0f0f0' : '#52c41a',
              color: showPreview ? '#333' : 'white',
              border: showPreview ? '1px solid #d9d9d9' : 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.2s',
            }}
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? '📝 编辑模式' : '👁️ 预览模式'}
          </button>

          <button
            style={{
              padding: '8px 16px',
              backgroundColor: '#1890ff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.2s',
            }}
            onClick={handlePreview}
            disabled={components.length === 0}
          >
            🚀 全屏预览
          </button>
        </div>
      </div>

      {showPreview ? (
        /* 预览模式 */
        <div style={{ height: '600px', border: '1px solid #e8e8e8', borderRadius: '8px' }}>
          <PreviewCanvas components={components} />
        </div>
      ) : (
        /* 编辑模式 */
        <DndProvider backend={HTML5Backend}>
          <div style={{ display: 'flex', gap: '16px' }}>
            {/* 组件库 */}
            <div
              style={{
                width: 200,
                borderRight: '1px solid #e8e8e8',
                padding: 16,
                backgroundColor: '#fafafa',
                borderRadius: '8px',
              }}
            >
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>
                📦 组件库
              </h3>
              <DraggableComponent type="input" name="📝 输入框" />
              <DraggableComponent type="button" name="🔘 按钮" />
              <DraggableComponent type="chart" name="📊 图表" />
            </div>

            {/* 画布区域 */}
            <div
              style={{
                flex: 1,
                padding: 16,
                position: 'relative',
                minHeight: '700px',
              }}
              onClick={handleCanvasClick}
            >
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>
                🎯 设计画布
              </h3>
              <RulerCanvas
                components={components}
                selectedComponentId={selectedComponentId}
                onSelectComponent={handleSelectComponent}
                onUpdateComponent={handleUpdateComponent}
                onAddComponent={handleAddComponent}
              />
            </div>

            {/* 属性面板 */}
            <div
              style={{
                width: 280,
                borderLeft: '1px solid #e8e8e8',
                backgroundColor: '#fafafa',
                padding: 16,
                borderRadius: '8px',
              }}
            >
              <PropertyPanel
                selectedComponent={selectedComponent}
                onUpdateComponent={handleUpdateComponent}
              />
            </div>
          </div>
        </DndProvider>
      )}

      {/* 状态信息 */}
      <div
        style={{
          marginTop: '20px',
          padding: '16px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #e9ecef',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '24px' }}>
            <span style={{ fontSize: '14px', color: '#666' }}>
              📊 组件总数: <strong>{components.length}</strong>
            </span>
            <span style={{ fontSize: '14px', color: '#666' }}>
              🎯 选中组件: <strong>{selectedComponent?.type || '无'}</strong>
            </span>
          </div>
          <div style={{ fontSize: '12px', color: '#999' }}>提示: 双击组件可快速编辑属性</div>
        </div>
      </div>
    </div>
  );
};

export default DraggablePage;
