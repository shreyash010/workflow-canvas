export default function RangeField({ value, onChange, fieldKey, min = 0, max = 1, step = 0.01 }) {
  return (
    <div className="w-full">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(fieldKey, parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
      />
      <div className="text-xs text-gray-500 mt-1 text-center">{value}</div>
    </div>
  );
}