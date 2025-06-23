import React from 'react';

export const NodeSuggestion = ({ node, onClick, isHighlighted }) => (
  <div
    className={`px-3 py-2 cursor-pointer text-sm ${
      isHighlighted ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'
    }`}
    onClick={() => onClick(node)}
  >
    <div className="font-medium">{node.label}</div>
    <div className="text-xs text-gray-500">{node.type}</div>
    {node.outputs?.length > 1 && (
      <div className="text-xs text-gray-400 mt-1">
        Outputs: {node.outputs.map(output => output.label || output.id).join(', ')}
      </div>
    )}
  </div>
);