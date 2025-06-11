export class BaseNode {
  constructor(id, data = {}) {
    this.id = id;
    this.data = { ...this.getDefaultData(), ...data };
  }

  getBasicNodeInfo(){
    return {
      Title: 'Base',
      Category:'',
      Icon: '',
      description: ''
    }
  }

  getFields() {
    return [];
  }

  getHandles() {
    return [];
  }

  // Get default data for all fields
  getDefaultData() {
    const defaults = {};
    this.getFields().forEach(field => {
      defaults[field.key] = this.getDefaultValue(field);
    });
    return defaults;
  }

  getDefaultValue(field) {
    const def = field.default;
    return typeof def === 'function' ? def(this.id) : def;
  }

  // Handle field value changes - use onChange from data
  updateField(key, value) {
    if (this.data.onChange) {
      this.data.onChange(key, value);
    }
  }

  // Get current field value with fallback to default
  getFieldValue(fieldKey) {
    return this.data[fieldKey] ?? this.getDefaultValue(
      this.getFields().find(f => f.key === fieldKey)
    );
  }

  // Optional data transformation before processing
  transformData(data) {
    return data;
  }

  // Validation method that can be overridden
  validate() {
    return { isValid: true, errors: [] };
  }

  async execute(inputs) {
    throw new Error('Execute method must be implemented in child classes');
  }
}

export const HandlePosition = {
  LEFT: 'Left',
  RIGHT: 'Right',
  TOP: 'Top',
  BOTTOM: 'Bottom'
};