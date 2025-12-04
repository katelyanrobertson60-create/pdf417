
export enum USState {
  AL = "AL", AK = "AK", AS = "AS", AZ = "AZ", AR = "AR", CA = "CA", CO = "CO", CT = "CT", DE = "DE", DC = "DC", FL = "FL",
  GA = "GA", GU = "GU", HI = "HI", ID = "ID", IL = "IL", IN = "IN", IA = "IA", KS = "KS", KY = "KY", LA = "LA", ME = "ME",
  MD = "MD", MA = "MA", MI = "MI", MN = "MN", MS = "MS", MO = "MO", MP = "MP", MT = "MT", NE = "NE", NV = "NV", NH = "NH",
  NJ = "NJ", NM = "NM", NY = "NY", NC = "NC", ND = "ND", OH = "OH", OK = "OK", OR = "OR", PA = "PA", PR = "PR", RI = "RI",
  SC = "SC", SD = "SD", TN = "TN", TX = "TX", UT = "UT", VT = "VT", VA = "VA", VI = "VI", WA = "WA", WV = "WV", WI = "WI", WY = "WY"
}

export enum EyeColor {
  BLK = "BLK", BLU = "BLU", BRO = "BRO", GRY = "GRY", GRN = "GRN", HAZ = "HAZ", MAR = "MAR", PNK = "PNK", DIC = "DIC", MUL = "MUL", OTH="OTH"
}

export enum Sex {
  MALE = "1",
  FEMALE = "2",
  NOT_SPECIFIED = "9" // Or "0" or "" depending on spec if not specified
}

export enum Truncation {
  NONE = "N",
  TRUNCATED = "T",
  UNKNOWN = "U"
}

export enum ComplianceType {
  F = "F", // Materially compliant
  N = "N"  // Non-compliant
}

// Data structure expected by the AAMVA formatter service
export interface AamvaData {
  // Header Information
  issuerIdNumber: string;
  aamvaVersion: string;
  jurisdictionVersion: string;

  // Personal Information
  DCS: string; // Customer Family Name (Last Name)
  DAC: string; // Customer First Name
  DAD?: string; // Customer Middle Name(s)
  DBB: string; // Date of Birth (YYYY-MM-DD from input, formatted to MMDDYYYY by formatter)
  DBC: Sex;    // Sex (1 for Male, 2 for Female)
  DAY?: EyeColor; // Eye Color (e.g., GRN)

  // Address
  DAG: string; // Address Street 1
  DAH?: string; // Address Street 2 (Optional)
  DAI: string; // Address City
  DAJ: USState; // Address Jurisdiction Code (State)
  DAK: string; // Address Postal Code (Zip: 12345 or 123456789, no hyphen)
  DCG?: string; // Country Identification (Default to "USA")

  // License Information
  DAQ: string; // Customer ID Number (License Number)
  DBD: string; // Document Issue Date (YYYY-MM-DD from input, formatted to MMDDYYYY by formatter)
  DBA: string; // Document Expiration Date (YYYY-MM-DD from input, formatted to MMDDYYYY by formatter)
  DCA?: string; // Jurisdiction-specific vehicle class
  DCB?: string; // Jurisdiction-specific restriction codes
  DCD?: string; // Jurisdiction-specific endorsement codes
  DCF?: string; // Document Discriminator

  // Physical Description
  DAU: string; // Height (total inches as "0XX" string, e.g., "069")
  DAW?: string; // Weight (lbs, e.g., "170")
  
  // Other/Administrative
  DDE?: Truncation; // Family name truncation
  DDF?: Truncation; // First name truncation
  DDG?: Truncation; // Middle name truncation
  DDA?: ComplianceType; // Compliance Type
  DDB?: string; // Card Revision Date (YYYY-MM-DD from input, formatted MMDDYYYY by formatter)
  DCK?: string; // Inventory control number
  DDK?: string; // Organ Donor Indicator (e.g., "1" for Yes)
}

// Data structure for the form state (slightly different for UI convenience, e.g. height)
export interface FormDataType extends Omit<AamvaData, 'DAU' | 'DBC' | 'DAY' | 'DAJ' | 'DDE' | 'DDF' | 'DDG' | 'DDA' > {
  heightFeet: string;
  heightInches: string;
  DBC: Sex;
  DAY?: EyeColor;
  DAJ: USState;
  DDE?: Truncation;
  DDF?: Truncation;
  DDG?: Truncation;
  DDA?: ComplianceType;
}

export interface AamvaFieldDescription {
  id: keyof FormDataType | 'heightFeet' | 'heightInches' | 'issuerIdNumber' | 'aamvaVersion' | 'jurisdictionVersion';
  label: string;
  tooltip: string;
  group: string;
  required?: boolean;
  maxLength?: number;
  pattern?: string; // For date or numeric inputs primarily
  options?: { value: string; label: string }[];
  type?: 'text' | 'date' | 'number' | 'select';
  placeholder?: string;
  readOnly?: boolean; // Added readOnly property
}
