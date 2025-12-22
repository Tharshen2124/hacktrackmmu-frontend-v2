interface SelectorOption {
  value: string;
  label: string;
}

interface SelectorProps {
  label: string;
  options: SelectorOption[];
  value?: string;
  onChange: (value: string) => void;
}

export default function Selector({
  label,
  options,
  value,
  onChange,
}: SelectorProps) {
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
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
