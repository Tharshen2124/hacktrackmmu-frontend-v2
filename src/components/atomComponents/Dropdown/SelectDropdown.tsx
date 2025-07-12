import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface SearchableDropdownProps {
  label: string;
  id: string;
  name: string;
  placeholder?: string;
  options: { id: string; name: string }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const SearchableDropdown = ({
  label,
  id,
  name,
  placeholder = "Search and select an option",
  options,
  value,
  onChange,
  className = "",
}: SearchableDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((option) => option.id === value);

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    // Reset highlighted index when filtered options change
    setHighlightedIndex(filteredOptions.length > 0 ? 0 : -1);
  }, [filteredOptions]);

  // Open dropdown when focusing on input
  const handleFocus = () => {
    setIsOpen(true);
  };

  const handleSelect = (optionId: string) => {
    const option = options.find((opt) => opt.id === optionId);
    onChange(optionId);
    setSearchTerm(option ? option.name : "");
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);

    // If input is cleared and there was a selected value, clear the selection
    if (e.target.value === "" && value) {
      onChange("");
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);

        // Reset search term to selected option name or empty if nothing selected
        if (selectedOption) {
          setSearchTerm(selectedOption.name);
        } else if (searchTerm && !value) {
          setSearchTerm("");
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedOption, searchTerm, value]);

  // Set initial search term when selected value changes
  useEffect(() => {
    if (selectedOption && !isOpen) {
      setSearchTerm(selectedOption.name);
    }
  }, [selectedOption, isOpen]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen && (e.key === "ArrowDown" || e.key === "Enter")) {
      setIsOpen(true);
      return;
    }

    if (!isOpen) return;

    switch (e.key) {
      case "Escape":
        setIsOpen(false);
        inputRef.current?.blur();
        break;
      case "ArrowDown":
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev,
        );
        e.preventDefault();
        break;
      case "ArrowUp":
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        e.preventDefault();
        break;
      case "Enter":
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex].id);
          e.preventDefault();
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label htmlFor={id} className="font-semibold">
        {label}
      </label>
      <div className="relative mt-1">
        <input
          ref={inputRef}
          id={id}
          type="text"
          autoComplete="off"
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-controls={`${id}-options`}
          aria-activedescendant={
            highlightedIndex >= 0
              ? `${id}-option-${highlightedIndex}`
              : undefined
          }
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full rounded-md border border-input bg-background px-4 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:bg-[#333] dark:border-[#555] focus:ring-blue-400 dark:focus:ring-blue-500 ${className}`}
        />
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          onClick={() => {
            setIsOpen(!isOpen);
            if (!isOpen) inputRef.current?.focus();
          }}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
        >
          <ChevronDown
            className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {isOpen && (
        <ul
          id={`${id}-options`}
          role="listbox"
          aria-labelledby={`${id}-label`}
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-input bg-background py-1 shadow-lg dark:bg-[#333] dark:border-[#555]"
        >
          {filteredOptions.length === 0 ? (
            <li className="px-4 py-2 text-muted-foreground">
              No matches found
            </li>
          ) : (
            filteredOptions.map((option, index) => (
              <li
                key={option.id}
                id={`${id}-option-${index}`}
                role="option"
                aria-selected={value === option.id}
                className={`px-4 py-2 cursor-pointer ${
                  highlightedIndex === index ? "bg-primary/10" : ""
                } ${value === option.id ? "bg-primary/20" : ""} hover:bg-primary/10`}
                onClick={() => handleSelect(option.id)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                {option.name}
              </li>
            ))
          )}
        </ul>
      )}

      {/* Hidden native select for form submission */}
      <select
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="sr-only"
        aria-hidden="true"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
};
