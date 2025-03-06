import { useState } from "react"

interface ToggleSwitchProps {
    initialState?: boolean
    onToggle?: (isOn: boolean) => void
    label?: string
    disabled?: boolean
  }
  
  export default function ToggleSwitch({
    initialState = false,
    onToggle,
    label = "Toggle",
    disabled = false,
  }: ToggleSwitchProps) {
    const [isOn, setIsOn] = useState(initialState)
  
    const handleToggle = () => {
      if (disabled) return
  
      const newState = !isOn
      setIsOn(newState)
      onToggle?.(newState)
    }
  
    return (
      <div className="flex items-center gap-2">
        {label && (
          <label htmlFor="toggle-switch" className="text-sm font-medium cursor-pointer">
            {label}
          </label>
        )}
        <button
          id="toggle-switch"
          type="button"
          role="switch"
          aria-checked={isOn}
          disabled={disabled}
          onClick={handleToggle}
          className={`
            relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent 
            transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            ${isOn ? "bg-blue-600" : "bg-gray-200"} 
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          <span className="sr-only">Use setting</span>
          <span
            aria-hidden="true"
            className={`
              pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
              transition duration-200 ease-in-out
              ${isOn ? "translate-x-5" : "translate-x-0"}
            `}
          />
        </button>
      </div>
    )
  }
  
  