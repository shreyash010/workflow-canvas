import { BaseNode, HandlePosition } from './baseNode';
import { Send } from 'lucide-react';

export class OutputNode extends BaseNode {

  getBasicNodeInfo(){
    return {
      title: 'Output',
      category: 'Output',
      icon: Send,
      desciption: 'this is a output node where you can manage or modify output required by you'
    }
  }

  getFields() {
    return [
      {
        key: 'outputName',
        label: 'Name',
        type: 'text',
        default: (id) => id.replace('customOutput-', 'output_'),
        required: true
      },
      {
        key: 'outputType',
        label: 'Type',
        type: 'select',
        options: ['Text', 'File', 'Image'],
        default: 'Text',
      },
    ];
  }

  getHandles() {
    return [
      {
        type: 'target',
        position: HandlePosition.LEFT,
        id: (id) => `${id}-value`,
      },
    ];
  }
}