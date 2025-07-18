/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useDrag } from 'react-dnd';

interface Props {
  id: string;
  type: string;
  x: number;
  y: number;
  props: Record<string, any>;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: any) => void;
}

const ComponentInstance: React.FC<Props> = ({
  id,
  type,
  x,
  y,
  props,
  isSelected,
  onSelect,
  onUpdate,
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'instance',
    item: { id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
  };

  const handlePropChange = (newProps: Record<string, any>) => {
    onUpdate({ props: newProps });
  };

  const renderComponent = () => {
    switch (type) {
      case 'input':
        return (
          <input
            placeholder={props.placeholder}
            value={props.value}
            onChange={(e) => handlePropChange({ ...props, value: e.target.value })}
            style={{ width: '100%', pointerEvents: isSelected ? 'auto' : 'none' }}
          />
        );
      case 'button':
        return (
          <button
            style={{
              backgroundColor: props.color,
              color: 'white',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              pointerEvents: isSelected ? 'auto' : 'none',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {props.text}
          </button>
        );
      case 'chart':
        return (
          <div
            style={{
              width: '200px',
              height: '150px',
              border: '1px solid #ddd',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f9f9f9',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div>📊</div>
              <div>{props.title}</div>
              <div>({props.chartType})</div>
            </div>
          </div>
        );
      default:
        return <div>未知组件类型</div>;
    }
  };

  return (
    <div
      ref={drag}
      onClick={handleClick}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        opacity: isDragging ? 0.5 : 1,
        padding: '6px',
        border: isSelected ? '2px solid #1890ff' : '1px solid #ddd',
        backgroundColor: 'white',
        borderRadius: '4px',
        cursor: 'move',
        boxShadow: isSelected ? '0 0 0 2px rgba(24, 144, 255, 0.2)' : 'none',
      }}
    >
      {renderComponent()}
      {isSelected && (
        <div
          style={{
            position: 'absolute',
            top: -8,
            right: -8,
            width: 16,
            height: 16,
            backgroundColor: '#1890ff',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            color: 'white',
          }}
        >
          ✓
        </div>
      )}
    </div>
  );
};

export default ComponentInstance;
