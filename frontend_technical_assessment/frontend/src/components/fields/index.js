import NumberField from './NumberField';
import SelectField from './SelectField';
import RangeField from './RangeField';
import TextAreaField from './TextAreaField';
import BaseInputField from './BaseInputField';

const fieldRegistry = {
  text: BaseInputField,
  number: NumberField,
  select: SelectField,
  range: RangeField,
  textarea: TextAreaField,
};

export default fieldRegistry;
