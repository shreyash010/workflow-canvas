import { Handle, Position } from 'reactflow';
import { X, Edit3, Check, AlertCircle } from 'lucide-react';
import { createNodeInstance } from '../nodes/nodesFactory';
import { useStore } from '../store';
import fieldRegistry from './fields';
import { useState, useRef, useEffect } from 'react';

export const NodeRenderer = ({ id, data, type }) => {
  const removeNode = useStore((state) => state.removeNode);
  const updateNodeName = useStore((state) => state.updateNodeName);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(id);
  const [nameError, setNameError] = useState('');
  const inputRef = useRef(null);
  
  const node = createNodeInstance(type, id, data);
  const fields = node.getFields();
  const handles = node.getHandles();
  const { title: nodeTitle, description } = node.getBasicNodeInfo();
  
  const onChange = (key, value) => {
    if (data.onChange) {
      data.onChange(key, value);
    }
  };

  // Handle delete button click
  const handleDelete = (e) => {
    e.stopPropagation();
    removeNode(id);
  };

  // Handle name editing
  const handleNameEdit = () => {
    setIsEditingName(true);
    setTempName(id);
    setNameError('');
  };

  const handleNameSave = () => {
    if (tempName.trim() === '') {
      setNameError('Name cannot be empty');
      return;
    }
    
    if (tempName === id) {
      setIsEditingName(false);
      return;
    }
    
    const success = updateNodeName(id, tempName.trim());
    if (success) {
      setIsEditingName(false);
      setNameError('');
    } else {
      setNameError('Name already exists');
    }
  };

  const handleNameCancel = () => {
    setIsEditingName(false);
    setTempName(id);
    setNameError('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleNameSave();
    } else if (e.key === 'Escape') {
      handleNameCancel();
    }
  };

  // Focus input when editing starts
  useEffect(() => {
    if (isEditingName && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingName]);

  const renderField = (field) => {
    const value = node.getFieldValue(field.key);
    
    const FieldComponent = fieldRegistry[field.type] || fieldRegistry.text;
    
    const fieldProps = {
      value,
      onChange,
      fieldKey: field.key,
      placeholder: field.placeholder,
      ...field.props,
    };

    if(field.type === 'textarea'){
      fieldProps.currentNodeId = id;
    }

    if (field.type === 'number' || field.type === 'range') {
      fieldProps.min = field.min;
      fieldProps.max = field.max;
      fieldProps.step = field.step;
    }
    
    if (field.type === 'select') {
      fieldProps.options = field.options || [];
    }

    return <FieldComponent {...fieldProps} />;
  };

  return (
    <div className="relative w-full max-w-sm min-w-[220px] bg-white rounded-lg border-2 border-gray-300 shadow-sm hover:shadow-md hover:border-gray-400 transition-all duration-200">
      {/* Header */}
      <div className="px-3 py-2 border-b border-gray-100 bg-gray-50 rounded-t-md relative group">
        <button
          onClick={handleDelete}
          className="absolute top-1 right-1 w-4 h-4 bg-gray-200 text-gray-500 hover:bg-red-500 group-hover:text-white rounded-full flex items-center justify-center shadow transition-all duration-150 z-10"
          title="Delete node"
        >
          <X className="w-2.5 h-2.5" />
        </button>
        <div className="flex-1 min-w-0 pr-6">
          <h3 className="text-sm font-medium text-gray-900 truncate">
            {nodeTitle}
          </h3>
          {description && (
            <p className="text-xs text-gray-500 mt-0.5 leading-tight break-words">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Editable Node Name */}
      <div className="px-3 py-2 bg-blue-50 border-b border-blue-100">
        {isEditingName ? (
          <div className="space-y-1">
            <div className="flex items-center space-x-1">
              <input
                ref={inputRef}
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onKeyDown={handleKeyPress}
                onBlur={handleNameSave}
                className="flex-1 text-xs font-mono bg-white border border-blue-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter node name"
              />
              <button
                onClick={handleNameSave}
                className="w-5 h-5 bg-green-500 text-white rounded flex items-center justify-center hover:bg-green-600 transition-colors"
                title="Save name"
              >
                <Check className="w-3 h-3" />
              </button>
            </div>
            {nameError && (
              <div className="flex items-center space-x-1 text-red-500">
                <AlertCircle className="w-3 h-3" />
                <span className="text-xs">{nameError}</span>
              </div>
            )}
          </div>
        ) : (
          <div 
            className="flex items-center justify-between group cursor-pointer hover:bg-blue-100 rounded px-1 py-0.5 transition-colors"
            onClick={handleNameEdit}
          >
            <span className="text-xs font-mono text-blue-700 font-semibold truncate">
              {id}
            </span>
            <Edit3 className="w-3 h-3 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity ml-1 flex-shrink-0" />
          </div>
        )}
      </div>

      {/* Content */}
      {fields.length > 0 && (
        <div className="p-3 space-y-3">
          {fields.map(field => (
            <div key={field.key} className="space-y-1">
              <label className="block text-xs font-medium text-gray-700">
                {field.label}
                {field.required && <span className="text-red-400 ml-1">*</span>}
              </label>
              {renderField(field)}
            </div>
          ))}
        </div>
      )}

      {/* Handles */}
      {handles.map((h, idx) => (
        <Handle
          key={idx}
          type={h.type}
          position={Position[h.position]}
          id={typeof h.id === 'function' ? h.id(id) : h.id}
          className={`
            !w-4 !h-4 !border-1 !border-gray-200 !rounded-full !cursor-pointer
            ${h.type === 'source' 
              ? '!rounded-full !bg-blue-500 hover:!bg-blue-600 !border-2 !border-gray-400 hover:!border-blue-600 !shadow-md hover:!shadow-lg'
              : 'triangle-shape !bg-gray-300 hover:!bg-gray-400'}
            }
            transition-all duration-150 !shadow-md hover:!shadow-lg
          `}
          style={{ 
            ...h.style,
            ...(h.position === 'Left' && { left: '-8px' }),
            ...(h.position === 'Right' && { right: '-8px' }),
            ...(h.position === 'Top' && { top: '-8px' }),
            ...(h.position === 'Bottom' && { bottom: '-8px' })
          }}
        />
      ))}
    </div>
  );
};