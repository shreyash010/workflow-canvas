import React from 'react';

export const VariableChip = ({ variable, onRemove }) => (
  <span className="inline-flex items-center px-2 py-1 mx-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-md border border-blue-200">
    {variable.label}
    <button
      onClick={onRemove}
      className="ml-1 text-blue-600 hover:text-blue-800"
      type="button"
    >
      ×
    </button>
  </span>
);