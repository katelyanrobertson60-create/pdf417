
import bwipjs from 'bwip-js'; // Ensure bwip-js is installed (npm install bwip-js)

/**
 * Generates a PDF417 barcode as a PNG data URL using a canvas for browser compatibility.
 * @param data The string data to encode in the barcode.
 * @returns A promise that resolves with the PNG data URL of the barcode.
 * @throws If barcode generation fails.
 */
export const generatePdf417Barcode = async (data: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      // Create an in-memory canvas element
      const canvas = document.createElement('canvas');

      // bwip-js options for PDF417
      // Refer to bwip-js documentation for all options: https://github.com/metafloor/bwip-js/wiki/Options-Reference
      const options = {
        bcid: 'pdf417',       // Barcode type
        text: data,           // Data to encode
        scale: 3,             // Scaling factor for the output PNG
        height: 25,           // Barcode height in millimeters
        // width: undefined,  // Let bwip-js determine width based on data, height, scale, columns
        includetext: false,   // Do not include human-readable text below the barcode
        textxalign: 'center',
        options: 'eclevel=5 columns=10', // PDF417 specific: error correction level 5, 10 data columns
                                        // Adjust columns based on expected data length and desired aspect ratio
      };

      // bwipjs.toCanvas is synchronous and throws on error.
      // It modifies the canvas element passed to it.
      bwipjs.toCanvas(canvas, options);

      // If toCanvas succeeded, convert the canvas to a PNG data URL
      const pngDataUrl = canvas.toDataURL('image/png');
      resolve(pngDataUrl);

    } catch (err) {
      // Catch errors from document.createElement() or bwipjs.toCanvas()
      console.error('Error during barcode generation:', err);
      let errorMessage = 'Failed to generate barcode.';
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }

      // Provide more specific feedback for common errors
      if (errorMessage.toLowerCase().includes("value too long") ||
          errorMessage.toLowerCase().includes("data too large") ||
          errorMessage.toLowerCase().includes("capacity exceeded")) {
        errorMessage = "The provided data is too long for the PDF417 barcode with current settings. Try reducing data or adjusting barcode parameters (e.g., fewer columns if that's an option, or higher error correction if data allows).";
      } else if (errorMessage.toLowerCase().includes("unknown eci")) {
        errorMessage = "The input data may contain characters not supported by the current PDF417 encoding mode (ECI). Please verify input data, especially special characters.";
      } else if (errorMessage.toLowerCase().includes("bad ecc")) {
        errorMessage = "Invalid error correction code level specified for PDF417.";
      }


      reject(new Error(errorMessage));
    }
  });
};
