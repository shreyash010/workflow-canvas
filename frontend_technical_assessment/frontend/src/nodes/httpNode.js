import { BaseNode, HandlePosition } from './baseNode';
import { Globe } from 'lucide-react';

export class HttpRequestNode extends BaseNode {
  getBasicNodeInfo() {
    return {
      title: 'HTTP Request',
      category: 'API',
      icon: Globe,
      description: 'Make HTTP requests to external APIs and services'
    };
  }

  getFields() {
    return [
      {
        key: 'method',
        label: 'Method',
        type: 'select',
        options: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        default: 'GET'
      },
      {
        key: 'url',
        label: 'URL',
        type: 'text',
        default: '',
        placeholder: 'https://api.example.com/endpoint',
        required: true
      },
      {
        key: 'headers',
        label: 'Headers',
        type: 'textarea',
        default: '{}',
        placeholder: '{"Authorization": "Bearer {{token}}", "Content-Type": "application/json"}'
      },
      {
        key: 'body',
        label: 'Request Body',
        type: 'textarea',
        default: '',
        placeholder: 'JSON body for POST/PUT requests'
      },
      {
        key: 'timeout',
        label: 'Timeout (seconds)',
        type: 'number',
        default: 30,
        min: 1,
        max: 300
      }
    ];
  }

  getHandles() {
    return [
      {
        type: 'target',
        position: HandlePosition.LEFT,
        id: (id) => `${id}-trigger`,
        label: 'Trigger',
        inputType: 'trigger',
        description: 'Trigger the HTTP request'
      },
      {
        type: 'source',
        position: HandlePosition.RIGHT,
        id: (id) => `${id}-response`,
        label: 'Response',
        outputType: 'response',
        description: 'Successful HTTP response data'
      },
      {
        type: 'source',
        position: HandlePosition.BOTTOM,
        id: (id) => `${id}-error`,
        label: 'Error',
        outputType: 'error',
        description: 'Error information if request fails'
      }
    ];
  }

  validate() {
    const url = this.getFieldValue('url');
    const errors = [];
    
    if (!url) {
      errors.push('URL is required');
    } else if (!url.startsWith('http')) {
      errors.push('URL must start with http:// or https://');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  async execute(inputs) {
    const url = this.getFieldValue('url');
    const method = this.getFieldValue('method');
    const headers = JSON.parse(this.getFieldValue('headers') || '{}');
    const body = this.getFieldValue('body');
    const timeout = this.getFieldValue('timeout') * 1000;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        method,
        headers,
        body: method !== 'GET' ? body : undefined,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return { response: data };
    } catch (error) {
      return { error: error.message };
    }
  }
}