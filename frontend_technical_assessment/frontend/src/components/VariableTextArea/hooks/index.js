import { useState, useEffect, useMemo } from 'react';
import { useStore } from '../../../store';
import { createNodeInstance } from '../../../nodes/nodesFactory';

export const useNodeData = (currentNodeId) => {
  const nodes = useStore(state => state.nodes);

  const getNodeHandles = (node) => {
    try {
      const nodeInstance = createNodeInstance(node.data.nodeType || node.type, node.id);
      const handles = nodeInstance.getHandles();
      
      return {
        inputs: handles.filter(h => h.type === 'target'),
        outputs: handles.filter(h => h.type === 'source')
      };
    } catch (error) {
      console.warn(`Could not get handles for node ${node.id}:`, error);
      return {
        inputs: [{ id: (id) => `${id}-input`, label: 'Input' }],
        outputs: [{ id: (id) => `${id}-output`, label: 'Output' }]
      };
    }
  };

  const availableNodes = useMemo(() => {
    return nodes
      .filter(node => node.id !== currentNodeId)
      .map(node => {
        const handles = getNodeHandles(node);
        const hasOutput = handles.outputs.length > 0;
        
        return {
          id: node.id,
          label: node.data.inputName || node.data.outputName || node.data.nodeType || node.id,
          type: node.data.nodeType || node.type,
          hasOutput,
          outputs: handles.outputs.map(output => ({
            id: typeof output.id === 'function' ? output.id(node.id) : output.id,
            label: output.label || output.id,
            description: output.description
          }))
        };
      })
      .filter(node => node.hasOutput);
  }, [nodes, currentNodeId]);

  const getCurrentNodeInputs = () => {
    const currentNode = nodes.find(n => n.id === currentNodeId);
    if (!currentNode) return [];
    
    const handles = getNodeHandles(currentNode);
    return handles.inputs.map(input => ({
      id: typeof input.id === 'function' ? input.id(currentNodeId) : input.id,
      label: input.label || input.id,
      type: input.inputType || 'default'
    }));
  };

  return { availableNodes, getCurrentNodeInputs };
};

export const useTextareaResize = (textareaRef, value, minLines, maxLines) => {
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    const computedStyles = window.getComputedStyle(textarea);
    const lineHeight = parseFloat(computedStyles.lineHeight);
    const minHeight = lineHeight * minLines;
    const maxHeight = lineHeight * maxLines;

    const newHeight = Math.max(
      minHeight,
      Math.min(textarea.scrollHeight, maxHeight)
    );
    textarea.style.height = `${newHeight}px`;
    textarea.style.overflowY = textarea.scrollHeight > maxHeight ? 'auto' : 'hidden';
  }, [value, maxLines, minLines]);
};

export const useVariables = (value) => {
  const [variables, setVariables] = useState([]);

  useEffect(() => {
    const variableRegex = /\{\{([^}]+)\}\}/g;
    const matches = [...value.matchAll(variableRegex)];
    const extractedVars = matches.map(match => ({
      full: match[0],
      name: match[1],
      index: match.index
    }));
    setVariables(extractedVars);
  }, [value]);

  const removeVariable = (variableToRemove, onChange) => {
    const newValue = value.replace(variableToRemove.full, '');
    onChange(newValue);
  };

  return { variables, removeVariable };
};
export const useClickOutside = ({
  textareaRef,
  suggestionsRef,
  outputSelectorRef,
  showSuggestions,
  showOutputSelector,
  setShowSuggestions,
  setShowOutputSelector,
  setSelectedNodeForOutput,
  setHighlightedIndex
}) => {
  useEffect(() => {
    function handleClickOutside(event) {
      const clickedOutsideAll =
        (!textareaRef.current || !textareaRef.current.contains(event.target)) &&
        (!suggestionsRef.current || !suggestionsRef.current.contains(event.target)) &&
        (!outputSelectorRef.current || !outputSelectorRef.current.contains(event.target));

      if (clickedOutsideAll) {
        if (showSuggestions) setShowSuggestions(false);
        if (showOutputSelector) setShowOutputSelector(false);
        setSelectedNodeForOutput(null);
        setHighlightedIndex(0);
      }
    }

    document.addEventListener('pointerdown', handleClickOutside);
    
    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
    };
  }, [
    showSuggestions, 
    showOutputSelector, 
    textareaRef,
    setShowSuggestions,
    setShowOutputSelector,
    setSelectedNodeForOutput,
    setHighlightedIndex
  ]);
};
// export const useClickOutside = ({
//   wrapperRef,
//   suggestionsRef,
//   outputSelectorRef,
//   showSuggestions,
//   showOutputSelector,
//   setShowSuggestions,
//   setShowOutputSelector,
//   setSelectedNodeForOutput,
//   setHighlightedIndex
// }) => {
//   useEffect(() => {
//     function handleClickOutside(event) {
//       const isOutsideWrapper = wrapperRef.current && !wrapperRef.current.contains(event.target);
//       const isOutsideSuggestions = suggestionsRef.current && !suggestionsRef.current.contains(event.target);
//       const isOutsideOutputSelector = outputSelectorRef.current && !outputSelectorRef.current.contains(event.target);
      
//       if (isOutsideWrapper && isOutsideSuggestions && isOutsideOutputSelector) {
//         if (showSuggestions) setShowSuggestions(false);
//         if (showOutputSelector) setShowOutputSelector(false);
//         setSelectedNodeForOutput(null);
//         setHighlightedIndex(0);
//       }
//     }

//     // Listen to both mousedown and touchstart for better mobile support
//     document.addEventListener('mousedown', handleClickOutside);
//     document.addEventListener('touchstart', handleClickOutside);
    
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//       document.removeEventListener('touchstart', handleClickOutside);
//     };
//   }, [
//     showSuggestions, 
//     showOutputSelector, 
//     wrapperRef, 
//     suggestionsRef, 
//     outputSelectorRef,
//     setShowSuggestions,
//     setShowOutputSelector,
//     setSelectedNodeForOutput,
//     setHighlightedIndex
//   ]);
// };

export const useKeyboardNavigation = ({
  showSuggestions,
  showOutputSelector,
  availableNodes,
  highlightedIndex,
  setHighlightedIndex,
  setShowSuggestions,
  selectNode,
  showNodeSuggestions,
  value
}) => {
  const handleKeyDown = (e) => {
    if (showOutputSelector) return;

    if (!showSuggestions) {
      if (e.key === '{' && e.target.value.slice(-1) === '{') {
        showNodeSuggestions(e);
      }
      return;
    }
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < availableNodes.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : availableNodes.length - 1
        );
        break;
      case 'Enter':
      case 'Tab':
        e.preventDefault();
        if (availableNodes[highlightedIndex]) {
          selectNode(availableNodes[highlightedIndex]);
        }
        break;
      case 'Escape':
      case 'Backspace':
        setShowSuggestions(false);
        break;
    }
  };

  useEffect(() => {
    if (showSuggestions && value && !value.includes('{{')) {
      setShowSuggestions(false);
    }
  }, [value, showSuggestions, setShowSuggestions]);

  return { handleKeyDown };
};