import { Database } from 'lucide-react';
import { BaseNode, HandlePosition } from './baseNode';

export class DatabaseNode extends BaseNode {
  getBasicNodeInfo() {
    return {
      title: 'Database',
      category: 'Data',
      icon: Database,
      description: 'Execute database queries and manage data persistence'
    };
  }

  getFields() {
    return [
      {
        key: 'operation',
        label: 'Operation',
        type: 'select',
        options: ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CUSTOM'],
        default: 'SELECT'
      },
      {
        key: 'table',
        label: 'Table Name',
        type: 'text',
        default: '',
        placeholder: 'users, products, orders...',
        required: true
      },
      {
        key: 'query',
        label: 'SQL Query',
        type: 'textarea',
        default: '',
        placeholder: 'SELECT * FROM users WHERE status = {{status}}'
      },
      {
        key: 'connection',
        label: 'Connection String',
        type: 'text',
        default: '',
        placeholder: 'Database connection identifier'
      },
      {
        key: 'parameters',
        label: 'Parameters',
        type: 'textarea',
        default: '{}',
        placeholder: '{"status": "active", "limit": 10}'
      }
    ];
  }

  getHandles() {
    return [
      {
        type: 'target',
        position: HandlePosition.LEFT,
        id: (id) => `${id}-execute`
      },
      {
        type: 'source',
        position: HandlePosition.RIGHT,
        id: (id) => `${id}-result`
      },
      {
        type: 'source',
        position: HandlePosition.BOTTOM,
        id: (id) => `${id}-error`
      }
    ];
  }

  validate() {
    const table = this.getFieldValue('table');
    const query = this.getFieldValue('query');
    const operation = this.getFieldValue('operation');
    const errors = [];
    
    if (!table && operation !== 'CUSTOM') {
      errors.push('Table name is required');
    }
    
    if (operation === 'CUSTOM' && !query) {
      errors.push('Custom query is required when operation is CUSTOM');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  transformData(data) {
    const operation = data.operation || this.getFieldValue('operation');
    const table = data.table || this.getFieldValue('table');
    const query = data.query || this.getFieldValue('query');
    
    let generatedQuery = query;
    
    // Auto-generate simple queries if not custom
    if (operation !== 'CUSTOM' && table && !query) {
      switch (operation) {
        case 'SELECT':
          generatedQuery = `SELECT * FROM ${table}`;
          break;
        case 'INSERT':
          generatedQuery = `INSERT INTO ${table} ({{columns}}) VALUES ({{values}})`;
          break;
        case 'UPDATE':
          generatedQuery = `UPDATE ${table} SET {{updates}} WHERE {{condition}}`;
          break;
        case 'DELETE':
          generatedQuery = `DELETE FROM ${table} WHERE {{condition}}`;
          break;
      }
    }
    
    return {
      ...data,
      generatedQuery,
      processedQuery: this.processTemplate(generatedQuery)
    };
  }

  processTemplate(query) {
    return query.replace(/\{\{(\w+)\}\}/g, (match, variable) => {
      return `$${variable}`;
    });
  }
}
