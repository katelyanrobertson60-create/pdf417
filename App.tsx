import React, { useState, useCallback } from 'react';
import { DataInputForm } from './components/DataInputForm';
import { BarcodePreview } from './components/BarcodePreview';
import { type AamvaData, type FormDataType, EyeColor, Sex, USState, Truncation, ComplianceType } from './types';
import { formatAamvaDataString } from './services/aamvaFormatter';
import { generatePdf417Barcode } from './services/barcodeService';
import { DownloadIcon, ProcessingIcon } from './components/Icons';
import { STATE_IIN_MAP } from './constants';

const initialSelectedState = USState.GA;
const initialIIN = STATE_IIN_MAP[initialSelectedState] || '';

// --- NEW: Barcode config type ---
export interface BarcodeConfig {
  width: number;
  height: number;
  columns: number;
  rows: number;
  errorCorrectionLevel: number; // 0–8 for PDF417
}

const initialBarcodeConfig: BarcodeConfig = {
  width: 3,
  height: 10,
  columns: 6,
  rows: 0,          // 0 = auto
  errorCorrectionLevel: 2,
};

const initialFormData: FormDataType = {
  issuerIdNumber: initialIIN,
  aamvaVersion: '09',
  jurisdictionVersion: '01',
  DCS: 'WEAVER',
  DAC: 'JESSICA',
  DAD: 'LOUISE',
  DBB: '1982-07-09',
  DBC: Sex.FEMALE,
  DAY: EyeColor.GRN,
  DAG: '14023 TRIBUTARY LN',
  DAH: '',
  DAI: 'VILLA RICA',
  DAJ: initialSelectedState,
  DAK: '301804199',
  DCG: 'USA',
  DAQ: '061651368',
  DBD: '2019-09-28',
  DBA: '2027-07-09',
  DCA: 'C',
  DCB: 'B',
  DCD: 'NONE',
  DCF: '394647701140030775',
  heightFeet: '5',
  heightInches: '9',
  DAW: '170',
  DDE: Truncation.UNKNOWN,
  DDF: Truncation.UNKNOWN,
  DDG: Truncation.UNKNOWN,
  DDA: ComplianceType.F,
  DDB: '2019-01-02',
  DCK: '10000576974',
  DDK: '1',
};

// --- NEW: Barcode Config Panel component ---
interface BarcodeConfigPanelProps {
  config: BarcodeConfig;
  onChange: (updated: BarcodeConfig) => void;
}

const BarcodeConfigPanel: React.FC<BarcodeConfigPanelProps> = ({ config, onChange }) => {
  const field = (
    label: string,
    key: keyof BarcodeConfig,
    min: number,
    max: number,
    hint: string
  ) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
        {label}
        <span className="ml-1 text-slate-500 normal-case font-normal">({hint})</span>
      </label>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={min}
          max={max}
          value={config[key]}
          onChange={e => onChange({ ...config, [key]: Number(e.target.value) })}
          className="flex-1 accent-sky-400"
        />
        <input
          type="number"
          min={min}
          max={max}
          value={config[key]}
          onChange={e => {
            const v = Math.min(max, Math.max(min, Number(e.target.value)));
            onChange({ ...config, [key]: v });
          }}
          className="w-16 text-center bg-slate-700 border border-slate-600 rounded-md px-2 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-sky-400"
        />
      </div>
    </div>
  );

  return (
    <div className="bg-slate-800 shadow-2xl rounded-xl p-6 ring-1 ring-white/10">
      <h2 className="text-lg font-bold text-sky-400 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
        PDF417 Output Settings
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {field('Bar Width',            'width',                1, 10,  'px per module')}
        {field('Bar Height',           'height',               2, 50,  'px per row')}
        {field('Columns',              'columns',              1, 30,  '1–30')}
        {field('Rows',                 'rows',                 0, 90,  '0 = auto')}
        {field('Error Correction Level', 'errorCorrectionLevel', 0, 8, '0 = lowest')}
      </div>

      <p className="mt-4 text-xs text-slate-500">
        PDF417 supports error correction levels 0–8. Higher values increase redundancy but enlarge the barcode.
        Setting <strong className="text-slate-400">Rows = 0</strong> lets the encoder choose automatically.
      </p>
    </div>
  );
};

// --- Main App ---
const App: React.FC = () => {
  const [formData, setFormData]         = useState<FormDataType>(initialFormData);
  const [barcodeConfig, setBarcodeConfig] = useState<BarcodeConfig>(initialBarcodeConfig);
  const [barcodeImageSrc, setBarcodeImageSrc] = useState<string | null>(null);
  const [error, setError]               = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleSubmit = useCallback(async () => {
    setIsGenerating(true);
    setError(null);
    setBarcodeImageSrc(null);

    try {
      const heightInTotalInches =
        parseInt(formData.heightFeet, 10) * 12 + parseInt(formData.heightInches, 10);
      if (isNaN(heightInTotalInches) || heightInTotalInches <= 0)
        throw new Error('Invalid height input. Please enter valid numbers for feet and inches.');
      if (!formData.issuerIdNumber)
        throw new Error(
          "Issuer ID Number (IIN) is missing. It should be auto-populated based on the selected state."
        );

      const aamvaInputData: AamvaData = {
        ...formData,
        DAU: heightInTotalInches.toString().padStart(3, '0'),
      };

      const aamvaString = formatAamvaDataString(aamvaInputData);

      // Pass barcodeConfig to the generator
      const pngDataUrl = await generatePdf417Barcode(aamvaString, barcodeConfig);
      setBarcodeImageSrc(pngDataUrl);
    } catch (err) {
      console.error('Error generating barcode:', err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsGenerating(false);
    }
  }, [formData, barcodeConfig]);

  const handleDownload = useCallback(async () => {
    if (!barcodeImageSrc) return;
    try {
      const response = await fetch(barcodeImageSrc);
      const blob     = await response.blob();
      const url      = URL.createObjectURL(blob);
      const a        = document.createElement('a');
      a.href         = url;
      a.download     = `aamva_barcode_${formData.DAQ || 'generated'}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (downloadError) {
      console.error('Error preparing download:', downloadError);
      setError('Failed to prepare image for download.');
    }
  }, [barcodeImageSrc, formData.DAQ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 text-white p-4 sm:p-6 lg:p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-500">
          AAMVA PDF417 Barcode Generator
        </h1>
        <p className="text-slate-300 mt-2 text-lg">
          Manually enter driver's license information to generate a PDF417 barcode.
        </p>
      </header>

      <div className="container mx-auto max-w-7xl space-y-8">
        {/* Row 1: data form + preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-slate-800 shadow-2xl rounded-xl p-6 ring-1 ring-white/10">
            <DataInputForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              isGenerating={isGenerating}
            />
          </div>

          <div className="bg-slate-800 shadow-2xl rounded-xl p-6 ring-1 ring-white/10 flex flex-col items-center justify-center">
            <BarcodePreview
              barcodeImageSrc={barcodeImageSrc}
              error={error}
              isLoading={isGenerating}
            />
            {barcodeImageSrc && !isGenerating && (
              <button
                onClick={handleDownload}
                className="mt-6 flex items-center justify-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
              >
                <DownloadIcon className="w-5 h-5 mr-2" />
                Download PNG
              </button>
            )}
            {isGenerating && (
              <div className="mt-6 flex items-center text-sky-400">
                <ProcessingIcon className="w-5 h-5 mr-2 animate-spin" />
                Generating barcode...
              </div>
            )}
          </div>
        </div>

        {/* Row 2: barcode output settings (full width) */}
        <BarcodeConfigPanel config={barcodeConfig} onChange={setBarcodeConfig} />
      </div>

      <footer className="text-center text-slate-400 mt-12 py-4 border-t border-slate-700">
        <p>&copy; {new Date().getFullYear()} AAMVA Barcode Tool. For demonstration purposes only.</p>
        <p className="text-sm">Ensure data complies with AAMVA standards for correct barcode generation.</p>
      </footer>
    </div>
  );
};

export default App;
// import React, { useState, useCallback } from 'react';
// import { DataInputForm } from './components/DataInputForm';
// import { BarcodePreview } from './components/BarcodePreview';
// import { type AamvaData, type FormDataType, EyeColor, Sex, USState, Truncation, ComplianceType } from './types';
// import { formatAamvaDataString } from './services/aamvaFormatter';
// import { generatePdf417Barcode } from './services/barcodeService';
// import { DownloadIcon, ProcessingIcon } from './components/Icons';
// import { STATE_IIN_MAP } from './constants';

// const initialSelectedState = USState.GA;
// const initialIIN = STATE_IIN_MAP[initialSelectedState] || '';

// const initialFormData: FormDataType = {
//   // Header Data
//   issuerIdNumber: initialIIN,
//   aamvaVersion: '09',
//   jurisdictionVersion: '01',

//   // Personal Information
//   DCS: 'WEAVER', // Last Name
//   DAC: 'JESSICA', // First Name
//   DAD: 'LOUISE', // Middle Name
//   DBB: '1982-07-09', // DOB YYYY-MM-DD
//   DBC: Sex.FEMALE, // Sex
//   DAY: EyeColor.GRN, // Eye Color

//   // Address
//   DAG: '14023 TRIBUTARY LN', // Street 1
//   DAH: '', // Street 2
//   DAI: 'VILLA RICA', // City
//   DAJ: initialSelectedState, // State
//   DAK: '301804199', // Postal Code (no hyphen for AAMVA)
//   DCG: 'USA', // Country

//   // License Information
//   DAQ: '061651368', // License Number
//   DBD: '2019-09-28', // Issue Date YYYY-MM-DD
//   DBA: '2027-07-09', // Expiry Date YYYY-MM-DD
//   DCA: 'C', // Vehicle Class
//   DCB: 'B', // Restrictions
//   DCD: 'NONE', // Endorsements
//   DCF: '394647701140030775', // Document Discriminator

//   // Physical Description
//   heightFeet: '5',
//   heightInches: '9',
//   DAW: '170', // Weight

//   // Other/Admin
//   DDE: Truncation.UNKNOWN, // Family name truncation
//   DDF: Truncation.UNKNOWN, // First name truncation
//   DDG: Truncation.UNKNOWN, // Middle name truncation
//   DDA: ComplianceType.F, // Compliance Type
//   DDB: '2019-01-02', // Card Revision Date YYYY-MM-DD
//   DCK: '10000576974', // Inventory Control Number
//   DDK: '1', // Organ Donor
// };


// const App: React.FC = () => {
//   const [formData, setFormData] = useState<FormDataType>(initialFormData);
//   const [barcodeImageSrc, setBarcodeImageSrc] = useState<string | null>(null); // Renamed from barcodeSvg
//   const [error, setError] = useState<string | null>(null);
//   const [isGenerating, setIsGenerating] = useState<boolean>(false);

//   const handleSubmit = useCallback(async () => {
//     setIsGenerating(true);
//     setError(null);
//     setBarcodeImageSrc(null);

//     try {
//       const heightInTotalInches = (parseInt(formData.heightFeet, 10) * 12) + parseInt(formData.heightInches, 10);
//       if (isNaN(heightInTotalInches) || heightInTotalInches <=0) {
//         throw new Error("Invalid height input. Please enter valid numbers for feet and inches.");
//       }
//       if (!formData.issuerIdNumber) {
//         throw new Error("Issuer ID Number (IIN) is missing. It should be auto-populated based on the selected state. The selected state might not have a configured IIN in this tool.");
//       }

//       const aamvaInputData: AamvaData = {
//         ...formData,
//         DAU: heightInTotalInches.toString().padStart(3, '0'), // Format as "0XX"
//       };
      
//       const aamvaString = formatAamvaDataString(aamvaInputData);
//       // console.log("Formatted AAMVA String:", aamvaString.replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\u001e/g, "\\u001e"));
      
//       const pngDataUrl = await generatePdf417Barcode(aamvaString); // Expecting data URL
//       setBarcodeImageSrc(pngDataUrl);
//     } catch (err) {
//       console.error("Error generating barcode:", err);
//       setError(err instanceof Error ? err.message : String(err));
//     } finally {
//       setIsGenerating(false);
//     }
//   }, [formData]);

//   const handleDownload = useCallback(async () => {
//     if (!barcodeImageSrc) return;
    
//     try {
//       // Convert data URL to Blob
//       const response = await fetch(barcodeImageSrc);
//       const blob = await response.blob();

//       const url = URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `aamva_barcode_${formData.DAQ || 'generated'}.png`; // Changed to .png
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//       URL.revokeObjectURL(url);
//     } catch (downloadError) {
//       console.error("Error preparing download:", downloadError);
//       setError("Failed to prepare image for download.");
//     }
//   }, [barcodeImageSrc, formData.DAQ]);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 text-white p-4 sm:p-6 lg:p-8">
//       <header className="text-center mb-8">
//         <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-500">
//           AAMVA PDF417 Barcode Generator
//         </h1>
//         <p className="text-slate-300 mt-2 text-lg">
//           Manually enter driver's license information to generate a PDF417 barcode.
//         </p>
//       </header>

//       <div className="container mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8">
//         <div className="bg-slate-800 shadow-2xl rounded-xl p-6 ring-1 ring-white/10">
//           <DataInputForm formData={formData} setFormData={setFormData} onSubmit={handleSubmit} isGenerating={isGenerating} />
//         </div>
        
//         <div className="bg-slate-800 shadow-2xl rounded-xl p-6 ring-1 ring-white/10 flex flex-col items-center justify-center">
//           <BarcodePreview barcodeImageSrc={barcodeImageSrc} error={error} isLoading={isGenerating} /> {/* Prop renamed */}
//           {barcodeImageSrc && !isGenerating && (
//             <button
//               onClick={handleDownload}
//               className="mt-6 flex items-center justify-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
//             >
//               <DownloadIcon className="w-5 h-5 mr-2" />
//               Download PNG {/* Text changed */}
//             </button>
//           )}
//            {isGenerating && (
//              <div className="mt-6 flex items-center text-sky-400">
//                 <ProcessingIcon className="w-5 h-5 mr-2 animate-spin" />
//                 Generating barcode...
//              </div>
//            )}
//         </div>
//       </div>
//       <footer className="text-center text-slate-400 mt-12 py-4 border-t border-slate-700">
//         <p>&copy; {new Date().getFullYear()} AAMVA Barcode Tool. For demonstration purposes only.</p>
//         <p className="text-sm">Ensure data complies with AAMVA standards for correct barcode generation.</p>
//       </footer>
//     </div>
//   );
// };

// export default App;
