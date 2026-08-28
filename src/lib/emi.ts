export type LoanType = 'home' | 'personal' | 'business' | 'car';
export type EmiScheme = 'arrears' | 'advance';
export type TenureUnit = 'years' | 'months';
export type YearMode = 'calendar' | 'financial';

export interface LoanConfig {
  id: LoanType;
  label: string;
  amountMin: number;
  amountMax: number;
  amountStep: number;
  amountDefault: number;
  rateMin: number;
  rateMax: number;
  rateStep: number;
  rateDefault: number;
  tenureYearsMin: number;
  tenureYearsMax: number;
  tenureYearsDefault: number;
  showAdvanceScheme: boolean;
}

const SHARED_RANGE = {
  amountMin: 1000,
  amountMax: 1000000000,
  amountStep: 1000,
  amountDefault: 2500000,
  rateMin: 1,
  rateMax: 100,
  rateStep: 0.05,
  rateDefault: 10.5,
  tenureYearsMin: 1,
  tenureYearsMax: 100,
  tenureYearsDefault: 20,
};

export const LOAN_CONFIGS: Record<LoanType, LoanConfig> = {
  home: {
    id: 'home',
    label: 'Home Loan',
    ...SHARED_RANGE,
    showAdvanceScheme: false,
  },
  personal: {
    id: 'personal',
    label: 'Personal Loan',
    ...SHARED_RANGE,
    showAdvanceScheme: false,
  },
  business: {
    id: 'business',
    label: 'Business Loan',
    ...SHARED_RANGE,
    showAdvanceScheme: false,
  },
  car: {
    id: 'car',
    label: 'Car Loan',
    ...SHARED_RANGE,
    showAdvanceScheme: true,
  },
};

export interface MonthRow {
  monthIndex: number;
  date: Date;
  emi: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface YearGroup {
  label: string;
  principal: number;
  interest: number;
  emiTotal: number;
  closingBalance: number;
  months: MonthRow[];
}

export interface EmiResult {
  emi: number;
  totalInterest: number;
  totalPayment: number;
  schedule: MonthRow[];
  years: YearGroup[];
}

export function formatINR(amount: number, fractionDigits = 0): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits,
  }).format(Number.isFinite(amount) ? amount : 0);
}

export function compactINR(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 10000000) {
    const cr = n / 10000000;
    return `${Number.isInteger(cr) ? cr : cr.toFixed(cr >= 10 ? 0 : 1)} Cr`;
  }
  if (abs >= 100000) {
    const l = n / 100000;
    return `${Number.isInteger(l) ? l : l.toFixed(l >= 10 ? 0 : 1)} L`;
  }
  if (abs >= 1000) {
    return `${Math.round(n / 1000)}K`;
  }
  return String(Math.round(n));
}

export function addMonths(date: Date, months: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

export function financialYearLabel(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth();
  if (month >= 3) {
    return `FY ${year}-${String(year + 1).slice(2)}`;
  }
  return `FY ${year - 1}-${String(year).slice(2)}`;
}

function roundRupee(n: number): number {
  return Math.round(n);
}

function monthlyRate(annualRate: number): number {
  return annualRate / 12 / 100;
}

/**
 * Indian bank / NBFC EMI (monthly reducing balance, monthly rest).
 * Same closed-form as Excel PMT(rate/12, nper, -pv) and emicalculator.net:
 *   EMI = P × r × (1+r)^n / ((1+r)^n − 1)
 * where r = annualRate / 12 / 100 and n = tenure in months.
 *
 * EMI in Advance (leases / some car loans) is the arrears EMI discounted by one period:
 *   EMI_advance = EMI_arrears / (1 + r)
 */
export function calcRawEmi(
  principal: number,
  annualRate: number,
  months: number,
  scheme: EmiScheme
): number {
  if (principal <= 0 || months <= 0) return 0;
  if (annualRate <= 0) return principal / months;

  const r = monthlyRate(annualRate);
  const denom = 1 - Math.pow(1 + r, -months);
  const emiArrears =
    !Number.isFinite(denom) || denom === 0
      ? principal / months
      : (principal * r) / denom;

  return scheme === 'advance' ? emiArrears / (1 + r) : emiArrears;
}

export function buildSchedule(
  principal: number,
  annualRate: number,
  months: number,
  scheme: EmiScheme,
  startDate: Date
): MonthRow[] {
  const rawEmi = calcRawEmi(principal, annualRate, months, scheme);
  if (rawEmi <= 0 || months <= 0) return [];

  const r = annualRate > 0 ? monthlyRate(annualRate) : 0;
  const rows: MonthRow[] = [];
  let balance = principal;

  for (let i = 1; i <= months; i++) {
    const isLast = i === months;
    const isAdvanceFirst = scheme === 'advance' && i === 1;

    let interest: number;
    let principalPaid: number;
    let payment: number;

    if (isAdvanceFirst) {
      interest = 0;
      principalPaid = Math.min(rawEmi, balance);
      payment = principalPaid;
    } else {
      interest = balance * r;
      principalPaid = rawEmi - interest;
      if (isLast || principalPaid > balance) {
        principalPaid = balance;
        payment = principalPaid + interest;
      } else {
        principalPaid = Math.max(0, principalPaid);
        payment = rawEmi;
      }
    }

    balance = Math.max(0, balance - principalPaid);
    if (isLast) balance = 0;

    rows.push({
      monthIndex: i,
      date: addMonths(startDate, i - 1),
      emi: roundRupee(payment),
      principal: roundRupee(principalPaid),
      interest: roundRupee(interest),
      balance: roundRupee(balance),
    });
  }

  return rows;
}

export function groupSchedule(schedule: MonthRow[], mode: YearMode): YearGroup[] {
  const map = new Map<string, YearGroup>();

  for (const row of schedule) {
    const label = mode === 'financial'
      ? financialYearLabel(row.date)
      : String(row.date.getFullYear());

    const existing = map.get(label);
    if (existing) {
      existing.principal += row.principal;
      existing.interest += row.interest;
      existing.emiTotal += row.emi;
      existing.closingBalance = row.balance;
      existing.months.push(row);
    } else {
      map.set(label, {
        label,
        principal: row.principal,
        interest: row.interest,
        emiTotal: row.emi,
        closingBalance: row.balance,
        months: [row],
      });
    }
  }

  return Array.from(map.values());
}

export function calculateEmi(options: {
  principal: number;
  annualRate: number;
  months: number;
  scheme: EmiScheme;
  startDate: Date;
  yearMode: YearMode;
}): EmiResult {
  const rawEmi = calcRawEmi(
    options.principal,
    options.annualRate,
    options.months,
    options.scheme
  );
  const emi = roundRupee(rawEmi);
  const schedule = buildSchedule(
    options.principal,
    options.annualRate,
    options.months,
    options.scheme,
    options.startDate
  );

  // Bank / emicalculator.net headline totals use the unrounded formula EMI × months,
  // not the sum of rupee-rounded schedule rows.
  const totalPayment = roundRupee(rawEmi * options.months);
  const totalInterest = Math.max(0, totalPayment - options.principal);

  return {
    emi,
    totalInterest,
    totalPayment,
    schedule,
    years: groupSchedule(schedule, options.yearMode),
  };
}

export function monthInputValue(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

export function dateFromMonthInput(value: string): Date {
  const [y, m] = value.split('-').map(Number);
  if (!y || !m) return new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  return new Date(y, m - 1, 1);
}

export function formatMonthLabel(date: Date): string {
  return date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
}
