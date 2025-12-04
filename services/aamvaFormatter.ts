
import { type AamvaData } from '../types';

const formatDateToMMDDYYYY = (dateStringYYYYMMDD: string): string => {
  if (!dateStringYYYYMMDD || !/^\d{4}-\d{2}-\d{2}$/.test(dateStringYYYYMMDD)) return ''; // Basic validation
  const [year, month, day] = dateStringYYYYMMDD.split('-');
  return `${month}${day}${year}`;
};

export const formatAamvaDataString = (data: AamvaData): string => {
  const LF = '\n'; // Line Feed (ASCII 10)
  const RS = '\u001e'; // Record Separator (ASCII 30)
  const CR = '\r'; // Carriage Return (ASCII 13)

  // AAMVA Standard Header
  // Compliance Indicator, File Separator, Record Separator, Segment Terminator
  // File Type ("ANSI "), IIN, AAMVA Version, Jurisdiction Version, Number of Entries
  // Using "01" for number of entries, assuming only one subfile (DL - Driver License)
  const header = `@${LF}${RS}${CR}ANSI ${data.issuerIdNumber}${data.aamvaVersion}${data.jurisdictionVersion}01${LF}`;

  let dlSubfile = `DL${LF}`; // Subfile Type: DL

  // Helper to add element if value exists and is not empty string
  const addElement = (id: string, value?: string | null, isOptional: boolean = true) => {
    if (value !== undefined && value !== null && value !== '') {
      dlSubfile += `${id}${value.toUpperCase()}${LF}`;
    } else if (!isOptional) { // if mandatory and empty, add with empty value (though AAMVA usually omits if empty)
       dlSubfile += `${id}${LF}`;
    }
  };
  
  // Mandatory or Core DL Elements (Order can matter)
  addElement('DAQ', data.DAQ, false); // Customer ID Number
  addElement('DCS', data.DCS, false); // Customer Family Name
  addElement('DAC', data.DAC, false); // Driver First Name
  addElement('DAD', data.DAD);        // Driver Middle Name
  addElement('DBD', formatDateToMMDDYYYY(data.DBD), false); // Document Issue Date
  addElement('DBB', formatDateToMMDDYYYY(data.DBB), false); // Date of Birth
  addElement('DBA', formatDateToMMDDYYYY(data.DBA), false); // Document Expiration Date
  addElement('DBC', data.DBC, false); // Sex

  // Physical Description
  addElement('DAU', `${data.DAU} IN`, false); // Height in inches, e.g., "069 IN"
  addElement('DAY', data.DAY); // Eye Color
  addElement('DAW', data.DAW); // Weight

  // Address
  addElement('DAG', data.DAG, false); // Street 1
  addElement('DAH', data.DAH);        // Street 2
  addElement('DAI', data.DAI, false); // City
  addElement('DAJ', data.DAJ, false); // State
  addElement('DAK', data.DAK.replace(/-/g, ''), false); // Postal Code (remove hyphen)
  addElement('DCG', data.DCG || 'USA'); // Country (Default USA)
  
  // License Specifics
  addElement('DCA', data.DCA); // Vehicle Class
  addElement('DCB', data.DCB); // Restriction Codes
  addElement('DCD', data.DCD); // Endorsement Codes
  addElement('DCF', data.DCF); // Document Discriminator
  
  // Other/Administrative
  addElement('DDE', data.DDE); // Family Name Truncation
  addElement('DDF', data.DDF); // First Name Truncation
  addElement('DDG', data.DDG); // Middle Name Truncation
  addElement('DDA', data.DDA); // Compliance Type
  if (data.DDB) addElement('DDB', formatDateToMMDDYYYY(data.DDB)); // Card Revision Date
  addElement('DCK', data.DCK); // Inventory Control Number
  addElement('DDK', data.DDK); // Organ Donor

  dlSubfile += CR; // Segment Terminator for DL subfile

  return header + dlSubfile;
};
