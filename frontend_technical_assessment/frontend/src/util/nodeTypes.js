import { nodeRegistry } from '../nodes/nodesFactory';
import { NodeRenderer } from '../components/NodeRenderer';

/**
 * Automatically generate nodeTypes object for ReactFlow
 * This ensures all registered nodes use the same renderer
 */
export function generateNodeTypes() {
  const nodeTypes = {};
  Object.keys(nodeRegistry).forEach(nodeType => {
    nodeTypes[nodeType] = NodeRenderer;
  });
  
  return nodeTypes;
}

/**
 * Get all available node type keys
 */
export function getNodeTypeKeys() {
  return Object.keys(nodeRegistry);
}

/**
 * Check if a node type is valid/registered
 */
export function isValidNodeType(nodeType) {
  return nodeRegistry.hasOwnProperty(nodeType);
}

/**
 * Get node type configuration for debugging
 */
export function getNodeTypeConfig() {
  return Object.keys(nodeRegistry).map(type => ({
    type,
    className: nodeRegistry[type].name,
    info: new nodeRegistry[type]('temp', {}).getBasicNodeInfo()
  }));
}

export const nodeTypes = generateNodeTypes();