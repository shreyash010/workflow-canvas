export default function NumberField({ value, onChange, fieldKey, min = 0, max = 100, step = 1 }) {
  return (
    <input
      type="number"
      value={value}
      onChange={e => onChange(fieldKey, parseFloat(e.target.value) || 0)}
      min={min}
      max={max}
      step={step}
      className='input-base'
    />
  );
}