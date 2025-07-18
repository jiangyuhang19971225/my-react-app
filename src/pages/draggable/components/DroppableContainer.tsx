/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useDrop } from 'react-dnd';
import ComponentInstance from './ComponentInstance';
import useIdGenerator from '../../../utils/idGenerator';

interface ComponentItem {
  id: string;
  type: string;
  x: number;
  y: number;
  props: Record<string, any>;
}

interface DroppableContainerProps {
  components: ComponentItem[];
  selectedComponentId?: string | null; // Changed from string | undefined
  onSelectComponent: (id: string) => void;
  onUpdateComponent: (id: string, updates: Partial<ComponentItem>) => void;
  onAddComponent: (component: ComponentItem) => void;
}

const DroppableContainer: React.FC<DroppableContainerProps> = ({
  components,
  selectedComponentId,
  onSelectComponent,
  onUpdateComponent,
  onAddComponent,
}) => {
  const nextId = useIdGenerator();

  // 处理从组件库拖拽新组件和画布内拖拽现有组件
  const [, drop] = useDrop(() => ({
    accept: ['component', 'instance'],
    drop(item: { type: string; id?: string }, monitor) {
      if (!monitor.didDrop()) {
        const offset = monitor.getClientOffset();
        const containerElement = document.getElementById('canvas');

        if (offset && containerElement) {
          const containerRect = containerElement.getBoundingClientRect();
          // 修正坐标计算，减去容器的 padding
          const x = offset.x - containerRect.left - 10; // 减去 padding: 10
          const y = offset.y - containerRect.top - 10; // 减去 padding: 10

          // 确保坐标不为负数
          const finalX = Math.max(0, x);
          const finalY = Math.max(0, y);

          if (item.id) {
            // 画布内拖拽现有组件
            onUpdateComponent(item.id, { x: finalX, y: finalY });
          } else {
            // 从组件库拖拽新组件
            const newComponent: ComponentItem = {
              id: nextId(),
              type: item.type,
              x: finalX,
              y: finalY,
              props: getDefaultProps(item.type),
            };
            onAddComponent(newComponent);
          }
        }
      }
    },
  }));

  // 获取组件默认属性
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
    <div
      id="canvas"
      ref={drop}
      style={{
        position: 'relative',
        minHeight: 500, // 增加最小高度
        border: '2px dashed #ccc',
        padding: 10,
        backgroundColor: '#fafafa',
        borderRadius: '8px', // 添加圆角
        overflow: 'hidden', // 防止组件溢出
      }}
    >
      {components.length === 0 && (
        <p style={{ textAlign: 'center', color: '#999', marginTop: 200 }}>将组件拖入此处</p>
      )}
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
    </div>
  );
};

export default DroppableContainer;
