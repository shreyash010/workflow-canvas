import { BaseNode, HandlePosition } from './baseNode';
import { Bot } from 'lucide-react';

export class LLMNode extends BaseNode {

  getBasicNodeInfo(){
    return {
      title: 'LLM',
      category: 'LLMs',
      icon: Bot,
      description: 'In this node you can select the llm you want to use and also add system prompt'
    }
  }

  getFields() {
    return [
      {
        key: 'llm',
        label: 'Select LLM',
        type: 'select',
        options: ['OpenAI', 'Claude', 'Gemini'],
        default: 'OpenAI'
      },
      {
        key: 'system_prompt',
        label: 'System Prompt',
        type: 'textarea',
        default: '',
        placeholder: "Answer the queestions based on context" 
      },
      {
        key: 'prompt',
        label: 'Prompt',
        type: 'textarea',
        default: '',
        placeholder: "Enter the prompt for llm use '{{' for adding variables"
      }
    ];
  }

  getHandles() {
    return [
      {
        type: 'target',
        position: HandlePosition.LEFT,
        id: (id) => `${id}-prompt`
      },
      {
        type: 'source',
        position: HandlePosition.RIGHT,
        id: (id) => `${id}-response`
      }
    ];
  }
}