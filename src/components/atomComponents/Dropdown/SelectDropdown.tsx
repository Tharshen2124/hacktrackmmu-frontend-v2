import { useState, useRef, useEffect, useMemo } from "react"; // Add useMemo
import { ChevronDown } from "lucide-react";

interface Option {
  id: string;
  name?: string;
  date?: string;
}

interface Group {
  label: string;
  options: Option[];
}

interface SearchableDropdownProps {
  label: string;
  id: string;
  name: string;
  placeholder?: string;
  options?: Option[];
  groups?: Group[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  displayKey?: "name" | "date";
}

export const SearchableDropdown = ({
  label,
  id,
  name,
  placeholder = "Search and select an option",
  options = [],
  groups = [],
  value,
  onChange,
  className = "",
  displayKey = "name",
}: SearchableDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Helper function to get the display value from an option
  const getOptionDisplayName = (option: Option) => {
    // If date is chosen as displayKey, format it as needed
    if (displayKey === "date" && option.date) {
      try {
        // Attempt to parse and format date for display
        const dateObj = new Date(option.date);
        // Example: "July 14, 2025" or "2025-07-14"
        return dateObj.toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      } catch (e) {
        // Invalid date format - silently fallback to raw date string
        return option.date; // Fallback to raw date string if invalid
      }
    }
    // Default to name or fallback if name is not available
    return option.name || option.date || option.id; // Fallback to id if neither name nor date
  };

  // Flatten options for easy lookup, handling both groups and flat options
  const allOptions = useMemo(() => {
    if (groups.length > 0) {
      return groups.flatMap((group) => group.options);
    }
    return options || [];
  }, [options, groups]);

  // Find the selected option using the `value` (which is an `id`)
  const selectedOption = useMemo(
    () => allOptions.find((option) => option.id === value),
    [allOptions, value],
  );

  // Filter options/groups based on search term
  const filteredItems = useMemo(() => {
    const term = searchTerm.toLowerCase();
    const selectedDisplayName = selectedOption
      ? getOptionDisplayName(selectedOption).toLowerCase()
      : "";
    const showAll = term === "" || term === selectedDisplayName;

    if (groups.length > 0) {
      const result: (Option | { type: "header"; label: string })[] = [];
      groups.forEach((group) => {
        const matchingOptions = group.options.filter(
          (option) =>
            showAll ||
            getOptionDisplayName(option).toLowerCase().includes(term),
        );
        if (matchingOptions.length > 0) {
          result.push({ type: "header", label: group.label });
          result.push(...matchingOptions);
        }
      });
      return result;
    } else {
      return (options || []).filter(
        (option) =>
          showAll || getOptionDisplayName(option).toLowerCase().includes(term),
      );
    }
  }, [options, groups, searchTerm, selectedOption]);

  useEffect(() => {
    const firstSelectableIndex = filteredItems.findIndex(
      (item) => !("type" in item && (item as any).type === "header"),
    );
    setHighlightedIndex(
      firstSelectableIndex !== -1 ? firstSelectableIndex : -1,
    );
  }, [filteredItems]);

  // Open dropdown when focusing on input
  const handleFocus = () => {
    setIsOpen(true);
  };

  const handleSelect = (optionId: string) => {
    const option = allOptions.find((opt) => opt.id === optionId);
    onChange(optionId);
    // Set search term to the display name of the selected option
    setSearchTerm(option ? getOptionDisplayName(option) : "");
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
          setSearchTerm(getOptionDisplayName(selectedOption));
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
      setSearchTerm(getOptionDisplayName(selectedOption));
    } else if (!selectedOption && !isOpen && !value) {
      setSearchTerm("");
    }
  }, [selectedOption, isOpen, value]);

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
        e.preventDefault();
        setHighlightedIndex((prev) => {
          let next = prev + 1;
          while (
            next < filteredItems.length &&
            "type" in filteredItems[next] &&
            (filteredItems[next] as any).type === "header"
          ) {
            next++;
          }
          return next < filteredItems.length ? next : prev;
        });
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => {
          let next = prev - 1;
          while (
            next >= 0 &&
            "type" in filteredItems[next] &&
            (filteredItems[next] as any).type === "header"
          ) {
            next--;
          }
          return next >= 0 ? next : prev;
        });
        break;
      case "Enter":
        if (highlightedIndex >= 0 && filteredItems[highlightedIndex]) {
          const item = filteredItems[highlightedIndex];
          if (!("type" in item)) {
            // Ensure it's not a header
            handleSelect((item as Option).id);
            e.preventDefault();
          }
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
          className={`w-full rounded-md border border-input border-gray-300 bg-background px-4 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:bg-[#333] dark:border-[#555] focus:ring-blue-400 dark:focus:ring-blue-500 ${className}`}
        />
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          onClick={() => {
            setIsOpen(!isOpen);
            if (!isOpen) inputRef.current?.focus();
          }}
          className="absolute inset-y-0 right-0 flex items-center px-3 ml-2 text-gray-500"
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
          {filteredItems.length === 0 ? (
            <li className="px-4 py-2 text-muted-foreground">
              No matches found
            </li>
          ) : (
            filteredItems.map((item, index) => {
              if ("type" in item && (item as any).type === "header") {
                return (
                  <li
                    key={`header-${index}`}
                    className="px-3 py-3 text-xl font-bold text-muted-foreground bg-muted/50 dark:bg-muted/20 text-gray-400"
                  >
                    {(item as any).label}
                  </li>
                );
              }
              const option = item as Option;
              return (
                <li
                  key={option.id}
                  id={`${id}-option-${index}`}
                  role="option"
                  aria-selected={value === option.id}
                  className={`px-4 py-2 cursor-pointer ${
                    highlightedIndex === index ? "bg-primary/10" : ""
                  } ${value === option.id ? "bg-primary/20" : ""} hover:bg-primary/10 ${groups.length > 0 ? "pl-6" : ""}`}
                  onClick={() => handleSelect(option.id)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  {getOptionDisplayName(option)}
                </li>
              );
            })
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
        {allOptions.map((option) => (
          <option key={option.id} value={option.id}>
            {getOptionDisplayName(option)}
          </option>
        ))}
      </select>
    </div>
  );
};
