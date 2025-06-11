import { useState } from 'react';

export const DraggableNode = ({ type, label, icon: IconComponent }) => {
  const [isDragging, setIsDragging] = useState(false);

  const onDragStart = (event, nodeType) => {
    const appData = { nodeType };
    setIsDragging(true);
    event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragEnd = (event) => {
    setIsDragging(false);
  };

  return (
    <div
      className={`
        flex flex-col items-center justify-center w-20 h-20 p-2 rounded-xl
        bg-white text-sm font-medium text-gray-800
        shadow-md border border-gray-200
        hover:shadow-lg hover:scale-105 transition-transform duration-200
        cursor-grab select-none
        ${isDragging ? 'scale-95 shadow-sm cursor-grabbing' : ''}
      `}
      onDragStart={(event) => onDragStart(event, type)}
      onDragEnd={onDragEnd}
      draggable
    >
      {/* Icon */}
      <div className="mb-1">
        {IconComponent ? <IconComponent className="w-4 h-4" /> : '📦'}
      </div>
      
      {/* Label */}
      <span className="text-xs font-medium leading-tight text-center px-1">
        {label}
      </span>
    </div>
  );
};