
import React from 'react';
import { ImagePlaceholderIcon, ErrorIcon } from './Icons';

interface BarcodePreviewProps {
  barcodeImageSrc: string | null; // Changed from barcodeSvg
  error: string | null;
  isLoading: boolean;
}

export const BarcodePreview: React.FC<BarcodePreviewProps> = ({ barcodeImageSrc, error, isLoading }) => {
  if (isLoading) {
    return (
      <div className="w-full h-48 flex flex-col items-center justify-center bg-slate-700 rounded-lg p-4 border-2 border-dashed border-slate-600">
        <svg className="animate-spin h-12 w-12 text-sky-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-3 text-slate-300">Generating barcode...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-48 flex flex-col items-center justify-center bg-red-900/20 border-2 border-dashed border-red-500 text-red-400 rounded-lg p-4">
        <ErrorIcon className="w-12 h-12 text-red-500 mb-2" />
        <p className="font-semibold">Error Generating Barcode</p>
        <p className="text-sm text-center max-w-xs">{error}</p>
      </div>
    );
  }

  if (!barcodeImageSrc) { // Changed from !barcodeSvg
    return (
      <div className="w-full h-48 flex flex-col items-center justify-center bg-slate-700 rounded-lg p-4 border-2 border-dashed border-slate-600">
        <ImagePlaceholderIcon className="w-16 h-16 text-slate-500 mb-2" />
        <p className="text-slate-400">Barcode will appear here</p>
        <p className="text-xs text-slate-500">Fill the form and click "Generate Barcode"</p>
      </div>
    );
  }

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-inner flex justify-center items-center">
      <img 
        src={barcodeImageSrc} // Use barcodeImageSrc
        alt="Generated PDF417 Barcode"
        className="max-w-full h-auto object-contain" // Added object-contain for better scaling
        style={{ maxHeight: '200px' }} // Optional: constrain max height if needed
      />
    </div>
  );
};
