
import React from 'react';
import { InfoIcon } from './Icons';

interface SelectFieldProps {
  id: string;
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string | number; label: string }[];
  tooltipText?: string;
  required?: boolean;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  id,
  label,
  value,
  onChange,
  options,
  tooltipText,
  required,
}) => {
  return (
    <div className="flex flex-col space-y-1">
      <label htmlFor={id} className="text-sm font-medium text-slate-300 flex items-center">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
        {tooltipText && (
          <div className="tooltip ml-2">
            <InfoIcon className="w-4 h-4 text-slate-400 hover:text-sky-400" />
            <span className="tooltiptext">{tooltipText}</span>
          </div>
        )}
      </label>
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
      >
        <option value="" disabled={required}>-- Select --</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
