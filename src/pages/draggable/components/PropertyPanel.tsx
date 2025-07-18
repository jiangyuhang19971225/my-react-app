/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

interface ComponentItem {
  id: string;
  type: string;
  x: number;
  y: number;
  props: Record<string, any>;
}

interface PropertyPanelProps {
  selectedComponent: ComponentItem | null;
  onUpdateComponent: (id: string, updates: Partial<ComponentItem>) => void;
}

const PropertyPanel: React.FC<PropertyPanelProps> = ({ selectedComponent, onUpdateComponent }) => {
  if (!selectedComponent) {
    return (
      <div style={{ padding: '16px', backgroundColor: '#f5f5f5', minHeight: '400px' }}>
        <h3>属性面板</h3>
        <p style={{ color: '#999' }}>请选择一个组件来编辑其属性</p>
      </div>
    );
  }

  const handlePropChange = (propName: string, value: any) => {
    onUpdateComponent(selectedComponent.id, {
      props: { ...selectedComponent.props, [propName]: value },
    });
  };

  const renderInputProps = () => (
    <div>
      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', marginBottom: '4px' }}>占位符文本:</label>
        <input
          type="text"
          value={selectedComponent.props.placeholder || ''}
          onChange={(e) => handlePropChange('placeholder', e.target.value)}
          style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '4px' }}
        />
      </div>
      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', marginBottom: '4px' }}>默认值:</label>
        <input
          type="text"
          value={selectedComponent.props.value || ''}
          onChange={(e) => handlePropChange('value', e.target.value)}
          style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '4px' }}
        />
      </div>
    </div>
  );

  const renderButtonProps = () => (
    <div>
      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', marginBottom: '4px' }}>按钮文本:</label>
        <input
          type="text"
          value={selectedComponent.props.text || ''}
          onChange={(e) => handlePropChange('text', e.target.value)}
          style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '4px' }}
        />
      </div>
      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', marginBottom: '4px' }}>按钮颜色:</label>
        <input
          type="color"
          value={selectedComponent.props.color || '#1890ff'}
          onChange={(e) => handlePropChange('color', e.target.value)}
          style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '4px' }}
        />
      </div>
    </div>
  );

  const renderChartProps = () => (
    <div>
      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', marginBottom: '4px' }}>图表标题:</label>
        <input
          type="text"
          value={selectedComponent.props.title || ''}
          onChange={(e) => handlePropChange('title', e.target.value)}
          style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '4px' }}
        />
      </div>
      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', marginBottom: '4px' }}>图表类型:</label>
        <select
          value={selectedComponent.props.chartType || 'bar'}
          onChange={(e) => handlePropChange('chartType', e.target.value)}
          style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '4px' }}
        >
          <option value="bar">柱状图</option>
          <option value="line">折线图</option>
          <option value="pie">饼图</option>
        </select>
      </div>
    </div>
  );

  const renderComponentProps = () => {
    switch (selectedComponent.type) {
      case 'input':
        return renderInputProps();
      case 'button':
        return renderButtonProps();
      case 'chart':
        return renderChartProps();
      default:
        return <p>该组件类型暂无可配置属性</p>;
    }
  };

  return (
    <div style={{ padding: '16px', backgroundColor: '#f5f5f5', minHeight: '400px' }}>
      <h3>属性面板</h3>
      <div style={{ marginBottom: '16px' }}>
        <strong>选中组件:</strong> {selectedComponent.type}
        <div style={{ fontSize: '12px', color: '#666' }}>ID: {selectedComponent.id}</div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <h4>位置信息</h4>
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '4px' }}>X:</label>
            <input
              type="number"
              value={selectedComponent.x}
              onChange={(e) =>
                onUpdateComponent(selectedComponent.id, { x: parseInt(e.target.value) })
              }
              style={{
                width: '100%',
                padding: '6px',
                border: '1px solid #ddd',
                borderRadius: '4px',
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '4px' }}>Y:</label>
            <input
              type="number"
              value={selectedComponent.y}
              onChange={(e) =>
                onUpdateComponent(selectedComponent.id, { y: parseInt(e.target.value) })
              }
              style={{
                width: '100%',
                padding: '6px',
                border: '1px solid #ddd',
                borderRadius: '4px',
              }}
            />
          </div>
        </div>
      </div>

      <div>
        <h4>组件属性</h4>
        {renderComponentProps()}
      </div>
    </div>
  );
};

export default PropertyPanel;
