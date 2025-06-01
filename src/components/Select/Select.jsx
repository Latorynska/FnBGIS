import React from "react";
import "./GlassSelect.css"; // Contains custom glass style for options

const Select = ({label,value,onChange,options = [],children,placeholder = "Select a category",}) => {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-1">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 rounded-lg bg-white/20 backdrop-blur-md text-white shadow-lg border border-white/30 focus:outline-none"
      >
        <option disabled value="">
          {placeholder}
        </option>

        {children
          ? children
          : options.map((opt, index) => (
              <option
                key={index}
                value={typeof opt === "string" ? opt : opt.value}
                className="glass-option text-gray-900"
              >
                {typeof opt === "string" ? opt : opt.label}
              </option>
            ))}
      </select>
    </div>
  );
};

export default Select;
