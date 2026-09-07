import { Fragment, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Calculator,
  CheckCircle2,
  Download,
  Loader2,
  X,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  LOAN_CONFIGS,
  calculateEmi,
  compactINR,
  dateFromMonthInput,
  formatINR,
  formatMonthShort,
  formatPaidPct,
  monthInputValue,
  type EmiScheme,
  type LoanType,
  type TenureUnit,
  type YearMode,
} from '../lib/emi';
import { downloadEmiPdf } from '../lib/emiPdf';
import { submitLead } from '../lib/leads';
import { isValidIndianPhone, isValidPersonName, sanitizeInput } from '../lib/validation';
import ReCAPTCHA from 'react-google-recaptcha';

const RATE_LIMIT_MS = 60_000;
const MIN_FORM_MS = 2_500;
const RATE_STORAGE_KEY = 'bf_emi_lead_submitted_at';
const RECAPTCHA_SITE_KEY = '6LdVjpEtAAAAAHdrNOOJcGo16hpOx_xstM9VQcnM';
const LOAN_TABS: LoanType[] = ['home', 'personal', 'business', 'car'];

function currentMonthValue() {
  return monthInputValue(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
}

function DonutChart({ principal, interest }: { principal: number; interest: number }) {
  const total = Math.max(principal + interest, 1);
  const pPct = principal / total;
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const pLen = circumference * pPct;
  const iLen = circumference - pLen;

  return (
    <div className="relative w-52 h-52 mx-auto">
      <svg viewBox="0 0 180 180" className="w-full h-full -rotate-90">
        <circle cx="90" cy="90" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="26" />
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke="#0F172A"
          strokeWidth="26"
          strokeDasharray={`${pLen} ${circumference}`}
          strokeDashoffset={0}
        />
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke="#EA580C"
          strokeWidth="26"
          strokeDasharray={`${iLen} ${circumference}`}
          strokeDashoffset={-pLen}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
        <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/50">Total</span>
        <span className="text-lg font-black font-display text-foreground leading-tight">{formatINR(principal + interest)}</span>
      </div>
    </div>
  );
}

function parseLooseNumber(raw: string): number | null {
  const cleaned = raw.replace(/[₹%\s,]/g, '').trim();
  if (!cleaned || cleaned === '.' || cleaned === '-') return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function formatFieldValue(value: number, format: 'amount' | 'rate' | 'int'): string {
  if (format === 'rate') {
    const rounded = Math.round(value * 100) / 100;
    return String(rounded);
  }
  if (format === 'int') return String(Math.round(value));
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.round(value));
}

function SliderField({
  label,
  value,
  min,
  max,
  step,
  onChange,
  display,
  ticks,
  prefix,
  suffix,
  headerExtra,
  format = 'int',
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (next: number) => void;
  display: string;
  ticks: { value: number; label: string }[];
  prefix?: string;
  suffix?: string;
  headerExtra?: ReactNode;
  format?: 'amount' | 'rate' | 'int';
}) {
  const pct = max === min ? 0 : ((Math.min(max, Math.max(min, value)) - min) / (max - min)) * 100;
  const [draft, setDraft] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sliderValue = Math.min(max, Math.max(min, value));

  const commit = (raw: string) => {
    const parsed = parseLooseNumber(raw);
    if (parsed === null) {
      setDraft(null);
      return;
    }
    onChange(Math.min(max, Math.max(min, parsed)));
    setDraft(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 min-h-[28px]">
          {label ? <label className="text-sm font-bold text-foreground">{label}</label> : null}
          {headerExtra}
        </div>
        <div
          className="flex items-center gap-1 bg-slate-50 border border-black/10 rounded-xl px-3 py-1.5 cursor-text focus-within:border-brand-orange focus-within:ring-2 focus-within:ring-brand-orange/30 min-w-[9.5rem]"
          onClick={() => inputRef.current?.focus()}
        >
          {prefix ? <span className="text-sm font-bold text-foreground/50">{prefix}</span> : null}
          <input
            ref={inputRef}
            type="text"
            inputMode={format === 'rate' ? 'decimal' : 'numeric'}
            autoComplete="off"
            value={draft ?? formatFieldValue(value, format)}
            placeholder={format === 'amount' ? 'Type amount' : format === 'rate' ? 'Type rate' : 'Type tenure'}
            aria-label={label}
            onFocus={() => {
              setDraft('');
            }}
            onChange={(e) => {
              const raw = e.target.value;
              if (raw !== '' && !/^[\d,.\s]+$/.test(raw)) return;
              setDraft(raw);
              const parsed = parseLooseNumber(raw);
              if (parsed !== null && parsed >= min && parsed <= max) {
                onChange(parsed);
              }
            }}
            onBlur={(e) => commit(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') e.currentTarget.blur();
            }}
            className="emi-number w-full min-w-[6.5rem] bg-transparent text-right font-black font-display text-foreground focus:outline-none placeholder:text-foreground/30 placeholder:font-semibold"
          />
          {suffix ? <span className="text-sm font-bold text-foreground/50">{suffix}</span> : null}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={sliderValue}
        aria-label={label}
        onChange={(e) => {
          setDraft(null);
          onChange(Number(e.target.value));
        }}
        className="emi-slider w-full"
        style={{
          background: `linear-gradient(to right, #EA580C 0%, #FBBF24 ${pct}%, #e2e8f0 ${pct}%, #e2e8f0 100%)`,
        }}
      />
      <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-foreground/40">
        {ticks.map((tick) => (
          <span key={tick.label}>{tick.label}</span>
        ))}
      </div>
      <p className="text-xs font-semibold text-foreground/45">
        Click the box to type · Min {prefix || ''}{formatFieldValue(min, format)}{suffix ? ` ${suffix}` : ''} — Max {prefix || ''}{formatFieldValue(max, format)}{suffix ? ` ${suffix}` : ''}
      </p>
      <p className="sr-only">{display}</p>
    </div>
  );
}

export default function EmiCalculatorPage() {
  const [loanType, setLoanType] = useState<LoanType>('home');
  const config = LOAN_CONFIGS[loanType];

  const [principal, setPrincipal] = useState(config.amountDefault);
  const [rate, setRate] = useState(config.rateDefault);
  const [tenureUnit, setTenureUnit] = useState<TenureUnit>('years');
  const [tenure, setTenure] = useState(config.tenureYearsDefault);
  const [scheme, setScheme] = useState<EmiScheme>('arrears');
  const [yearMode, setYearMode] = useState<YearMode>('calendar');
  const [startMonth, setStartMonth] = useState(currentMonthValue);
  const [expandedYears, setExpandedYears] = useState<Set<string>>(new Set());

  const [leadOpen, setLeadOpen] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [nameError, setNameError] = useState('');
  const [captchaStatus, setCaptchaStatus] = useState<'idle' | 'success'>('idle');
  const [leadStatus, setLeadStatus] = useState<'idle' | 'submitting' | 'ready' | 'downloading'>('idle');
  const [leadAgreed, setLeadAgreed] = useState(false);
  const lastSubmitRef = useRef(0);
  const formOpenedAtRef = useRef(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'EMI Calculator | Blink Finance — Home, Personal, Business & Car Loan EMI';
    return () => {
      document.title = 'Blink Finance — Best Loan DSA in Mumbai | Home, Personal, Business Loan Agent in Mira Road';
    };
  }, []);

  const applyLoanType = (next: LoanType) => {
    setLoanType(next);
    if (!LOAN_CONFIGS[next].showAdvanceScheme) setScheme('arrears');
  };

  const months = tenureUnit === 'years'
    ? Math.max(1, Math.round(tenure * 12))
    : Math.max(1, Math.round(tenure));
  const minTenure = tenureUnit === 'years' ? config.tenureYearsMin : 1;
  const maxTenure = tenureUnit === 'years' ? config.tenureYearsMax : config.tenureYearsMax * 12;

  const result = useMemo(
    () =>
      calculateEmi({
        principal,
        annualRate: rate,
        months,
        scheme: config.showAdvanceScheme ? scheme : 'arrears',
        startDate: dateFromMonthInput(startMonth),
        yearMode,
      }),
    [principal, rate, months, scheme, config.showAdvanceScheme, startMonth, yearMode]
  );

  useEffect(() => {
    setExpandedYears(new Set(result.years[0] ? [result.years[0].label] : []));
  }, [result.years]);

  const toggleYear = (label: string) => {
    setExpandedYears((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  const allYearsExpanded = result.years.length > 0 && result.years.every((year) => expandedYears.has(year.label));

  const amountTicks = [0, 0.25, 0.5, 0.75, 1].map((p) => {
    const value = config.amountMin + (config.amountMax - config.amountMin) * p;
    return { value, label: compactINR(value) };
  });

  const handleLeadContinue = async (e: React.FormEvent) => {
    e.preventDefault();

    if (honeypot) {
      setLeadStatus('ready');
      return;
    }

    if (captchaStatus !== 'success') {
      return;
    }

    if (!leadAgreed) {
      return;
    }

    const cleanName = sanitizeInput(leadName);
    const cleanPhone = sanitizeInput(leadPhone);

    if (!isValidPersonName(cleanName)) {
      setNameError('Please enter a valid name (letters only, at least 2 characters)');
      return;
    }

    if (!isValidIndianPhone(cleanPhone)) {
      setPhoneError('Please enter a valid 10-digit Indian phone number');
      return;
    }

    const elapsed = Date.now() - formOpenedAtRef.current;
    if (elapsed < MIN_FORM_MS) {
      return;
    }

    const storedAt = Number(sessionStorage.getItem(RATE_STORAGE_KEY) || lastSubmitRef.current || 0);
    const now = Date.now();
    if (storedAt && now - storedAt < RATE_LIMIT_MS) {
      const secondsLeft = Math.ceil((RATE_LIMIT_MS - (now - storedAt)) / 1000);
      alert(`Please wait ${secondsLeft} seconds before submitting again.`);
      return;
    }

    lastSubmitRef.current = now;
    sessionStorage.setItem(RATE_STORAGE_KEY, String(now));
    setLeadStatus('submitting');

    try {
      const submitted = await submitLead({
        Form: 'EMI PDF Download',
        name: cleanName,
        phone: cleanPhone,
        'Loan Type': config.label,
        'Loan Amount': formatINR(principal),
        'Interest Rate': `${rate}%`,
        Tenure: `${months} months`,
        EMI: formatINR(result.emi),
        'Total Interest': formatINR(result.totalInterest),
        'Total Payment': formatINR(result.totalPayment),
        _subject: `EMI PDF — ${cleanName} — ${config.label}`,
      });

      if (!submitted.ok) {
        setLeadStatus('idle');
        alert('Something went wrong. Please try again.');
        return;
      }
    } catch {
      setLeadStatus('idle');
      alert('Something went wrong. Please check your network connection and try again.');
      return;
    }

    setLeadStatus('ready');
  };

  const handleDownload = async () => {
    if (leadStatus !== 'ready' && leadStatus !== 'downloading') return;
    setLeadStatus('downloading');
    try {
      await downloadEmiPdf({
        name: sanitizeInput(leadName) || 'Customer',
        loan: config,
        principal,
        annualRate: rate,
        months,
        scheme: config.showAdvanceScheme ? scheme : 'arrears',
        result,
      });
    } finally {
      setLeadStatus('ready');
    }
  };

  const closeLead = () => {
    setLeadOpen(false);
    setLeadStatus('idle');
    setPhoneError('');
    setNameError('');
    setHoneypot('');
    setCaptchaStatus('idle');
    setLeadAgreed(false);
  };

  const openLead = () => {
    setLeadOpen(true);
    setLeadStatus('idle');
    setCaptchaStatus('idle');
    formOpenedAtRef.current = Date.now();
  };

  return (
    <main id="main-content" className="w-full bg-background min-h-screen text-foreground scroll-smooth font-body relative">
      <Navbar alwaysSolid />

      <section className="pt-32 pb-12 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[36rem] h-[36rem] bg-[radial-gradient(circle_at_center,rgba(234,88,12,0.12)_0%,transparent_60%)] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <span className="px-6 py-2 rounded-full bg-white shadow-md border border-black/5 text-foreground/90 text-sm font-bold tracking-widest uppercase inline-flex items-center gap-2">
            <Calculator className="w-4 h-4 text-brand-orange" />
            Free Loan EMI Calculator
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold font-display text-foreground mt-6 mb-4 leading-[1.1]">
            Calculate your <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-brand-pink to-brand-yellow">loan EMI</span>
          </h1>
          <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto font-medium">
            Instantly check monthly payments, total interest, and the full repayment schedule for home, personal, business, and car loans.
          </p>
        </div>
      </section>

      <section className="px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {LOAN_TABS.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => applyLoanType(id)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                  loanType === id
                    ? 'bg-gradient-brand text-white shadow-lg shadow-brand-orange/20'
                    : 'bg-white border border-black/10 text-foreground/70 hover:border-brand-orange/40'
                }`}
              >
                {LOAN_CONFIGS[id].label}
              </button>
            ))}
          </div>
          <p className="text-center text-sm font-semibold text-foreground/50 mt-4">
            Amount ₹1,000 – ₹100 Cr  ·  Interest 1% – 100%  ·  Tenure 1 – 100 years
          </p>
        </div>
      </section>

      <section className="px-6 pb-16">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white rounded-[2rem] border border-black/10 shadow-xl p-6 md:p-10 space-y-10">
            <SliderField
              key="amount"
              label={`${config.label} Amount`}
              value={principal}
              min={config.amountMin}
              max={config.amountMax}
              step={config.amountStep}
              onChange={setPrincipal}
              display={formatINR(principal)}
              prefix="₹"
              format="amount"
              ticks={amountTicks}
            />

            <SliderField
              key="rate"
              label="Interest Rate"
              value={rate}
              min={config.rateMin}
              max={config.rateMax}
              step={config.rateStep}
              onChange={setRate}
              display={`${rate}%`}
              suffix="%"
              format="rate"
              ticks={[config.rateMin, (config.rateMin + config.rateMax) / 2, config.rateMax].map((v) => ({
                value: v,
                label: `${Number.isInteger(v) ? v : v.toFixed(1)}${v === config.rateMax ? '%' : ''}`,
              }))}
            />

            <SliderField
              key={`tenure-${tenureUnit}`}
              label="Loan Tenure"
              value={tenure}
              min={minTenure}
              max={maxTenure}
              step={1}
              onChange={setTenure}
              display={`${tenure} ${tenureUnit}`}
              suffix={tenureUnit === 'years' ? 'Yr' : 'Mo'}
              format="int"
              ticks={[minTenure, Math.round((minTenure + maxTenure) / 2), maxTenure].map((v) => ({
                value: v,
                label: String(v),
              }))}
              headerExtra={
                <div className="flex rounded-full bg-slate-100 p-1">
                  {(['years', 'months'] as TenureUnit[]).map((unit) => (
                    <button
                      key={unit}
                      type="button"
                      onClick={() => {
                        if (unit === tenureUnit) return;
                        if (unit === 'months') {
                          const nextMax = config.tenureYearsMax * 12;
                          setTenure(Math.min(nextMax, Math.max(1, Math.round(tenure * 12))));
                        } else {
                          setTenure(Math.min(config.tenureYearsMax, Math.max(config.tenureYearsMin, Math.round(tenure / 12))));
                        }
                        setTenureUnit(unit);
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        tenureUnit === unit ? 'bg-foreground text-white' : 'text-foreground/60'
                      }`}
                    >
                      {unit === 'years' ? 'Yr' : 'Mo'}
                    </button>
                  ))}
                </div>
              }
            />

            {config.showAdvanceScheme && (
              <div>
                <p className="text-sm font-bold text-foreground mb-3">EMI Scheme</p>
                <div className="flex flex-wrap gap-3">
                  {([
                    { id: 'advance', label: 'EMI in Advance' },
                    { id: 'arrears', label: 'EMI in Arrears' },
                  ] as const).map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setScheme(option.id)}
                      className={`px-5 py-2.5 rounded-full text-sm font-bold border transition-all ${
                        scheme === option.id
                          ? 'bg-foreground text-white border-foreground'
                          : 'bg-white text-foreground/70 border-black/10 hover:border-brand-orange/40'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-[2rem] border border-black/10 shadow-xl p-6 md:p-8">
              <div className="grid grid-cols-1 gap-4">
                <div className="rounded-2xl bg-slate-50 border border-black/5 p-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-foreground/50 mb-1">Monthly EMI</p>
                  <p className="text-4xl font-black font-display text-foreground">{formatINR(result.emi)}</p>
                  <p className="text-xs font-semibold text-foreground/45 mt-1">Payable every month</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-orange-50 border border-brand-orange/10 p-5">
                    <p className="text-xs font-bold uppercase tracking-widest text-brand-orange mb-1">Total Interest</p>
                    <p className="text-xl font-black font-display text-foreground">{formatINR(result.totalInterest)}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 border border-black/5 p-5">
                    <p className="text-xs font-bold uppercase tracking-widest text-foreground/50 mb-1">Total Payment</p>
                    <p className="text-xl font-black font-display text-foreground">{formatINR(result.totalPayment)}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <DonutChart principal={principal} interest={result.totalInterest} />
                <div className="flex justify-center gap-6 mt-4 text-sm font-bold">
                  <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-foreground" /> Principal</span>
                  <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-brand-orange" /> Interest</span>
                </div>
              </div>

              <button
                type="button"
                onClick={openLead}
                className="mt-8 w-full bg-gradient-brand text-white font-bold py-4 rounded-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 text-lg shadow-lg shadow-brand-orange/20"
              >
                Download PDF <Download className="w-5 h-5" />
              </button>
              <Link
                to="/#apply"
                className="mt-3 w-full bg-white border border-black/10 text-foreground font-bold py-3.5 rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
              >
                Apply for this loan <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-16">
        <div className="max-w-7xl mx-auto bg-white rounded-[2rem] border border-black/10 shadow-xl p-6 md:p-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <p className="text-brand-orange font-bold text-sm tracking-widest uppercase mb-2">Repayment Schedule</p>
              <h2 className="text-3xl md:text-4xl font-black font-display">Your EMI break-up</h2>
              <p className="text-sm text-foreground/60 font-medium mt-2 max-w-xl">
                Each EMI is Principal (A) + Interest (B). Click <span className="font-bold text-foreground">+</span> on a year to see every month.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <label className="flex items-center gap-2 text-sm font-bold text-foreground/70">
                Starting from
                <input
                  type="month"
                  value={startMonth}
                  onChange={(e) => setStartMonth(e.target.value)}
                  className="border border-black/10 rounded-xl px-3 py-2 bg-slate-50 font-bold text-foreground"
                />
              </label>
              <div className="flex rounded-full bg-slate-100 p-1">
                {([
                  { id: 'calendar', label: 'Calendar Year' },
                  { id: 'financial', label: 'Financial Year' },
                ] as const).map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setYearMode(option.id)}
                    className={`px-4 py-2 rounded-full text-xs font-bold ${
                      yearMode === option.id ? 'bg-foreground text-white' : 'text-foreground/60'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  if (allYearsExpanded) setExpandedYears(new Set());
                  else setExpandedYears(new Set(result.years.map((year) => year.label)));
                }}
                className="px-4 py-2 rounded-full text-xs font-bold border border-black/10 bg-white hover:border-brand-orange/40"
              >
                {allYearsExpanded ? 'Collapse all' : 'Expand all months'}
              </button>
            </div>
          </div>

          {result.years.length > 0 && (
            <div className="overflow-x-auto pb-4 mb-10">
              <div className="flex items-end gap-2 min-w-[640px] h-48">
                {result.years.map((year) => {
                  const max = Math.max(...result.years.map((y) => y.principal + y.interest), 1);
                  return (
                    <div key={year.label} className="flex-1 min-w-[18px] flex flex-col justify-end items-center gap-1 h-full">
                      <div className="w-full flex flex-col justify-end h-40 rounded-t-md overflow-hidden">
                        <div className="w-full bg-foreground" style={{ height: `${(year.principal / max) * 100}%` }} />
                        <div className="w-full bg-brand-orange" style={{ height: `${(year.interest / max) * 100}%` }} />
                      </div>
                      <span className="text-[10px] font-bold text-foreground/50 rotate-0">{year.label.replace('FY ', '')}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="overflow-x-auto max-h-[36rem] overflow-y-auto rounded-xl border border-black/10">
            <table className="w-full text-sm min-w-[760px]">
              <thead className="sticky top-0 z-10">
                <tr className="text-center text-[11px] font-bold uppercase tracking-wide">
                  <th className="py-3 px-3 text-left bg-slate-100 text-foreground">Year</th>
                  <th className="py-3 px-3 text-right bg-amber-600 text-white">Principal (A)</th>
                  <th className="py-3 px-3 text-right bg-brand-orange text-white">Interest (B)</th>
                  <th className="py-3 px-3 text-right bg-slate-200 text-foreground">Total Payment (A + B)</th>
                  <th className="py-3 px-3 text-right bg-rose-600 text-white">Balance</th>
                  <th className="py-3 px-3 text-right bg-foreground text-white">Loan Paid To Date</th>
                </tr>
              </thead>
              <tbody>
                {result.years.map((year, yearIndex) => {
                  const open = expandedYears.has(year.label);
                  return (
                    <Fragment key={year.label}>
                      <tr
                        className={`border-b border-black/5 cursor-pointer ${yearIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-orange-50/60`}
                        onClick={() => toggleYear(year.label)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            toggleYear(year.label);
                          }
                        }}
                        tabIndex={0}
                        aria-expanded={open}
                      >
                        <td className="py-3 px-3 font-bold">
                          <span className="inline-flex items-center gap-2">
                            <span className="inline-flex w-5 h-5 items-center justify-center rounded-sm border border-black/25 text-xs font-black leading-none bg-white">
                              {open ? '−' : '+'}
                            </span>
                            {year.label}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-semibold">{formatINR(year.principal)}</td>
                        <td className="py-3 px-3 text-right font-semibold text-brand-orange">{formatINR(year.interest)}</td>
                        <td className="py-3 px-3 text-right font-semibold">{formatINR(year.emiTotal)}</td>
                        <td className="py-3 px-3 text-right font-semibold">{formatINR(year.closingBalance)}</td>
                        <td className="py-3 px-3 text-right font-semibold">{formatPaidPct(year.paidToDatePct)}</td>
                      </tr>
                      {open &&
                        year.months.map((row, monthIndex) => (
                          <tr
                            key={`${year.label}-${row.monthIndex}`}
                            className={`border-b border-black/5 text-foreground/80 ${monthIndex % 2 === 0 ? 'bg-orange-50/40' : 'bg-white'}`}
                          >
                            <td className="py-2 px-3 pl-12">{formatMonthShort(row.date)}</td>
                            <td className="py-2 px-3 text-right">{formatINR(row.principal)}</td>
                            <td className="py-2 px-3 text-right text-brand-orange">{formatINR(row.interest)}</td>
                            <td className="py-2 px-3 text-right">{formatINR(row.emi)}</td>
                            <td className="py-2 px-3 text-right">{formatINR(row.balance)}</td>
                            <td className="py-2 px-3 text-right">{formatPaidPct(row.paidToDatePct)}</td>
                          </tr>
                        ))}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-4 grid sm:grid-cols-3 gap-3 text-xs font-medium text-foreground/60">
            <p><span className="font-bold text-amber-700">Principal (A)</span> — the part that reduces your loan.</p>
            <p><span className="font-bold text-brand-orange">Interest (B)</span> — the charge on the remaining balance that month.</p>
            <p><span className="font-bold text-foreground">A + B</span> — your fixed monthly EMI. Paid to date is how much of the original loan is cleared.</p>
          </div>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black font-display mb-6">What is EMI?</h2>
          <div className="space-y-5 text-foreground/70 text-lg leading-relaxed font-medium">
            <p>
              Equated Monthly Installment (EMI) is the fixed amount you repay every month until the loan is fully paid. Each EMI has two parts: interest on the outstanding balance, and a portion of the principal.
            </p>
            <p>
              Early in the tenure, a larger share goes to interest. As the outstanding principal falls, more of each EMI reduces the loan itself. Your monthly amount stays the same; only the mix of principal and interest changes.
            </p>
            <div className="bg-white border border-black/10 rounded-3xl p-6 md:p-8 shadow-sm">
              <p className="text-sm font-bold uppercase tracking-widest text-brand-orange mb-3">EMI formula</p>
              <p className="font-display font-black text-xl md:text-2xl text-foreground mb-4">
                EMI = P × r × (1 + r)<sup>n</sup> / ((1 + r)<sup>n</sup> − 1)
              </p>
              <ul className="space-y-2 text-base">
                <li><span className="font-bold text-foreground">P</span> — principal loan amount</li>
                <li><span className="font-bold text-foreground">r</span> — monthly interest rate (annual rate / 12 / 100)</li>
                <li><span className="font-bold text-foreground">n</span> — tenure in months</li>
              </ul>
              <p className="mt-4 text-base">
                Example: ₹10,00,000 at 10.5% for 10 years is a <span className="font-bold text-foreground">monthly EMI of ₹13,493</span> — the same figure SBI, HDFC, and emicalculator.net show. Over 120 months you repay ₹16,19,220, of which ₹6,19,220 is interest.
              </p>
            </div>
            <p>
              Interest rates can move on floating-rate loans. Recalculate with a lower rate (optimistic) and a higher rate (pessimistic) so you know the EMI you can comfortably afford before you apply.
            </p>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {leadOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-purple-950/40 backdrop-blur-md"
            onClick={closeLead}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl relative overflow-hidden p-8 md:p-10"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={closeLead}
                className="absolute top-5 right-5 text-foreground/40 hover:text-foreground"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {leadStatus === 'ready' || leadStatus === 'downloading' ? (
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#009E5F]/10 rounded-full flex items-center justify-center mx-auto mb-5">
                    <CheckCircle2 className="w-8 h-8 text-[#009E5F]" />
                  </div>
                  <h3 className="text-2xl font-black font-display mb-2">Your report is ready</h3>
                  <p className="text-foreground/70 font-medium mb-8">
                    Thanks{leadName ? `, ${leadName.split(' ')[0]}` : ''}. Download your branded EMI schedule PDF.
                  </p>
                  <button
                    type="button"
                    onClick={handleDownload}
                    disabled={leadStatus === 'downloading'}
                    className="w-full bg-gradient-brand text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {leadStatus === 'downloading' ? (
                      <>Preparing PDF <Loader2 className="w-5 h-5 animate-spin" /></>
                    ) : (
                      <>Download PDF <Download className="w-5 h-5" /></>
                    )}
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-black font-display mb-2">Download EMI report</h3>
                  <p className="text-foreground/70 font-medium mb-6">
                    Enter your name and phone number to generate a printable PDF of this calculation.
                  </p>
                  <form className="space-y-4" onSubmit={handleLeadContinue}>
                    <div className="absolute opacity-0 top-0 left-0 h-0 w-0 -z-10" aria-hidden="true">
                      <label htmlFor="website_url">Website</label>
                      <input
                        type="text"
                        id="website_url"
                        name="website_url"
                        tabIndex={-1}
                        autoComplete="off"
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm font-bold mb-2">Full Name *</label>
                      <input
                        type="text"
                        required
                        maxLength={80}
                        autoComplete="name"
                        value={leadName}
                        onChange={(e) => {
                          setLeadName(e.target.value);
                          setNameError('');
                        }}
                        placeholder="Your name"
                        className={`border rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange bg-white ${
                          nameError ? 'border-red-500' : 'border-black/20'
                        }`}
                      />
                      {nameError && <p className="text-red-500 text-xs mt-1 font-medium">{nameError}</p>}
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm font-bold mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        autoComplete="tel"
                        maxLength={15}
                        value={leadPhone}
                        onChange={(e) => {
                          setLeadPhone(e.target.value);
                          setPhoneError('');
                        }}
                        placeholder="+91 98765 43210"
                        className={`border rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange bg-white ${
                          phoneError ? 'border-red-500' : 'border-black/20'
                        }`}
                      />
                      {phoneError && <p className="text-red-500 text-xs mt-1 font-medium">{phoneError}</p>}
                    </div>
                    <div>
                      <ReCAPTCHA
                        sitekey={RECAPTCHA_SITE_KEY}
                        onChange={(token) => setCaptchaStatus(token ? 'success' : 'idle')}
                        onExpired={() => setCaptchaStatus('idle')}
                      />
                    </div>
                    <label className="flex items-start gap-3 text-xs text-foreground/70 font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        required
                        checked={leadAgreed}
                        onChange={(e) => setLeadAgreed(e.target.checked)}
                        className="mt-0.5 accent-brand-orange shrink-0"
                      />
                      <span>
                        I agree to the{' '}
                        <Link to="/terms" className="text-brand-orange font-bold hover:underline">Terms</Link>
                        {' '}and{' '}
                        <Link to="/privacy-policy" className="text-brand-orange font-bold hover:underline">Privacy Policy</Link>.
                      </span>
                    </label>
                    <button
                      type="submit"
                      disabled={!leadAgreed || captchaStatus !== 'success' || leadStatus === 'submitting'}
                      className={`w-full text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 ${
                        !leadAgreed || captchaStatus !== 'success' || leadStatus === 'submitting'
                          ? 'bg-gray-400 opacity-70 cursor-not-allowed'
                          : 'bg-gradient-brand'
                      }`}
                    >
                      {leadStatus === 'submitting' ? (
                        <>Please wait <Loader2 className="w-5 h-5 animate-spin" /></>
                      ) : (
                        <>Continue <ArrowRight className="w-5 h-5" /></>
                      )}
                    </button>
                    <p className="text-xs text-foreground/40 text-center">We use this only to share your report and assist with loan options. We never sell your data.</p>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}
