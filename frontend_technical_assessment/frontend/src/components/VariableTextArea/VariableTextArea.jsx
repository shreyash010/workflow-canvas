import React, { useState, useRef } from 'react';
import { useStore } from '../../store';
import { VariableChip } from './VariableChip';
import { SuggestionsDropdown } from './SuggestionsDropdown';
import { OutputSelector } from './OutputSelector';
import { 
  useNodeData, 
  useTextareaResize, 
  useVariables, 
  useClickOutside, 
  useKeyboardNavigation 
} from './hooks';

export const VariableTextArea = ({ 
  value = '', 
  onChange, 
  placeholder,
  currentNodeId,
  maxLines = 6,
  minLines = 2,
  inputType = 'default',
  ...props 
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showOutputSelector, setShowOutputSelector] = useState(false);
  const [selectedNodeForOutput, setSelectedNodeForOutput] = useState(null);
  const [suggestionPosition, setSuggestionPosition] = useState({ top: 0, left: 0 });
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const textareaRef = useRef(null);
  const suggestionsRef = useRef(null);
  const outputSelectorRef = useRef(null);

  const addEdgeConnection = useStore(state => state.onConnect);
  const { availableNodes, getCurrentNodeInputs } = useNodeData(currentNodeId);
  const { variables, removeVariable } = useVariables(value);

  // Custom hooks
  useTextareaResize(textareaRef, value, minLines, maxLines);
  useClickOutside({
    textareaRef,
    suggestionsRef,
    outputSelectorRef,
    showSuggestions,
    showOutputSelector,
    setShowSuggestions,
    setShowOutputSelector,
    setSelectedNodeForOutput,
    setHighlightedIndex
  });

  const { handleKeyDown } = useKeyboardNavigation({
    showSuggestions,
    showOutputSelector,
    availableNodes,
    highlightedIndex,
    setHighlightedIndex,
    setShowSuggestions,
    selectNode,
    showNodeSuggestions,
    value
  });

  // Core functions
  function showNodeSuggestions(e) {
    const textarea = e.target;
    const cursorPosition = textarea.selectionStart;
    const textBeforeCursor = value.substring(0, cursorPosition);
    const lines = textBeforeCursor.split('\n');
    const currentLine = lines[lines.length - 1];
    
    const rect = textarea.getBoundingClientRect();
    const computedStyles = window.getComputedStyle(textarea);
    const lineHeight = parseFloat(computedStyles.lineHeight) || 20;
    const charWidth = 8;
    
    setSuggestionPosition({
      top: (lines.length - 1) * lineHeight + lineHeight + 5,
      left: Math.min(currentLine.length * charWidth, rect.width - 200)
    });
    
    setShowSuggestions(true);
    setHighlightedIndex(0);
  }

  // Handle input changes and detect {{ trigger
  function handleInputChange(e) {
    const newValue = e.target.value;
    onChange(newValue);
    
    // Check if user just typed {{ to trigger suggestions
    const cursorPos = e.target.selectionStart;
    const textBeforeCursor = newValue.substring(0, cursorPos);
    
    // Check if the last two characters are {{
    if (textBeforeCursor.endsWith('{{')) {
      showNodeSuggestions(e);
    } else {
      // Hide suggestions if they're showing and we're not in a variable context
      const lastBraceIndex = textBeforeCursor.lastIndexOf('{{');
      const lastCloseBraceIndex = textBeforeCursor.lastIndexOf('}}');
      
      // If we're not inside a variable ({{ without matching }}), hide suggestions
      if (lastBraceIndex === -1 || (lastCloseBraceIndex > lastBraceIndex)) {
        setShowSuggestions(false);
      }
    }
  }

  function selectNode(node) {
    if (node.outputs && node.outputs.length > 1) {
      setSelectedNodeForOutput(node);
      setShowOutputSelector(true);
      setShowSuggestions(false);
    } else {
      const output = node.outputs && node.outputs[0] ? node.outputs[0] : { id: 'default', label: 'output' };
      insertVariableAndConnect(node, output);
      setShowSuggestions(false);
    }
  }

  function handleOutputSelect(output) {
    if (selectedNodeForOutput) {
      insertVariableAndConnect(selectedNodeForOutput, output);
    }
    setShowOutputSelector(false);
    setSelectedNodeForOutput(null);
  }

  function insertVariableAndConnect(node, output) {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const cursorPos = textarea.selectionStart;
    const beforeCursor = value.substring(0, cursorPos);
    const lastBraceIndex = beforeCursor.lastIndexOf('{{');
    
    if (lastBraceIndex !== -1) {
      const beforeVariable = value.substring(0, lastBraceIndex);
      const afterCursor = value.substring(cursorPos);
      const variableName = node.outputs && node.outputs.length > 1 
        ? `${node.label}.${output.label || output.id.split('-').pop()}`
        : node.label;
      
      const newValue = beforeVariable + `{{${variableName}}}` + afterCursor;
      onChange(newValue);
      
      if (currentNodeId) {
        createEdgeConnection(node.id, output.id, currentNodeId);
      }
      
      // Focus back to textarea and set cursor position
      setTimeout(() => {
        const newCursorPos = beforeVariable.length + `{{${variableName}}}`.length;
        textarea.focus();
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    }
  }

  function createEdgeConnection(sourceNodeId, sourceHandle, targetNodeId) {
    const currentInputs = getCurrentNodeInputs();
    const targetHandle = currentInputs.find(input => 
      input.type === inputType || input.label.toLowerCase().includes(inputType)
    )?.id || `${targetNodeId}-input`;

    addEdgeConnection({
      source: sourceNodeId,
      sourceHandle: sourceHandle,
      target: targetNodeId,
      targetHandle: targetHandle,
    });
  }

  return (
    <div className="relative">
      {variables.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1">
          {variables.map((variable, index) => (
            <VariableChip
              key={index}
              variable={{ label: variable.name }}
              onRemove={() => removeVariable(variable, onChange)}
            />
          ))}
        </div>
      )}

      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition-all duration-200"
        style={{ 
          minHeight: `${20 * minLines}px`,
          overflowY: 'hidden'
        }}
        {...props}
      />

      {showSuggestions && availableNodes && availableNodes.length > 0 && (
        <SuggestionsDropdown
          nodes={availableNodes}
          position={suggestionPosition}
          highlightedIndex={highlightedIndex}
          onSelectNode={selectNode}
          forwardRef={suggestionsRef}
        />
      )}

      {showOutputSelector && selectedNodeForOutput && (
        <OutputSelector
          outputs={selectedNodeForOutput.outputs}
          onSelect={handleOutputSelect}
          onCancel={() => {
            setShowOutputSelector(false);
            setSelectedNodeForOutput(null);
          }}
          position={suggestionPosition}
          forwardRef={outputSelectorRef}
        />
      )}
    </div>
  );
};