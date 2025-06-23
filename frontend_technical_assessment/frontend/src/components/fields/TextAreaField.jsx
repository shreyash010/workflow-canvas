import { VariableTextArea } from '../VariableTextArea';

export default function TextAreaField({ 
  value, 
  onChange, 
  fieldKey, 
  placeholder, 
  currentNodeId,
  ...props 
}) {
  const handleChange = (newValue) => {
    onChange(fieldKey, newValue);
  };

  return (
    <VariableTextArea
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      currentNodeId={currentNodeId}
      maxLines={7}
      className={'input-base'}
      {...props}
    />
  );
};