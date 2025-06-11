import React from 'react';
import { NodeSuggestion } from './NodeSuggestion';

export const SuggestionsDropdown = ({ 
  nodes, 
  position, 
  highlightedIndex, 
  onSelectNode, 
  forwardRef 
}) => (
  <div
    ref={forwardRef}
    className="absolute z-10 bg-white border border-gray-200 rounded-md shadow-lg max-h-40 overflow-y-auto"
    style={{
      top: position.top,
      left: position.left,
      minWidth: '200px'
    }}
  >
    {nodes.map((node, index) => (
      <NodeSuggestion
        key={node.id}
        node={node}
        onClick={onSelectNode}
        isHighlighted={index === highlightedIndex}
      />
    ))}
  </div>
);
