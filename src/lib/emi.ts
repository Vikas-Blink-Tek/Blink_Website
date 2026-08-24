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
  rateDefault: 10,
  tenureYearsMin: 1,
  tenureYearsMax: 100,
  tenureYearsDefault: 5,
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
  const d = new Date(date.getTime());
  const day = d.getDate();
  d.setMonth(d.getMonth() + months);
  if (d.getDate() < day) d.setDate(0);
  return d;
}

export function financialYearLabel(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth();
  if (month >= 3) {
    return `FY ${year}-${String(year + 1).slice(2)}`;
  }
  return `FY ${year - 1}-${String(year).slice(2)}`;
}

export function calcRawEmi(
  principal: number,
  annualRate: number,
  months: number,
  scheme: EmiScheme
): number {
  if (principal <= 0 || months <= 0) return 0;
  if (annualRate <= 0) return principal / months;
  const r = annualRate / 12 / 100;
  const pow = Math.pow(1 + r, months);
  const emiArrears = (principal * r * pow) / (pow - 1);
  return scheme === 'advance' ? emiArrears / (1 + r) : emiArrears;
}

function roundRupee(n: number): number {
  return Math.round(n);
}

export function buildSchedule(
  principal: number,
  annualRate: number,
  months: number,
  scheme: EmiScheme,
  startDate: Date
): MonthRow[] {
  const emi = roundRupee(calcRawEmi(principal, annualRate, months, scheme));
  if (emi <= 0 || months <= 0) return [];

  const r = annualRate > 0 ? annualRate / 12 / 100 : 0;
  const rows: MonthRow[] = [];
  let balance = principal;

  const pushRow = (monthIndex: number, interest: number, principalPaid: number, payment: number) => {
    balance = Math.max(0, roundRupee((balance - principalPaid) * 100) / 100);
    if (monthIndex === months) balance = 0;
    rows.push({
      monthIndex,
      date: addMonths(startDate, monthIndex - 1),
      emi: roundRupee(payment),
      principal: roundRupee(principalPaid),
      interest: roundRupee(interest),
      balance: roundRupee(balance),
    });
  };

  if (scheme === 'advance') {
    const firstPrincipal = Math.min(emi, balance);
    pushRow(1, 0, firstPrincipal, firstPrincipal);
    for (let i = 2; i <= months; i++) {
      const interest = balance * r;
      let principalPaid = emi - interest;
      if (i === months || principalPaid > balance) {
        principalPaid = balance;
      }
      principalPaid = Math.max(0, principalPaid);
      pushRow(i, interest, principalPaid, principalPaid + interest);
    }
  } else {
    for (let i = 1; i <= months; i++) {
      const interest = balance * r;
      let principalPaid = emi - interest;
      if (i === months || principalPaid > balance) {
        principalPaid = balance;
      }
      principalPaid = Math.max(0, principalPaid);
      pushRow(i, interest, principalPaid, principalPaid + interest);
    }
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
  const schedule = buildSchedule(
    options.principal,
    options.annualRate,
    options.months,
    options.scheme,
    options.startDate
  );
  const totalPayment = schedule.reduce((sum, row) => sum + row.emi, 0);
  const totalInterest = schedule.reduce((sum, row) => sum + row.interest, 0);
  const emi = schedule[0]?.emi ?? 0;

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
