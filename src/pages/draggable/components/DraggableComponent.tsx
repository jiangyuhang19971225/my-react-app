import React from 'react';
import { useDrag } from 'react-dnd';

interface DraggableProps {
  type: string;
  name: string;
}

const DraggableComponent: React.FC<DraggableProps> = ({ type, name }) => {
  // isDragging：布尔值，表明当前组件是否正在被拖动。
  // drag：一个 ref 对象，要绑定到需要拖动的 DOM 元素上

  // collect 函数接收一个 monitor 对象，该对象可获取拖动操作的状态信息。
  // 这里使用 monitor.isDragging() 方法判断组件是否正在被拖动，并将结果存储在 isDragging 中。
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'component',
    item: { type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        padding: '8px',
        margin: '4px',
        border: '1px solid #999',
        cursor: 'move',
      }}
    >
      {name}
    </div>
  );
};

export default DraggableComponent;
