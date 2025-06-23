import React from 'react';

export const OutputSelector = ({ 
  outputs, 
  onSelect, 
  onCancel, 
  position, 
  forwardRef 
}) => (
  <div
    ref={forwardRef}
    className="absolute z-20 bg-white border border-gray-300 rounded-md shadow-lg max-h-32 overflow-y-auto"
    style={{
      top: position.top + 30,
      left: position.left,
      minWidth: '180px'
    }}
  >
    <div className="px-3 py-2 text-xs font-medium text-gray-600 border-b">
      Select Output:
    </div>
    {outputs.map((output) => (
      <div
        key={output.id}
        className="px-3 py-2 cursor-pointer text-sm hover:bg-gray-50"
        onClick={(e) => {
          e.preventDefault(); // Prevent blur event
          console.log('Output clicked:', output); // Debug log
          onSelect(output);
        }}
      >
        <div className="font-medium">{output.label || output.id.split('-').pop()}</div>
        {output.description && (
          <div className="text-xs text-gray-500">{output.description}</div>
        )}
      </div>
    ))}
    <div
      className="px-3 py-2 cursor-pointer text-sm text-gray-500 hover:bg-gray-50 border-t"
      onClick={(e) => {
        e.preventDefault(); // Prevent blur event
        console.log('Cancel clicked'); // Debug log
        onCancel();
      }}
    >
      Cancel
    </div>
  </div>
);