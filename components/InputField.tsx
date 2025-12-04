
import React from 'react';
import { InfoIcon } from './Icons';

interface InputFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  tooltipText?: string;
  required?: boolean;
  maxLength?: number;
  pattern?: string;
  min?: string | number;
  max?: string | number;
  readOnly?: boolean; // Added readOnly prop
}

export const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  tooltipText,
  required,
  maxLength,
  pattern,
  min,
  max,
  readOnly, // Destructure readOnly
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
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        pattern={pattern}
        min={min}
        max={max}
        readOnly={readOnly} // Apply readOnly to input element
        className={`w-full px-3 py-2 border border-slate-600 rounded-md shadow-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 placeholder-slate-500 ${
          readOnly ? 'bg-slate-600 cursor-not-allowed' : 'bg-slate-700'
        }`}
      />
    </div>
  );
};
