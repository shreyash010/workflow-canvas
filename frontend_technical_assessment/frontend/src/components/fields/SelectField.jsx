export default function SelectField({ value, onChange, fieldKey, options = [] }) {
  return (
    <select
      value={value}
      onChange={e => onChange(fieldKey, e.target.value)}
      className='input-base'
    >
      {options.map(opt => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}