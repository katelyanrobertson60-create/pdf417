
import { USState, EyeColor, Sex, Truncation, ComplianceType, type AamvaFieldDescription } from './types';

export const usStatesOptions = Object.entries(USState).map(([_, value]) => ({ value, label: value }));
export const eyeColorOptions = Object.entries(EyeColor).map(([key, value]) => ({ value, label: `${key} (${value})` }));
export const sexOptions = [
  { value: Sex.MALE, label: 'Male (1)' },
  { value: Sex.FEMALE, label: 'Female (2)' },
  { value: Sex.NOT_SPECIFIED, label: 'Not Specified (9)' },
];
export const truncationOptions = Object.entries(Truncation).map(([key, value]) => ({ value, label: `${key} (${value})` }));
export const complianceOptions = Object.entries(ComplianceType).map(([key, value]) => ({ value, label: `${key} (${value})` }));

export const STATE_IIN_MAP: Partial<Record<USState, string>> = {
  [USState.AS]: '604427', // American Samoa
  [USState.MP]: '604430', // Northern Mariana Islands
  [USState.PR]: '604431', // Puerto Rico
  [USState.VA]: '636000', // Virginia
  [USState.NY]: '636001', // New York
  [USState.MA]: '636002', // Massachusetts
  [USState.MD]: '636003', // Maryland
  [USState.NC]: '636004', // North Carolina
  [USState.SC]: '636005', // South Carolina
  [USState.CT]: '636006', // Connecticut
  [USState.LA]: '636007', // Louisiana
  [USState.MT]: '636008', // Montana
  [USState.NM]: '636009', // New Mexico
  [USState.FL]: '636010', // Florida
  [USState.DE]: '636011', // Delaware
  [USState.CA]: '636014', // California
  [USState.TX]: '636015', // Texas
  [USState.IA]: '636018', // Iowa
  [USState.GU]: '636019', // Guam
  [USState.CO]: '636020', // Colorado (Standard Abbr: CO)
  [USState.AR]: '636021', // Arkansas
  [USState.KS]: '636022', // Kansas
  [USState.OH]: '636023', // Ohio
  [USState.VT]: '636024', // Vermont
  [USState.PA]: '636025', // Pennsylvania
  [USState.AZ]: '636026', // Arizona
  // State Dept. (Diplomatic) '636027' - Omitted due to no standard 2-letter code in USState enum
  [USState.OR]: '636029', // Oregon
  [USState.MO]: '636030', // Missouri
  [USState.WI]: '636031', // Wisconsin
  [USState.MI]: '636032', // Michigan
  [USState.AL]: '636033', // Alabama
  [USState.ND]: '636034', // North Dakota
  [USState.IL]: '636035', // Illinois
  [USState.NJ]: '636036', // New Jersey
  [USState.IN]: '636037', // Indiana
  [USState.MN]: '636038', // Minnesota
  [USState.NH]: '636039', // New Hampshire
  [USState.UT]: '636040', // Utah
  [USState.ME]: '636041', // Maine
  [USState.SD]: '636042', // South Dakota
  [USState.DC]: '636043', // District of Columbia
  [USState.WA]: '636045', // Washington
  [USState.KY]: '636046', // Kentucky
  [USState.HI]: '636047', // Hawaii
  [USState.NV]: '636049', // Nevada
  [USState.ID]: '636050', // Idaho
  [USState.MS]: '636051', // Mississippi
  [USState.RI]: '636052', // Rhode Island
  [USState.TN]: '636053', // Tennessee
  [USState.NE]: '636054', // Nebraska
  [USState.GA]: '636055', // Georgia
  [USState.OK]: '636058', // Oklahoma
  [USState.AK]: '636059', // Alaska
  [USState.WY]: '636060', // Wyoming
  [USState.WV]: '636061', // West Virginia
  [USState.VI]: '636062', // Virgin Islands
};


export const AAMVA_FIELD_DEFINITIONS: AamvaFieldDescription[] = [
  // Header Information Section
  {
    id: 'issuerIdNumber',
    label: 'Issuer ID Number (IIN)',
    tooltip: 'AAMVA-assigned Issuer Identification Number. Automatically set based on the selected State/Jurisdiction. Typically 6 digits.',
    group: 'Header Information',
    required: true,
    maxLength: 6,
    pattern: '^\\d{6}$',
    placeholder: 'Auto-filled by State',
    readOnly: true, // Explicitly set as read-only
  },
  { id: 'aamvaVersion', label: 'AAMVA Version', tooltip: 'AAMVA Standard Version Number (e.g., 09). Typically 2 digits.', group: 'Header Information', required: true, maxLength: 2, pattern: '^\\d{2}$', placeholder: 'e.g., 09' },
  { id: 'jurisdictionVersion', label: 'Jurisdiction Version', tooltip: 'Issuer-specific version number (e.g., 01). Typically 2 digits.', group: 'Header Information', required: true, maxLength: 2, pattern: '^\\d{2}$', placeholder: 'e.g., 01' },

  // Personal Information Section
  { id: 'DCS', label: 'Family Name (Last Name)', tooltip: 'Customer\'s last name.', group: 'Personal Information', required: true, placeholder: 'e.g., WEAVER' },
  { id: 'DAC', label: 'First Name', tooltip: 'Customer\'s first name.', group: 'Personal Information', required: true, placeholder: 'e.g., JESSICA' },
  { id: 'DAD', label: 'Middle Name(s)', tooltip: 'Customer\'s middle name(s) or initial.', group: 'Personal Information', placeholder: 'e.g., LOUISE' },
  { id: 'DBB', label: 'Date of Birth', tooltip: 'Customer\'s date of birth (YYYY-MM-DD).', group: 'Personal Information', required: true, type: 'date' },
  { id: 'DBC', label: 'Sex', tooltip: 'Customer\'s sex (1=Male, 2=Female, 9=Not Specified).', group: 'Personal Information', required: true, type: 'select', options: sexOptions },
  { id: 'DAY', label: 'Eye Color', tooltip: 'Customer\'s eye color (e.g., GRN).', group: 'Personal Information', type: 'select', options: eyeColorOptions },

  // Address Section
  { id: 'DAG', label: 'Street Address 1', tooltip: 'Customer\'s street address line 1.', group: 'Address', required: true, placeholder: 'e.g., 14023 TRIBUTARY LN' },
  { id: 'DAH', label: 'Street Address 2', tooltip: 'Customer\'s street address line 2 (optional).', group: 'Address', placeholder: 'e.g., APT 101' },
  { id: 'DAI', label: 'City', tooltip: 'Customer\'s city.', group: 'Address', required: true, placeholder: 'e.g., VILLA RICA' },
  { id: 'DAJ', label: 'State/Jurisdiction', tooltip: 'Customer\'s state or jurisdiction code.', group: 'Address', required: true, type: 'select', options: usStatesOptions },
  { id: 'DAK', label: 'Postal Code', tooltip: 'Customer\'s postal code (ZIP). Use 5 or 9 digits without hyphen (e.g., 30180 or 301804199).', group: 'Address', required: true, pattern: '^\\d{5}(\\d{4})?$', placeholder: 'e.g., 301804199' },
  { id: 'DCG', label: 'Country', tooltip: 'Country Identification (Defaults to USA).', group: 'Address', placeholder: 'USA', maxLength: 3 },

  // License Information Section
  { id: 'DAQ', label: 'Driver License Number', tooltip: 'Customer ID or Driver License number.', group: 'License Information', required: true, placeholder: 'e.g., 061651368' },
  { id: 'DBD', label: 'Document Issue Date', tooltip: 'Date the document was issued (YYYY-MM-DD).', group: 'License Information', required: true, type: 'date' },
  { id: 'DBA', label: 'Document Expiration Date', tooltip: 'Date the document expires (YYYY-MM-DD).', group: 'License Information', required: true, type: 'date' },
  { id: 'DCA', label: 'Vehicle Class', tooltip: 'Jurisdiction-specific vehicle class (e.g., C).', group: 'License Information', placeholder: 'e.g., C' },
  { id: 'DCB', label: 'Restriction Codes', tooltip: 'Jurisdiction-specific restriction codes (e.g., B for Corrective Lenses).', group: 'License Information', placeholder: 'e.g., B' },
  { id: 'DCD', label: 'Endorsement Codes', tooltip: 'Jurisdiction-specific endorsement codes (e.g., NONE).', group: 'License Information', placeholder: 'e.g., NONE' },
  { id: 'DCF', label: 'Document Discriminator', tooltip: 'Unique identifier for the physical document. Can be complex.', group: 'License Information', placeholder: 'e.g., 394647701140030775' },

  // Physical Description Section
  { id: 'heightFeet', label: 'Height (Feet)', tooltip: 'Customer\'s height in feet.', group: 'Physical Description', required: true, type: 'number', placeholder: 'e.g., 5' },
  { id: 'heightInches', label: 'Height (Inches)', tooltip: 'Customer\'s height in inches.', group: 'Physical Description', required: true, type: 'number', placeholder: 'e.g., 9' },
  { id: 'DAW', label: 'Weight (lbs)', tooltip: 'Customer\'s weight in pounds.', group: 'Physical Description', type: 'number', placeholder: 'e.g., 170' },

  // Other/Administrative Section
  { id: 'DDE', label: 'Family Name Truncation', tooltip: 'Indicates if family name was truncated.', group: 'Other/Administrative', type: 'select', options: truncationOptions },
  { id: 'DDF', label: 'First Name Truncation', tooltip: 'Indicates if first name was truncated.', group: 'Other/Administrative', type: 'select', options: truncationOptions },
  { id: 'DDG', label: 'Middle Name Truncation', tooltip: 'Indicates if middle name was truncated.', group: 'Other/Administrative', type: 'select', options: truncationOptions },
  { id: 'DDA', label: 'Compliance Type', tooltip: 'DL/ID card compliance with REAL ID Act etc.', group: 'Other/Administrative', type: 'select', options: complianceOptions },
  { id: 'DDB', label: 'Card Revision Date', tooltip: 'Revision date of the card (YYYY-MM-DD).', group: 'Other/Administrative', type: 'date' },
  { id: 'DCK', label: 'Inventory Control #', tooltip: 'Card inventory control number.', group: 'Other/Administrative', placeholder: 'e.g., 10000576974' },
  { id: 'DDK', label: 'Organ Donor', tooltip: 'Organ donor indicator (e.g., "1" for Yes).', group: 'Other/Administrative', placeholder: 'e.g., 1' },
];

export const FIELD_GROUPS = [
  'Header Information',
  'Personal Information',
  'Address',
  'License Information',
  'Physical Description',
  'Other/Administrative',
];
