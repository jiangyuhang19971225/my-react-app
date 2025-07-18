/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

interface ComponentItem {
  id: string;
  type: string;
  x: number;
  y: number;
  props: Record<string, any>;
}

interface PreviewCanvasProps {
  components: ComponentItem[];
  isFullscreen?: boolean;
  onClose?: () => void;
}

const PreviewCanvas: React.FC<PreviewCanvasProps> = ({
  components,
  isFullscreen = false,
  onClose,
}) => {
  const renderComponent = (comp: ComponentItem) => {
    switch (comp.type) {
      case 'input':
        return (
          <input
            key={comp.id}
            placeholder={comp.props.placeholder}
            defaultValue={comp.props.value}
            style={{
              position: 'absolute',
              left: comp.x,
              top: comp.y,
              padding: '8px 12px',
              border: '1px solid #d9d9d9',
              borderRadius: '6px',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#1890ff';
              e.target.style.boxShadow = '0 0 0 2px rgba(24, 144, 255, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d9d9d9';
              e.target.style.boxShadow = 'none';
            }}
          />
        );
      case 'button':
        return (
          <button
            key={comp.id}
            style={{
              position: 'absolute',
              left: comp.x,
              top: comp.y,
              backgroundColor: comp.props.color,
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
            }}
            onClick={() => {
              alert(`按钮 "${comp.props.text}" 被点击了！`);
            }}
          >
            {comp.props.text}
          </button>
        );
      case 'chart':
        return (
          <div
            key={comp.id}
            style={{
              position: 'absolute',
              left: comp.x,
              top: comp.y,
              width: '200px',
              height: '150px',
              border: '1px solid #e8e8e8',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fafafa',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div style={{ textAlign: 'center', color: '#666' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>📊</div>
              <div style={{ fontSize: '16px', fontWeight: '500', marginBottom: '4px' }}>
                {comp.props.title}
              </div>
              <div style={{ fontSize: '12px', color: '#999' }}>{comp.props.chartType} 图表</div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const containerStyle: React.CSSProperties = isFullscreen
    ? {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#ffffff',
        zIndex: 1000,
        overflow: 'auto',
      }
    : {
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: '#ffffff',
        border: '1px solid #e8e8e8',
        borderRadius: '8px',
        overflow: 'hidden',
      };

  return (
    <div style={containerStyle}>
      {/* 全屏模式的工具栏 */}
      {isFullscreen && (
        <div
          style={{
            position: 'sticky',
            top: 0,
            left: 0,
            right: 0,
            height: '60px',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e8e8e8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            zIndex: 1001,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontSize: '18px', fontWeight: '600', color: '#333' }}>📱 预览模式</div>
            <div
              style={{
                fontSize: '12px',
                color: '#666',
                backgroundColor: '#f0f0f0',
                padding: '4px 8px',
                borderRadius: '4px',
              }}
            >
              {components.length} 个组件
            </div>
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
              onClick={() => {
                const dataStr = JSON.stringify(components, null, 2);
                const blob = new Blob([dataStr], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'design-data.json';
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              💾 导出数据
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
              onClick={onClose}
            >
              ✕ 关闭预览
            </button>
          </div>
        </div>
      )}

      {/* 预览内容区域 */}
      <div
        style={{
          position: 'relative',
          minHeight: isFullscreen ? 'calc(100vh - 60px)' : '500px',
          padding: isFullscreen ? '24px' : '16px',
          backgroundColor: '#fafafa',
        }}
      >
        {/* 组件渲染 */}
        {components.map((comp) => renderComponent(comp))}

        {/* 空状态 */}
        {components.length === 0 && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              color: '#999',
              fontSize: '16px',
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>👁️</div>
            <div>暂无组件可预览</div>
            <div style={{ fontSize: '12px', marginTop: '8px' }}>请先在画布中添加组件</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewCanvas;
