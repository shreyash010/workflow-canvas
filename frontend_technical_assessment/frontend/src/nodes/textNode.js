import { BaseNode, HandlePosition } from './baseNode';
import { FileText } from 'lucide-react';

export class TextNode extends BaseNode {

  getBasicNodeInfo(){
    return{
      title: 'Text',
      category: 'Transform',
      icon: FileText,
      description: 'text node can enter text here that can be used by next node'
    }
  }

  getFields() {
    return [
      {
        key: 'text',
        label: 'Text',
        type: 'textarea',
        default: '',
        placeholder: 'Enter text with variables like {{input}}'
      },
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
        id: (id) => `${id}-output`,
      },
    ];
  }

  // Override to process template variables
  transformData(data) {
    return {
      ...data,
      processedText: this.processTemplate(data.text || this.getFieldValue('text'))
    };
  }

  processTemplate(text) {
    // Simple template processing - can be enhanced
    return text.replace(/\{\{(\w+)\}\}/g, (match, variable) => {
      // This would be replaced with actual variable values during execution
      return `[${variable}]`;
    });
  }
}