import "./GlassSelect.css"; // Jika tetap ingin gunakan untuk glass-style

const Select = ({
  label,
  value,
  onChange,
  options = [],
  children,
  placeholder = "Select a category",
  variant = "glass",
}) => {
  const selectClassName =
    variant === "glass"
      ? "w-full px-4 py-2 rounded-lg bg-white/20 backdrop-blur-md text-white shadow-lg border border-white/30 focus:outline-none"
      : "bg-gray-800 text-white text-sm px-3 py-1 rounded focus:outline-none";

  return (
    <div>
      {label && <label className="block text-sm text-gray-400 mb-1">{label}</label>}
      <select value={value} onChange={onChange} className={selectClassName}>
        <option disabled value="">
          {placeholder}
        </option>
        {children
          ? children
          : options.map((opt, index) => (
              <option
                key={index}
                value={typeof opt === "string" ? opt : opt.value}
                className={variant === "glass" ? "glass-option text-gray-900" : "text-white"}
              >
                {typeof opt === "string" ? opt : opt.label}
              </option>
            ))}
      </select>
    </div>
  );
};

export default Select;
