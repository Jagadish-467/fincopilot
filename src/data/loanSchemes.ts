export interface LoanScheme {
  id: string;
  bankName: string;
  schemeName: string;
  interestRate: number;
  maxAmount: number;
  moratoriumYears: number;
  collateralRequired: boolean;
  processingFee: number;
  tiers: string[];
}

export interface University {
  name: string;
  tier: string;
}

export const universities: University[] = [
  { name: 'IIT Bombay', tier: 'AA' },
  { name: 'IIT Delhi', tier: 'AA' },
  { name: 'IIT Madras', tier: 'AA' },
  { name: 'IIT Kanpur', tier: 'AA' },
  { name: 'IIT Kharagpur', tier: 'AA' },
  { name: 'NIT Warangal', tier: 'A' },
  { name: 'NIT Trichy', tier: 'A' },
  { name: 'NIT Surathkal', tier: 'A' },
  { name: 'BITS Pilani', tier: 'A' },
  { name: 'VIT Vellore', tier: 'B' },
  { name: 'SRM Chennai', tier: 'B' },
  { name: 'Manipal University', tier: 'B' },
  { name: 'Amity University', tier: 'C' },
  { name: 'LPU Jalandhar', tier: 'C' },
  { name: 'Other', tier: 'C' },
];

export const degreeTypes = ['B.Tech', 'M.Tech', 'MBA', 'MBBS', 'B.Sc', 'M.Sc', 'B.Com', 'Other'];

export const loanSchemes: LoanScheme[] = [
  { id: '1', bankName: 'SBI', schemeName: 'SBI Scholar Loan', interestRate: 8.15, maxAmount: 4000000, moratoriumYears: 4, collateralRequired: false, processingFee: 0, tiers: ['AA', 'A'] },
  { id: '2', bankName: 'Bank of Baroda', schemeName: 'Baroda Vidya', interestRate: 8.35, maxAmount: 3500000, moratoriumYears: 4, collateralRequired: false, processingFee: 0, tiers: ['AA', 'A', 'B'] },
  { id: '3', bankName: 'Canara Bank', schemeName: 'Canara Vidya Turant', interestRate: 8.50, maxAmount: 2000000, moratoriumYears: 3, collateralRequired: false, processingFee: 500, tiers: ['AA', 'A', 'B', 'C'] },
  { id: '4', bankName: 'Punjab National Bank', schemeName: 'PNB Saraswati', interestRate: 8.65, maxAmount: 2500000, moratoriumYears: 4, collateralRequired: false, processingFee: 0, tiers: ['AA', 'A', 'B'] },
  { id: '5', bankName: 'HDFC Credila', schemeName: 'HDFC Education Loan', interestRate: 9.50, maxAmount: 5000000, moratoriumYears: 5, collateralRequired: true, processingFee: 1000, tiers: ['AA', 'A', 'B', 'C'] },
  { id: '6', bankName: 'Axis Bank', schemeName: 'Axis Shiksha', interestRate: 9.20, maxAmount: 3000000, moratoriumYears: 4, collateralRequired: true, processingFee: 500, tiers: ['AA', 'A', 'B'] },
  { id: '7', bankName: 'Central Bank', schemeName: 'Cent Vidyarthi', interestRate: 8.50, maxAmount: 2000000, moratoriumYears: 4, collateralRequired: false, processingFee: 0, tiers: ['A', 'B', 'C'] },
  { id: '8', bankName: 'Indian Bank', schemeName: 'IB Smart Scholar', interestRate: 8.40, maxAmount: 3000000, moratoriumYears: 4, collateralRequired: false, processingFee: 250, tiers: ['AA', 'A', 'B'] },
];
