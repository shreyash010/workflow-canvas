import { InputNode } from './inputNode';
import { LLMNode } from './llmNode';
import { OutputNode } from './outputNode';
import { TextNode } from './textNode';
import { ConditionalNode } from './conditionalNode';
import { DatabaseNode } from './databaseNode';
import { DataTransformNode } from './dataTransformNode';
import { DelayNode } from './delayNode';
import { HttpRequestNode } from './httpNode';

/**
 * Central registry for all node types
 * When you add a new node, just add it here and it will automatically
 * be available everywhere (UI, validation, etc.)
 */
export const nodeRegistry = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  httpRequest: HttpRequestNode,
  dataTransform: DataTransformNode,
  conditional: ConditionalNode,
  delay: DelayNode,
  database: DatabaseNode,
};

/**
 * Get all registered node type keys
 * Useful for validation and iteration
 */
export const getRegisteredNodeTypes = () => Object.keys(nodeRegistry);

export function createNodeInstance(type, id, data = {}) {
  const NodeClass = nodeRegistry[type];
  if (!NodeClass) {
    throw new Error(`Unknown node type: ${type}`);
  }
  return new NodeClass(id, data);
}

// Get available node types for UI with categories
export function getAvailableNodeTypes() {
  return Object.keys(nodeRegistry).map(type => {
    const tempInstance = new nodeRegistry[type]('temp', {});
    const info = tempInstance.getBasicNodeInfo();
    return {
      type,
      title: info.title,
      category: info.category,
      icon: info.icon,
      description: info.description
    };
  });
}

// Get nodes grouped by category
export function getNodesByCategory() {
  const nodes = getAvailableNodeTypes();
  const categories = {};
  
  nodes.forEach(node => {
    const category = node.category || 'Other';
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(node);
  });
  
  return categories;
}