import { useState, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";

interface MultiSelectDropdownProps {
  label: string;
  id: string;
  name: string;
  placeholder?: string;
  options: { id: string; name: string }[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  className?: string;
}

export const MultiSelectDropdown = ({
  label,
  id,
  name,
  placeholder = "Search and select options",
  options,
  selectedValues,
  onChange,
  className = "",
}: MultiSelectDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get selected options objects
  const selectedOptions = options.filter((option) =>
    selectedValues.includes(option.id),
  );

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
    // Toggle selection
    const newSelectedValues = selectedValues.includes(optionId)
      ? selectedValues.filter((id) => id !== optionId) // Remove if already selected
      : [...selectedValues, optionId]; // Add if not selected

    onChange(newSelectedValues);
    setSearchTerm(""); // Clear search after selection
    // Keep dropdown open for additional selections
  };

  const handleRemoveSelection = (optionId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent dropdown from opening
    onChange(selectedValues.filter((id) => id !== optionId));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm(""); // Clear search term when closing
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        setSearchTerm("");
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

      {/* Selected items tags */}
      {selectedOptions.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedOptions.map((option) => (
            <div
              key={option.id}
              className="flex items-center gap-1 rounded-md bg-blue-100 px-2 py-1 text-sm dark:bg-blue-900/30"
            >
              <span>{option.name}</span>
              <button
                type="button"
                onClick={(e) => handleRemoveSelection(option.id, e)}
                className="ml-1 rounded-full p-0.5 hover:bg-blue-200 dark:hover:bg-blue-800"
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {option.name}</span>
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="relative mt-2">
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
          placeholder={selectedOptions.length > 0 ? "Add more..." : placeholder}
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
          aria-multiselectable="true"
          aria-labelledby={`${id}-label`}
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-input bg-background py-1 shadow-lg dark:bg-[#333] dark:border-[#555]"
        >
          {filteredOptions.length === 0 ? (
            <li className="px-4 py-2 text-muted-foreground">
              No matches found
            </li>
          ) : (
            filteredOptions.map((option, index) => {
              const isSelected = selectedValues.includes(option.id);
              return (
                <li
                  key={option.id}
                  id={`${id}-option-${index}`}
                  role="option"
                  aria-selected={isSelected}
                  className={`px-4 py-2 cursor-pointer flex items-center ${
                    highlightedIndex === index ? "bg-primary/10" : ""
                  } ${isSelected ? "bg-primary/20" : ""} hover:bg-primary/10`}
                  onClick={() => handleSelect(option.id)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  <div className="mr-2 h-4 w-4 rounded border border-primary flex-shrink-0 flex items-center justify-center">
                    {isSelected && (
                      <div className="h-2 w-2 rounded-sm bg-primary"></div>
                    )}
                  </div>
                  {option.name}
                </li>
              );
            })
          )}
        </ul>
      )}

      {/* Hidden inputs for form submission */}
      {selectedValues.map((value) => (
        <input key={value} type="hidden" name={`${name}[]`} value={value} />
      ))}
    </div>
  );
};
