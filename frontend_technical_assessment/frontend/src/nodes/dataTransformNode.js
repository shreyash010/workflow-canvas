import { Shuffle } from 'lucide-react';
import { BaseNode, HandlePosition } from './baseNode';

export class DataTransformNode extends BaseNode {
  getBasicNodeInfo() {
    return {
      title: 'Data Transform',
      category: 'Transform',
      icon: Shuffle,
      description: 'Transform and manipulate data using JavaScript expressions'
    };
  }

  getFields() {
    return [
      {
        key: 'transformType',
        label: 'Transform Type',
        type: 'select',
        options: ['Map', 'Filter', 'Reduce', 'Custom'],
        default: 'Map'
      },
      {
        key: 'expression',
        label: 'JavaScript Expression',
        type: 'textarea',
        default: 'item => item',
        placeholder: 'item => ({ ...item, processed: true })'
      },
      {
        key: 'outputFormat',
        label: 'Output Format',
        type: 'select',
        options: ['JSON', 'Array', 'String', 'Number'],
        default: 'JSON'
      }
    ];
  }

  getHandles() {
    return [
      {
        type: 'target',
        position: HandlePosition.LEFT,
        id: (id) => `${id}-data`
      },
      {
        type: 'source',
        position: HandlePosition.RIGHT,
        id: (id) => `${id}-transformed`
      }
    ];
  }

  transformData(data) {
    const expression = data.expression || this.getFieldValue('expression');
    return {
      ...data,
      compiledExpression: this.compileExpression(expression)
    };
  }

  compileExpression(expr) {
    try {
      // In a real implementation, you'd use a safe evaluation method
      return new Function('data', `return (${expr})(data)`);
    } catch (error) {
      return null;
    }
  }
}
