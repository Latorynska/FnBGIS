import React, { useState } from "react";

const MonthSelector = ({ selectedMonth, onSelect }) => {
  const months = [
    "JAN", "FEB", "MAR", "APR",
    "MEI", "JUN", "JUL", "AGU",
    "SEP", "OKT", "NOV", "DES",
  ];

  return (
    <div className="grid grid-cols-3 gap-2">
      {months.map((month, index) => (
        <button
          key={index}
          onClick={() => onSelect(month)}
          className={`text-sm px-4 py-2 rounded font-medium border 
            ${selectedMonth === month
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-gray-800 text-white border-gray-600 hover:bg-gray-700"}`}
        >
          {month}
        </button>
      ))}
    </div>
  );
};

export default MonthSelector;