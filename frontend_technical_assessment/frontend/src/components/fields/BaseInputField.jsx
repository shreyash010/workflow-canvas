export default function BaseInputField({ value, onChange, fieldKey, placeholder = '' }) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(fieldKey, e.target.value)}
      placeholder={placeholder}
      className='input-base'
    />
  );
}