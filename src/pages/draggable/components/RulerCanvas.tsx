/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef } from 'react';
import { useDrop } from 'react-dnd';
import Ruler from '@scena/react-ruler';
import ComponentInstance from './ComponentInstance';
import useIdGenerator from '../../../utils/idGenerator';

interface ComponentItem {
  id: string;
  type: string;
  x: number;
  y: number;
  props: Record<string, any>;
}

interface RulerCanvasProps {
  components: ComponentItem[];
  selectedComponentId?: string | null;
  onSelectComponent: (id: string) => void;
  onUpdateComponent: (id: string, updates: Partial<ComponentItem>) => void;
  onAddComponent: (component: ComponentItem) => void;
}

const RulerCanvas: React.FC<RulerCanvasProps> = ({
  components,
  selectedComponentId,
  onSelectComponent,
  onUpdateComponent,
  onAddComponent,
}) => {
  const nextId = useIdGenerator();
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop(() => ({
    accept: ['component', 'instance'],
    hover(item: { type: string; id?: string }, monitor) {
      const offset = monitor.getClientOffset();
      if (offset && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = offset.x - rect.left;
        const y = offset.y - rect.top;
        setDragPosition({ x, y });
        setIsDragging(true);
      }
    },
    drop(item: { type: string; id?: string }, monitor) {
      setIsDragging(false);
      if (!monitor.didDrop()) {
        const offset = monitor.getClientOffset();
        if (offset && canvasRef.current) {
          const rect = canvasRef.current.getBoundingClientRect();
          const x = Math.max(0, offset.x - rect.left);
          const y = Math.max(0, offset.y - rect.top);

          if (item.id) {
            onUpdateComponent(item.id, { x, y });
          } else {
            const newComponent: ComponentItem = {
              id: nextId(),
              type: item.type,
              x,
              y,
              props: getDefaultProps(item.type),
            };
            onAddComponent(newComponent);
          }
        }
      }
    },
  }));

  const getDefaultProps = (type: string): Record<string, any> => {
    switch (type) {
      case 'input':
        return { placeholder: '请输入内容', value: '' };
      case 'button':
        return { text: '点击我', color: '#1890ff' };
      case 'chart':
        return { title: '图表', chartType: 'bar' };
      default:
        return {};
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* 水平标尺 */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 25,
          right: 0,
          height: 25,
          zIndex: 10,
          background: 'linear-gradient(to bottom, #ffffff, #f5f5f5)',
          borderBottom: '1px solid #e0e0e0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Ruler
          type="horizontal"
          width={1200}
          height={25}
          unit={1}
          zoom={1}
          backgroundColor="transparent"
          lineColor="#d0d0d0"
          textColor="#666666"
          direction="bottom"
          textAlign="center"
          textOffset={[0, 12]}
          longLineColor="#999999"
          shortLineColor="#e0e0e0"
          textFormat={(scale) => {
            // 只在50的倍数时显示文字
            return scale % 50 === 0 ? `${scale}` : '';
          }}
          style={{
            width: '100%',
            height: '100%',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontSize: '10px',
            fontWeight: '500',
          }}
        />
      </div>

      {/* 垂直标尺 */}
      <div
        style={{
          position: 'absolute',
          top: 25,
          left: 0,
          width: 25,
          bottom: 0,
          zIndex: 10,
          background: 'linear-gradient(to right, #ffffff, #f5f5f5)',
          borderRight: '1px solid #e0e0e0',
          boxShadow: '1px 0 3px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Ruler
          type="vertical"
          width={25}
          height={800}
          unit={1}
          zoom={1}
          backgroundColor="transparent"
          lineColor="#d0d0d0"
          textColor="#666666"
          direction="right"
          textAlign="center"
          textOffset={[12, 0]}
          longLineColor="#999999"
          shortLineColor="#e0e0e0"
          textFormat={(scale) => {
            // 只在50的倍数时显示文字
            return scale % 50 === 0 ? `${scale}` : '';
          }}
          style={{
            width: '100%',
            height: '100%',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontSize: '10px',
            fontWeight: '500',
          }}
        />
      </div>

      {/* 左上角块 - 现代化设计 */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 25,
          height: 25,
          background: 'linear-gradient(135deg, #ffffff, #f0f0f0)',
          borderRight: '1px solid #e0e0e0',
          borderBottom: '1px solid #e0e0e0',
          zIndex: 11,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '1px 1px 3px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div
          style={{
            fontSize: '10px',
            color: '#888',
            fontWeight: 'bold',
          }}
        >
          ◢
        </div>
      </div>

      {/* 画布区域 */}
      <div
        ref={(node) => {
          canvasRef.current = node;
          drop(node);
        }}
        style={{
          position: 'absolute',
          top: 25,
          left: 25,
          right: 0,
          bottom: 0,
          backgroundColor: '#ffffff',
          border: '1px solid #e0e0e0',
          overflow: 'hidden',
          boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.05)',
        }}
      >
        {/* 拖拽时的辅助线 - 优化样式 */}
        {isDragging && (
          <>
            {/* 垂直辅助线 */}
            <div
              style={{
                position: 'absolute',
                left: dragPosition.x,
                top: 0,
                bottom: 0,
                width: 1,
                background: 'linear-gradient(to bottom, #ff6b6b, #ff4757)',
                zIndex: 100,
                pointerEvents: 'none',
                boxShadow: '0 0 6px rgba(255, 71, 87, 0.4)',
              }}
            />
            {/* 水平辅助线 */}
            <div
              style={{
                position: 'absolute',
                top: dragPosition.y,
                left: 0,
                right: 0,
                height: 1,
                background: 'linear-gradient(to right, #ff6b6b, #ff4757)',
                zIndex: 100,
                pointerEvents: 'none',
                boxShadow: '0 0 6px rgba(255, 71, 87, 0.4)',
              }}
            />
            {/* 坐标显示 - 现代化样式 */}
            <div
              style={{
                position: 'absolute',
                left: dragPosition.x + 15,
                top: dragPosition.y - 40,
                background: 'linear-gradient(135deg, #2c3e50, #34495e)',
                color: '#ffffff',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '11px',
                zIndex: 101,
                pointerEvents: 'none',
                fontFamily: 'Monaco, "Cascadia Code", "Roboto Mono", monospace',
                fontWeight: '500',
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ color: '#74b9ff' }}>X:</span>
                <span>{Math.round(dragPosition.x)}</span>
                <span style={{ color: '#fd79a8', marginLeft: '8px' }}>Y:</span>
                <span>{Math.round(dragPosition.y)}</span>
              </div>
              {/* 小箭头 */}
              <div
                style={{
                  position: 'absolute',
                  bottom: -6,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 0,
                  height: 0,
                  borderLeft: '6px solid transparent',
                  borderRight: '6px solid transparent',
                  borderTop: '6px solid #2c3e50',
                }}
              />
            </div>
            {/* 标尺上的位置指示器 - 优化样式 */}
            {/* 水平标尺指示器 */}
            <div
              style={{
                position: 'absolute',
                left: dragPosition.x - 3,
                top: -25,
                width: 6,
                height: 6,
                background: 'linear-gradient(135deg, #ff6b6b, #ff4757)',
                borderRadius: '50%',
                zIndex: 102,
                pointerEvents: 'none',
                boxShadow: '0 2px 6px rgba(255, 71, 87, 0.4)',
                border: '1px solid #ffffff',
              }}
            />
            {/* 垂直标尺指示器 */}
            <div
              style={{
                position: 'absolute',
                left: -25,
                top: dragPosition.y - 3,
                width: 6,
                height: 6,
                background: 'linear-gradient(135deg, #ff6b6b, #ff4757)',
                borderRadius: '50%',
                zIndex: 102,
                pointerEvents: 'none',
                boxShadow: '0 2px 6px rgba(255, 71, 87, 0.4)',
                border: '1px solid #ffffff',
              }}
            />
          </>
        )}

        {/* 组件实例 */}
        {components.map((comp) => (
          <ComponentInstance
            key={comp.id}
            id={comp.id}
            type={comp.type}
            x={comp.x}
            y={comp.y}
            props={comp.props}
            isSelected={selectedComponentId === comp.id}
            onSelect={() => onSelectComponent(comp.id)}
            onUpdate={(updates) => onUpdateComponent(comp.id, updates)}
          />
        ))}

        {/* 空状态提示 - 现代化样式 */}
        {components.length === 0 && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              color: '#95a5a6',
              fontSize: '16px',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}
          >
            <div
              style={{
                fontSize: '64px',
                marginBottom: '20px',
                background: 'linear-gradient(135deg, #74b9ff, #0984e3)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              🎨
            </div>
            <div style={{ fontSize: '18px', fontWeight: '500', marginBottom: '8px' }}>
              将组件拖入画布
            </div>
            <div style={{ fontSize: '14px', color: '#bdc3c7' }}>拖拽时会显示精确的刻度线和坐标</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RulerCanvas;
