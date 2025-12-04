
import React from 'react';
import { type FormDataType, type AamvaFieldDescription, USState } from '../types';
import { AAMVA_FIELD_DEFINITIONS, FIELD_GROUPS, STATE_IIN_MAP } from '../constants';
import { InputField } from './InputField';
import { SelectField } from './SelectField';
import { Section } from './Section';
import { GenerateIcon } from './Icons';

interface DataInputFormProps {
  formData: FormDataType;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
  onSubmit: () => void;
  isGenerating: boolean;
}

export const DataInputForm: React.FC<DataInputFormProps> = ({ formData, setFormData, onSubmit, isGenerating }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newValues = { ...prev, [name]: value };
      if (name === 'DAJ') {
        const selectedState = value as USState;
        const newIIN = STATE_IIN_MAP[selectedState] || '';
        newValues.issuerIdNumber = newIIN;
      }
      return newValues;
    });
  };

  const renderField = (fieldDef: AamvaFieldDescription) => {
    const key = fieldDef.id as keyof FormDataType; // Type assertion
    if (fieldDef.type === 'select' && fieldDef.options) {
      return (
        <SelectField
          key={fieldDef.id}
          id={fieldDef.id}
          label={fieldDef.label}
          value={formData[key] || ''}
          onChange={handleChange}
          options={fieldDef.options}
          tooltipText={fieldDef.tooltip}
          required={fieldDef.required}
        />
      );
    }
    return (
      <InputField
        key={fieldDef.id}
        id={fieldDef.id}
        label={fieldDef.label}
        type={fieldDef.type || 'text'}
        value={formData[key] || ''}
        onChange={handleChange}
        placeholder={fieldDef.placeholder || ''}
        tooltipText={fieldDef.tooltip}
        required={fieldDef.required}
        maxLength={fieldDef.maxLength}
        pattern={fieldDef.pattern}
        readOnly={!!fieldDef.readOnly} // Use readOnly from field definition
      />
    );
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-8">
      {FIELD_GROUPS.map(groupName => (
        <Section key={groupName} title={groupName}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {AAMVA_FIELD_DEFINITIONS
              .filter(field => field.group === groupName)
              .flatMap(fieldDef => { // Use flatMap to potentially insert more elements
                const components = [renderField(fieldDef)];
                if (fieldDef.id === 'DAJ' && formData.DAJ && !formData.issuerIdNumber) {
                  components.push(
                    <div key={`${fieldDef.id}-warning`} className="md:col-span-2 text-xs text-amber-400 pt-1">
                      <p>
                        The Issuer ID Number (IIN) could not be found for the selected state ({formData.DAJ}).
                        Barcode generation is disabled until a state with a configured IIN is chosen or the application's configuration is updated.
                      </p>
                    </div>
                  );
                }
                return components;
              })}
          </div>
        </Section>
      ))}
      
      <div className="mt-8 pt-6 border-t border-slate-700">
        <button
          type="submit"
          disabled={isGenerating || !formData.issuerIdNumber} // Disable button if IIN is missing
          className="w-full flex items-center justify-center px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg shadow-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <GenerateIcon className="w-5 h-5 mr-2" />
              Generate Barcode
            </>
          )}
        </button>
      </div>
    </form>
  );
};
