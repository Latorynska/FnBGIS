import { useState } from 'react';

const TextInput = ({ 
  label, 
  value, 
  onChange, 
  name, 
  type = 'text', 
  placeholder = '', 
  hint = '',
  ...props 
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="w-full relative">
      {label && (
        <label className="text-sm text-gray-400 mb-1 flex items-center gap-1" htmlFor={name}>
          {label}
          {hint && (
            <div
              className="relative flex items-center"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <i className="fas fa-question-circle text-xs text-gray-400 cursor-pointer" />
              {showTooltip && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-max max-w-xs bg-gray-800 text-gray-100 text-xs px-3 py-2 rounded shadow-lg z-10">
                  {hint}
                </div>
              )}
            </div>
          )}
        </label>
      )}
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="input-field w-full px-4 py-2 rounded-lg"
        {...props}
      />
    </div>
  );
};

export default TextInput;
