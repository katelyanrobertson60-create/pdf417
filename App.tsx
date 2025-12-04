
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

const initialFormData: FormDataType = {
  // Header Data
  issuerIdNumber: initialIIN,
  aamvaVersion: '09',
  jurisdictionVersion: '01',

  // Personal Information
  DCS: 'WEAVER', // Last Name
  DAC: 'JESSICA', // First Name
  DAD: 'LOUISE', // Middle Name
  DBB: '1982-07-09', // DOB YYYY-MM-DD
  DBC: Sex.FEMALE, // Sex
  DAY: EyeColor.GRN, // Eye Color

  // Address
  DAG: '14023 TRIBUTARY LN', // Street 1
  DAH: '', // Street 2
  DAI: 'VILLA RICA', // City
  DAJ: initialSelectedState, // State
  DAK: '301804199', // Postal Code (no hyphen for AAMVA)
  DCG: 'USA', // Country

  // License Information
  DAQ: '061651368', // License Number
  DBD: '2019-09-28', // Issue Date YYYY-MM-DD
  DBA: '2027-07-09', // Expiry Date YYYY-MM-DD
  DCA: 'C', // Vehicle Class
  DCB: 'B', // Restrictions
  DCD: 'NONE', // Endorsements
  DCF: '394647701140030775', // Document Discriminator

  // Physical Description
  heightFeet: '5',
  heightInches: '9',
  DAW: '170', // Weight

  // Other/Admin
  DDE: Truncation.UNKNOWN, // Family name truncation
  DDF: Truncation.UNKNOWN, // First name truncation
  DDG: Truncation.UNKNOWN, // Middle name truncation
  DDA: ComplianceType.F, // Compliance Type
  DDB: '2019-01-02', // Card Revision Date YYYY-MM-DD
  DCK: '10000576974', // Inventory Control Number
  DDK: '1', // Organ Donor
};


const App: React.FC = () => {
  const [formData, setFormData] = useState<FormDataType>(initialFormData);
  const [barcodeImageSrc, setBarcodeImageSrc] = useState<string | null>(null); // Renamed from barcodeSvg
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleSubmit = useCallback(async () => {
    setIsGenerating(true);
    setError(null);
    setBarcodeImageSrc(null);

    try {
      const heightInTotalInches = (parseInt(formData.heightFeet, 10) * 12) + parseInt(formData.heightInches, 10);
      if (isNaN(heightInTotalInches) || heightInTotalInches <=0) {
        throw new Error("Invalid height input. Please enter valid numbers for feet and inches.");
      }
      if (!formData.issuerIdNumber) {
        throw new Error("Issuer ID Number (IIN) is missing. It should be auto-populated based on the selected state. The selected state might not have a configured IIN in this tool.");
      }

      const aamvaInputData: AamvaData = {
        ...formData,
        DAU: heightInTotalInches.toString().padStart(3, '0'), // Format as "0XX"
      };
      
      const aamvaString = formatAamvaDataString(aamvaInputData);
      // console.log("Formatted AAMVA String:", aamvaString.replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\u001e/g, "\\u001e"));
      
      const pngDataUrl = await generatePdf417Barcode(aamvaString); // Expecting data URL
      setBarcodeImageSrc(pngDataUrl);
    } catch (err) {
      console.error("Error generating barcode:", err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsGenerating(false);
    }
  }, [formData]);

  const handleDownload = useCallback(async () => {
    if (!barcodeImageSrc) return;
    
    try {
      // Convert data URL to Blob
      const response = await fetch(barcodeImageSrc);
      const blob = await response.blob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `aamva_barcode_${formData.DAQ || 'generated'}.png`; // Changed to .png
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (downloadError) {
      console.error("Error preparing download:", downloadError);
      setError("Failed to prepare image for download.");
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

      <div className="container mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-800 shadow-2xl rounded-xl p-6 ring-1 ring-white/10">
          <DataInputForm formData={formData} setFormData={setFormData} onSubmit={handleSubmit} isGenerating={isGenerating} />
        </div>
        
        <div className="bg-slate-800 shadow-2xl rounded-xl p-6 ring-1 ring-white/10 flex flex-col items-center justify-center">
          <BarcodePreview barcodeImageSrc={barcodeImageSrc} error={error} isLoading={isGenerating} /> {/* Prop renamed */}
          {barcodeImageSrc && !isGenerating && (
            <button
              onClick={handleDownload}
              className="mt-6 flex items-center justify-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
            >
              <DownloadIcon className="w-5 h-5 mr-2" />
              Download PNG {/* Text changed */}
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
      <footer className="text-center text-slate-400 mt-12 py-4 border-t border-slate-700">
        <p>&copy; {new Date().getFullYear()} AAMVA Barcode Tool. For demonstration purposes only.</p>
        <p className="text-sm">Ensure data complies with AAMVA standards for correct barcode generation.</p>
      </footer>
    </div>
  );
};

export default App;
