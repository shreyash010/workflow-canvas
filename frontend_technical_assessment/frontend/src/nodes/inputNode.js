import { BaseNode, HandlePosition } from './baseNode';
import { FileInput } from 'lucide-react';

export class InputNode extends BaseNode {

  getBasicNodeInfo(){
    return{
      title: 'Input',
      category: 'Start',
      icon: FileInput,
      description: 'This is the starting input node that can be used to pass user query'
    }
  }

  getFields() {
    return [
      {
        key: 'inputName',
        label: 'Name',
        type: 'text',
        default: (id) => id.replace('customInput-', 'input_'),
        required: true
      },
      {
        key: 'inputType',
        label: 'Type',
        type: 'select',
        options: ['Text', 'File'],
        default: 'Text',
      },
    ];
  }

  getHandles() {
    return [
      {
        type: 'source',
        position: HandlePosition.RIGHT,
        id: (id) => `${id}-value`,
      },
    ];
  }
}