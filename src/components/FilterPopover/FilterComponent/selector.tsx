export default function Selector({
  label,
  selection,
  value,
  onChange,
}: {
  label: string;
  selection: string[];
  value?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select 
        className="w-full p-2 border border-gray-300 rounded-md text-gray-700"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      >
        {selection.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}