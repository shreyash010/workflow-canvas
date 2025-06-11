import { BaseNode, HandlePosition } from './baseNode';
import { GitBranch } from 'lucide-react';

export class ConditionalNode extends BaseNode {
  getBasicNodeInfo() {
    return {
      title: 'Conditional',
      category: 'Logic',
      icon: GitBranch,
      description: 'Route data based on conditions and create branching workflows'
    };
  }

  getFields() {
    return [
      {
        key: 'condition',
        label: 'Condition',
        type: 'textarea',
        default: 'value > 0',
        placeholder: 'JavaScript condition (e.g., data.status === "active")'
      },
      {
        key: 'operator',
        label: 'Operator',
        type: 'select',
        options: ['equals', 'not_equals', 'greater_than', 'less_than', 'contains', 'custom'],
        default: 'custom'
      },
      {
        key: 'compareValue',
        label: 'Compare Value',
        type: 'text',
        default: '',
        placeholder: 'Value to compare against'
      }
    ];
  }

  getHandles() {
    return [
      {
        type: 'target',
        position: HandlePosition.LEFT,
        id: (id) => `${id}-input`
      },
      {
        type: 'source',
        position: HandlePosition.RIGHT,
        id: (id) => `${id}-true`
      },
      {
        type: 'source',
        position: HandlePosition.BOTTOM,
        id: (id) => `${id}-false`
      }
    ];
  }
}