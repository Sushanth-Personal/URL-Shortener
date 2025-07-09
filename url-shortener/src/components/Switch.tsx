"use client";

import { useState } from "react";

// Define props interface
interface SwitchProps {
  initialChecked?: boolean;
  onChange?: (state: boolean) => void;
}

const Switch: React.FC<SwitchProps> = ({ initialChecked = true, onChange }) => {
  const [checked, setChecked] = useState<boolean>(initialChecked);

  const handleToggle = () => {
    const newState = !checked;
    setChecked(newState);
    if (onChange) {
      onChange(newState);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <button
        id="custom-switch"
        className={`relative flex items-center justify-center w-11 h-6 rounded-[43px] border-none outline-none cursor-pointer transition-colors ${
          checked ? "bg-blue-600" : "bg-gray-400"
        }`}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={handleToggle}
      >
        <div
          className={`absolute top-0 left-1 right-1 w-[calc(100%-0.5rem)] h-full flex items-center transition-all ${
            checked ? "justify-end" : "justify-start"
          }`}
        >
          <div className="w-5 h-5 bg-white rounded-full shadow-md transition-transform" />
        </div>
      </button>
    </div>
  );
};

export default Switch;