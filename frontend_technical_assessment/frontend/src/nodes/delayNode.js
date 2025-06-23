import { BaseNode, HandlePosition } from './baseNode';
import { Clock } from 'lucide-react';

export class DelayNode extends BaseNode {
  getBasicNodeInfo() {
    return {
      title: 'Delay',
      category: 'Control',
      icon: Clock,
      description: 'Add delays or wait conditions to control workflow timing'
    };
  }

  getFields() {
    return [
      {
        key: 'delayType',
        label: 'Delay Type',
        type: 'select',
        options: ['Fixed Time', 'Until Condition', 'Until Time'],
        default: 'Fixed Time'
      },
      {
        key: 'duration',
        label: 'Duration',
        type: 'number',
        default: 5,
        min: 1,
        max: 3600
      },
      {
        key: 'unit',
        label: 'Time Unit',
        type: 'select',
        options: ['Seconds', 'Minutes', 'Hours'],
        default: 'Seconds'
      },
      {
        key: 'condition',
        label: 'Wait Condition',
        type: 'textarea',
        default: '',
        placeholder: 'Condition to wait for (when using Until Condition)'
      },
      {
        key: 'maxWait',
        label: 'Max Wait Time (seconds)',
        type: 'number',
        default: 300,
        min: 1,
        max: 86400
      }
    ];
  }

  getHandles() {
    return [
      {
        type: 'target',
        position: HandlePosition.LEFT,
        id: (id) => `${id}-trigger`
      },
      {
        type: 'source',
        position: HandlePosition.RIGHT,
        id: (id) => `${id}-continue`
      },
      {
        type: 'source',
        position: HandlePosition.BOTTOM,
        id: (id) => `${id}-timeout`
      }
    ];
  }
}