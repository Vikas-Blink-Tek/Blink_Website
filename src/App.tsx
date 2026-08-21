import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Landmark,
  ShieldCheck,
  Menu,
  X,
  ArrowRight,
  ChevronRight,
  Users,
  Phone,
  Mail,
  MapPin,
  Globe,
  Loader2,
  ChevronDown,
  HelpCircle,
  MessageCircle
} from 'lucide-react';
import Tilt from 'react-parallax-tilt';
import ReCAPTCHA from 'react-google-recaptcha';

/* ═══════════════════════════════════════════════════════════════
   NAVBAR
   ═══════════════════════════════════════════════════════════════ */
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  const links = [
    { label: 'About', href: '#about' },
    { label: 'Loans', href: '#products' },
    { label: 'How It Works', href: '#process' },
    { label: 'Team', href: '#team' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <nav
      aria-label="Main navigation"
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled
        ? 'bg-white/80 backdrop-blur-xl border-b border-black/10 py-3'
        : 'bg-transparent py-5'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3 group relative z-10" onClick={() => setOpen(false)}>
          <img src="/new_logo.png" alt="Blink Finance Logo" className="h-16 w-auto object-contain drop-shadow-md" />
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm font-bold text-foreground/70 hover:text-foreground transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          <a href="tel:8828821333" className="text-sm font-bold flex items-center gap-1.5 text-foreground/70 hover:text-foreground transition-colors">
            <Phone className="w-4 h-4" /> 8828821333
          </a>
          <a href="#apply" className="bg-foreground text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-foreground/80 transition-all hover:scale-105 shadow-md shadow-black/10">
            Apply Now
          </a>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)} aria-label="Toggle mobile menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl shadow-xl py-6 px-6 flex flex-col gap-4 md:hidden border-t border-black/10"
        >
          {links.map((l) => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)} className="text-base font-bold py-2 hover:text-foreground text-foreground/70 transition-colors">
              {l.label}
            </a>
          ))}
          <a href="#apply" className="bg-foreground text-white px-6 py-3 rounded-full text-center text-sm font-bold mt-2" onClick={() => setOpen(false)}>
            Apply Now
          </a>
        </motion.div>
      )}
    </nav>
  );
};

/* ═══════════════════════════════════════════════════════════════
   HERO – Photorealistic Bank Image Background
   ═══════════════════════════════════════════════════════════════ */
const Hero = () => (
  <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pb-12 pt-24 bg-background" aria-label="Hero - Blink Finance Loan Services">

    {/* Giant Logo Background Mask */}
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden select-none pointer-events-none z-0 -translate-y-24 md:-translate-y-32">
      <motion.div
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
        className="w-full h-full max-w-[70vw] max-h-[60vh] opacity-15 mix-blend-multiply"
        style={{
          backgroundImage: 'url("/business_bg_3d.jpg")',
          backgroundSize: '150% auto',
          backgroundRepeat: 'no-repeat',
          WebkitMaskImage: 'url("/new_logo.png")',
          maskImage: 'url("/new_logo.png")',
          WebkitMaskSize: 'contain',
          maskSize: 'contain',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskPosition: 'center',
        }}
      />
    </div>

    {/* Content */}
    <div className="w-full max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center text-center mt-auto pt-10">

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="mb-6">
        <span className="px-6 py-2 rounded-full bg-white shadow-md border border-black/5 text-foreground/90 text-sm font-bold tracking-widest uppercase">
          Your Trusted Loan DSA Partner
        </span>
      </motion.div>

      <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }} className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-foreground mb-6 leading-[1.1] drop-shadow-sm font-display">
        Right Credit. <br />
        Not Just <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-brand-pink to-brand-yellow drop-shadow-sm">Random Loans</span>
      </motion.h1>

      <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }} className="text-xl md:text-2xl text-foreground/70 mb-10 max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-sm">
        Your premier DSA partner across India. We connect you with 50+ top banks to provide lightning-fast, transparent, and tailored loan solutions.
      </motion.p>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }} className="flex flex-col sm:flex-row gap-6 w-full justify-center items-center mb-24">
        <a href="#apply" className="bg-gradient-brand text-white font-bold py-5 px-10 rounded-full hover:shadow-[0_10px_40px_rgba(29,78,216,0.3)] transition-all hover:-translate-y-1 flex items-center justify-center gap-3 text-lg w-full sm:w-auto">
          Check Eligibility <ArrowRight className="w-6 h-6" />
        </a>
        <a href="#products" className="bg-white shadow-lg border border-black/5 text-foreground font-bold py-5 px-10 rounded-full hover:bg-slate-50 transition-all hover:-translate-y-1 flex items-center justify-center gap-3 text-lg w-full sm:w-auto">
          Explore Loans <ChevronRight className="w-6 h-6" />
        </a>
      </motion.div>

      {/* Stats Strip */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7 }}
        className="w-full grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {[
          { stat: '50+', label: 'Bank & NBFC Partners', icon: <Landmark className="w-6 h-6" /> },
          { stat: '1000+', label: 'Successful Clients', icon: <Users className="w-6 h-6" /> },
          { stat: '2022', label: 'Trusted Since', icon: <ShieldCheck className="w-6 h-6" /> },
        ].map((s, i) => (
          <Tilt key={i} tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.02} transitionSpeed={2000}>
            <div className="bg-white shadow-xl border border-black/5 p-8 rounded-3xl flex flex-col items-center justify-center hover:border-brand-orange/30 transition-all h-full text-center group">
              <div className="text-brand-orange mb-3 p-3 rounded-full bg-brand-orange/10 group-hover:scale-110 transition-transform">{s.icon}</div>
              <div className="text-5xl md:text-6xl font-extrabold font-display text-foreground drop-shadow-sm whitespace-nowrap mb-2">{s.stat}</div>
              <div className="text-sm md:text-base font-bold text-foreground/60 uppercase tracking-widest">{s.label}</div>
            </div>
          </Tilt>
        ))}
      </motion.div>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════════════
   BANK PARTNERS MARQUEE
   ═══════════════════════════════════════════════════════════════ */
const BankPartners = () => {
  const banks = [
    { name: "HDFC Bank", src: "/banks/hdfc_bank.svg" },
    { name: "ICICI Bank", src: "/banks/icici_bank.svg" },
    { name: "State Bank of India", src: "/banks/sbi.svg" },
    { name: "Axis Bank", src: "/banks/axis_bank.svg" },
    { name: "Bajaj Finserv", src: "/banks/bajaj-finserv-1.svg" },
    { name: "Bank of Baroda", src: "/banks/bank-of-baroda-1.svg" },
    { name: "Punjab National Bank", src: "/banks/punjab-national-bank.svg" },
    { name: "Union Bank of India", src: "/banks/union-bank-of-india.svg" },
  ];

  // Duplicate for infinite scroll effect
  const marqueeItems = [...banks, ...banks, ...banks, ...banks, ...banks, ...banks];

  return (
    <section className="py-12 bg-white border-y border-black/10 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
        <h3 className="text-sm font-bold text-foreground/50 tracking-[0.2em] uppercase">Trusted Partnerships with 50+ Leading Institutions</h3>
      </div>

      <div className="relative flex overflow-x-hidden group">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

        <motion.div
          className="flex whitespace-nowrap gap-16 md:gap-24 px-10 items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
        >
          {marqueeItems.map((bank, idx) => (
            <div key={idx} className="flex items-center gap-4 hover:scale-110 transition-transform cursor-pointer shrink-0 opacity-60 hover:opacity-100 grayscale hover:grayscale-0">
              <img
                src={bank.src}
                alt={bank.name}
                className="h-8 md:h-12 w-auto object-contain max-w-[150px]"
                loading="lazy"
                crossOrigin="anonymous"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  if (e.currentTarget.nextElementSibling) {
                    (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'block';
                  }
                }}
              />
              <div style={{ display: 'none' }} className="text-2xl md:text-3xl font-black font-display tracking-tighter text-foreground/80">
                {bank.name}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════════
   THE STATEMENT (Scroll Reveal)
   ═══════════════════════════════════════════════════════════════ */
const TheStatement = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"]
  });

  const opacity1 = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const opacity2 = useTransform(scrollYProgress, [0.2, 0.4], [0, 1]);
  const opacity3 = useTransform(scrollYProgress, [0.4, 0.6], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1.1]);

  return (
    <section id="about" ref={ref} className="h-[150vh] bg-background text-foreground relative border-t border-black/10">
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        <motion.div style={{ scale }} className="text-center max-w-6xl">
          <motion.span style={{ opacity: opacity1 }} className="text-5xl md:text-7xl lg:text-8xl font-extrabold font-display block mb-4 tracking-tighter">
            We don't just process loans.
          </motion.span>
          <motion.span style={{ opacity: opacity2 }} className="text-5xl md:text-7xl lg:text-8xl font-extrabold font-display text-foreground/40 block mb-4 tracking-tighter">
            We finance
          </motion.span>
          <motion.span style={{ opacity: opacity3 }} className="text-6xl md:text-8xl lg:text-9xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-brand-pink to-brand-yellow block tracking-tighter drop-shadow-sm">
            your growth.
          </motion.span>
        </motion.div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════════
   THE PRODUCTS (Horizontal Scroll)
   ═══════════════════════════════════════════════════════════════ */
const TheProducts = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  // Track scroll specifically for this section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Create highly visible parallax values for the columns, but bounded so they don't hide
  // Outer columns slide UP as you scroll down
  const colOuterY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  // Middle columns slide DOWN as you scroll down
  const colInnerY = useTransform(scrollYProgress, [0, 1], [-60, 60]);

  const loans = [
    { id: '1', title: 'Home Loan', image: '/loans/home_loan.jpg', desc: 'Affordable home financing solutions with competitive interest rates, flexible tenure options, and fast-track approvals to help you secure your dream home without stress.' },
    { id: '2', title: 'Mortgage Loan', image: '/loans/mortgage_loan.jpg', desc: 'Unlock the hidden value of your property to secure high-value funds with flexible repayment structures and highly attractive interest rates.' },
    { id: '3', title: 'Personal Loan', image: '/loans/personal_loan.jpg', desc: 'Lightning-quick and hassle-free personal loans designed for medical emergencies, travel, weddings, education, or immediate lifestyle needs.' },
    { id: '4', title: 'Business Loan', image: '/loans/business_loan.jpg', desc: 'Expand your enterprise with structured financial assistance specifically designed for working capital, infrastructure, and long-term exponential growth.' },
    { id: '5', title: 'MSME Loan', image: '/loans/msme_loan.jpg', desc: 'Specialized funding support for Micro, Small & Medium Enterprises powered by government-backed schemes and incredibly easy eligibility criteria.' },
    { id: '6', title: 'Machinery Loan', image: '/loans/machinery_loan.jpg', desc: 'Finance heavy machinery, essential tools, and industrial equipment with structured repayment plans to rapidly accelerate your production capacity.' },
    { id: '7', title: 'CGTMSE Loan', image: '/loans/cgtmse_loan.jpg', desc: 'Collateral-free, stress-free loans for MSMEs strictly under the Government of India\'s CGTMSE scheme, offering extremely easy access to credit.' },
    { id: '8', title: 'Working Capital', image: '/loans/working_capital.jpg', desc: 'Ensure perfectly smooth daily operations with working capital finance solutions that effortlessly manage cash flow, supplier payments, and staff salaries.' },
    { id: '9', title: 'OD/CC', image: '/loans/od_cc.jpg', desc: 'Overdraft and cash credit facilities meticulously designed to manage liquidity efficiently, giving your business totally flexible access to on-demand funds.' },
    { id: '10', title: 'Bill Discounting', image: '/loans/bill_discounting.jpg', desc: 'Improve business cash flow instantly and securely by converting your receivables and unpaid invoices into immediate, usable working capital.' },
    { id: '11', title: 'Letter of Credit', image: '/loans/letter_of_credit.jpg', desc: 'Secure your domestic and international trade transactions completely with reliable letter of credit facilities that build absolute trust.' },
    { id: '12', title: 'Bank Guarantee', image: '/loans/bank_guarantee.jpg', desc: 'Massively strengthen your business credibility with bulletproof financial guarantees for major contracts, high-stakes tenders, and project commitments.' },
  ];

  return (
    <>
      <section ref={containerRef} className="py-32 bg-slate-50 relative overflow-hidden" id="products">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-24 relative z-10">
            <p className="text-brand-orange font-bold text-sm tracking-widest uppercase mb-3">Our Loan Services</p>
            <h2 className="text-5xl md:text-6xl font-black font-display text-purple-950 tracking-tight">
              Financial Solutions <br/>Built For You
            </h2>
          </div>

          {/* Parallax Columns Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-16 relative">
            {loans.map((loan, idx) => {
              // Assign parallax value based on column index
              const isInnerCol = idx % 4 === 1 || idx % 4 === 2;
              const parallaxY = isInnerCol ? colInnerY : colOuterY;

              return (
                <motion.div 
                  key={loan.id} 
                  layoutId={`card-${loan.id}`}
                  style={{ y: parallaxY }}
                  onClick={() => setSelectedId(loan.id)}
                  className="bg-slate-900 rounded-[2rem] flex flex-col justify-end text-left h-[340px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] cursor-pointer group hover:shadow-[0_20px_40px_rgba(236,72,153,0.3)] transition-shadow duration-500 relative overflow-hidden"
                >
                  {/* Background Image */}
                  <motion.img 
                    layoutId={`image-${loan.id}`}
                    src={loan.image} 
                    alt={loan.title} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  
                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                  
                  {/* Subtle hover background sweep */}
                  <div className="absolute inset-0 bg-brand-orange/0 group-hover:bg-brand-orange/20 transition-colors duration-500 mix-blend-overlay"></div>
                  
                  <div className="relative z-10 p-8">
                    <motion.h3 
                      layoutId={`title-${loan.id}`} 
                      className="text-2xl md:text-3xl font-black font-display text-white leading-tight mb-2"
                    >
                      {loan.title}
                    </motion.h3>
                    
                    <div className="text-brand-yellow text-xs font-bold uppercase tracking-[0.2em] opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      Explore Details &rarr;
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Click-to-Expand Modal */}
      <AnimatePresence>
        {selectedId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-purple-950/40 backdrop-blur-md"
            onClick={() => setSelectedId(null)}
          >
            {(() => {
              const loan = loans.find(l => l.id === selectedId);
              if (!loan) return null;
              
              return (
                <motion.div 
                  layoutId={`card-${loan.id}`}
                  className="bg-white rounded-[2.5rem] w-full max-w-4xl shadow-2xl relative overflow-hidden cursor-default flex flex-col md:flex-row"
                  onClick={e => e.stopPropagation()}
                >
                  {/* Image side */}
                  <div className="w-full md:w-5/12 h-64 md:h-auto relative">
                    <motion.img 
                      layoutId={`image-${loan.id}`}
                      src={loan.image} 
                      alt={loan.title} 
                      className="absolute inset-0 w-full h-full object-cover" 
                    />
                    {/* Shadow overlay to blend with text section smoothly */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/30 md:hidden"></div>
                  </div>
                  
                  {/* Content side */}
                  <div className="w-full md:w-7/12 p-8 md:p-14 relative bg-white">
                    {/* Decorative corner glow inside modal */}
                    <div className="absolute -top-32 -right-32 w-96 h-96 bg-brand-orange/10 blur-3xl rounded-full"></div>
                    <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-brand-pink/10 blur-3xl rounded-full"></div>
                    
                    <div className="relative z-10 flex flex-col h-full justify-center">
                      <motion.h3 
                        layoutId={`title-${loan.id}`} 
                        className="text-4xl md:text-5xl font-black font-display text-transparent bg-clip-text bg-gradient-to-br from-brand-pink to-brand-orange mb-6 leading-tight"
                      >
                        {loan.title}
                      </motion.h3>
                      
                      <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                        className="text-slate-600 text-lg leading-relaxed font-medium mb-10"
                      >
                        {loan.desc}
                      </motion.p>
                      
                      <div className="mt-auto">
                        <motion.button 
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 }}
                          onClick={() => setSelectedId(null)}
                          className="bg-purple-950 text-white px-8 py-3.5 rounded-full font-bold text-sm tracking-widest uppercase hover:bg-purple-900 hover:shadow-lg hover:shadow-purple-950/20 transition-all active:scale-95"
                        >
                          Close Details
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

/* ═══════════════════════════════════════════════════════════════
   THE METRICS
   ═══════════════════════════════════════════════════════════════ */
const TheMetrics = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [150, -150]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

  return (
    <section ref={ref} className="h-screen bg-background text-foreground flex items-center justify-center overflow-hidden relative border-t border-black/10">
      <motion.div style={{ y, scale }} className="text-center z-10 relative px-6">
        <div className="text-[25vw] md:text-[20vw] font-black font-display leading-[0.8] text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/5 tracking-tighter drop-shadow-sm">
          1000+
        </div>
        <div className="text-4xl md:text-7xl font-black text-brand-orange mt-8 tracking-tighter font-display">
          Loans Disbursed.
        </div>
        <div className="text-2xl md:text-3xl text-foreground/50 mt-8 font-medium">Empowering clients every single day.</div>
      </motion.div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.05)_0%,transparent_60%)] blur-3xl transform-gpu" />
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════════
   PROCESS ROADMAP (How It Works)
   ═══════════════════════════════════════════════════════════════ */
const ProcessRoadmap = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const steps = [
    { title: "Client Acquisition", desc: "Reaching potential customers through field teams, digital marketing, and local business tie-ups." },
    { title: "Loan Consultation", desc: "Assessing client needs and suggesting the best options based on CIBIL, eligibility, and preferred bank criteria." },
    { title: "Documentation & Application", desc: "Collecting, verifying, and seamlessly submitting all required documents to the selected financial institutions." },
    { title: "Bank Coordination", desc: "Actively tracking the application, resolving queries instantly, and speeding up the approval process." },
    { title: "Loan Disbursement", desc: "Once approved, the loan is disbursed directly by the lender to your account. Your dream funded." },
  ];

  return (
    <section id="process" ref={containerRef} className="py-32 relative bg-background border-t border-black/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24 relative z-10">
          <span className="text-sm font-bold text-brand-orange uppercase tracking-[0.2em]">How It Works</span>
          <h2 className="text-4xl lg:text-6xl font-black font-display mt-4 text-foreground tracking-tighter">Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-brand-pink to-brand-yellow">Process</span></h2>
          <p className="text-foreground/60 max-w-2xl mx-auto mt-6 text-lg font-medium">A transparent, 5-step journey bridging the gap between you and your financial goals.</p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Central Line Background */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-black/5 md:-translate-x-1/2 rounded-full"></div>

          {/* Glowing Animated Line */}
          <motion.div
            style={{ height }}
            className="absolute left-4 md:left-1/2 top-0 w-1 bg-gradient-to-b from-brand-orange via-brand-pink to-brand-yellow md:-translate-x-1/2 rounded-full origin-top shadow-[0_0_15px_rgba(234,88,12,0.5)] z-10"
          ></motion.div>

          <div className="space-y-12 md:space-y-24 relative z-20">
            {steps.map((step, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div key={idx} className={`flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-16 ${isEven ? 'md:flex-row-reverse' : ''}`}>

                  {/* Timeline Node */}
                  <div className="absolute left-4 md:left-1/2 w-8 h-8 -ml-3.5 md:-ml-4 rounded-full bg-white border-4 border-brand-orange shadow-lg z-20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-brand-orange"></div>
                  </div>

                  {/* Empty space for alternating layout */}
                  <div className="hidden md:block md:w-1/2"></div>

                  {/* Content Card */}
                  <div className="w-full md:w-1/2 pl-12 md:pl-0 perspective-1000">
                    <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02} transitionSpeed={2000} className="w-full">
                      <div className="bg-white rounded-3xl p-8 border border-black/10 shadow-xl hover:border-brand-orange/30 transition-colors group relative overflow-hidden">
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand-orange/5 blur-2xl rounded-full group-hover:bg-brand-orange/10 transition-all duration-500 transform-gpu"></div>
                        <h3 className="text-2xl font-black font-display text-foreground mb-3 tracking-tight"><span className="text-brand-orange mr-2">0{idx + 1}.</span> {step.title}</h3>
                        <p className="text-foreground/70 font-medium leading-relaxed">{step.desc}</p>
                      </div>
                    </Tilt>
                  </div>

                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════════
   TEAM / DIRECTORS SECTION
   ═══════════════════════════════════════════════════════════════ */
const TeamSection = () => {
  const team = [
    {
      name: "Ashish Ashok Ghadge",
      title: "Managing Partner",
      bio: "With over 5 years of experience in the financial services industry, Ashish Ghadge is the dynamic force behind Blink Finance. His vision is to create a transparent and client-centric platform that simplifies access to loans for individuals and businesses. Ashish specializes in loan consulting, relationship building, and partner network development, ensuring Blink Finance stays agile and efficient in a competitive market.",
      image: "/directors/ashish.png",
      imageStyle: "w-full h-full object-cover object-[center_30%] scale-[1.8]"
    },
    {
      name: "Rekha Ghadge",
      title: "Partner",
      bio: "Ms. Rekha Ghadge is a founding partner of Blink Finance, contributing to the company's growth through her strong commitment to organizational development and client relationships. While not from a traditional finance background, she brings valuable perspective in business coordination, stakeholder engagement, and operational support.",
      image: "/directors/rekha.png",
      imageStyle: "w-full h-full object-cover object-top"
    }
  ];

  return (
    <section id="team" className="py-24 relative bg-background overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-1/4 w-[40rem] h-[40rem] bg-[radial-gradient(circle_at_center,rgba(234,88,12,0.1)_0%,transparent_60%)] rounded-full pointer-events-none transform-gpu"></div>
      <div className="absolute bottom-0 left-1/4 w-[30rem] h-[30rem] bg-[radial-gradient(circle_at_center,rgba(0,158,95,0.1)_0%,transparent_60%)] rounded-full pointer-events-none transform-gpu"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold font-display text-foreground tracking-tight mb-4">
            Meet the <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-pink to-brand-orange">Visionaries</span>
          </h2>
          <p className="text-lg md:text-xl text-foreground/60 max-w-2xl mx-auto">
            The leadership driving Blink Finance's commitment to transparent, efficient, and client-centric financial solutions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 perspective-1000">
          {team.map((member, index) => (
            <Tilt key={index} tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02} transitionSpeed={2000} className="h-full">
              <motion.div
                initial={{ opacity: 0, y: 40, rotateX: 10 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: index * 0.2 }}
                className="h-full group relative bg-white/60 backdrop-blur-md border border-black/5 rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 overflow-hidden flex flex-col items-center text-center transform-gpu will-change-transform"
              >
                {/* Hover gradient border effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-amber/20 via-transparent to-brand-orange/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                <div className="relative w-48 h-48 md:w-56 md:h-56 mb-8 rounded-full p-2 bg-gradient-to-br from-brand-amber to-brand-orange shadow-xl group-hover:scale-105 transition-transform duration-500">
                  <div className="w-full h-full rounded-full overflow-hidden bg-white">
                    <img
                      src={member.image}
                      alt={member.name}
                      className={member.imageStyle || "w-full h-full object-cover object-top"}
                    />
                  </div>
                </div>

                <h3 className="text-3xl font-bold font-display text-foreground mb-2 group-hover:text-brand-orange transition-colors">
                  {member.name}
                </h3>
                <p className="text-brand-amber font-semibold tracking-widest uppercase text-sm mb-6">
                  {member.title}
                </p>
                <p className="text-foreground/70 leading-relaxed max-w-md mx-auto text-lg">
                  "{member.bio}"
                </p>
              </motion.div>
            </Tilt>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════════
   CLIENT SHOWCASE
   ═══════════════════════════════════════════════════════════════ */
const ClientShowcase = () => {
  const clients = [
    { name: "Chadha's", src: "/clients/chadhas_new.png" },
    { name: "HVK Logistics", src: "/clients/client_logo_2.png" },
    { name: "Al-Halal", src: "/clients/client_logo_5.png" },
    { name: "Prudence", src: "/clients/client_logo_6.png" },
  ];

  // Duplicate for infinite scroll effect
  const marqueeItems = [...clients, ...clients, ...clients, ...clients];

  return (
    <section className="py-24 bg-background border-t border-black/10 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
        <h3 className="text-xl md:text-2xl font-bold text-foreground/40 tracking-[0.2em] uppercase">Trusted by industry leaders</h3>
      </div>

      <div className="relative flex overflow-x-hidden group">
        {/* Fade Edges */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10"></div>

        <motion.div
          className="flex whitespace-nowrap gap-20 px-10 items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
        >
          {marqueeItems.map((client, idx) => (
            <div key={idx} className="flex items-center gap-4 group-hover:opacity-30 hover:!opacity-100 transition-opacity cursor-default shrink-0">
              <img src={client.src} alt={client.name} className="h-16 md:h-24 w-auto object-contain max-w-[200px]" loading="lazy" />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════════
   LEAD FORM
   ═══════════════════════════════════════════════════════════════ */
const LeadForm = () => {
  const [captchaStatus, setCaptchaStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    loanType: '',
    city: ''
  });

  const handleCaptchaChange = (token: string | null) => {
    if (token) {
      setCaptchaStatus('success');
    } else {
      setCaptchaStatus('idle');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (captchaStatus !== 'success' || !formData.name || !formData.phone || !formData.loanType || !formData.city) {
      return;
    }

    setFormStatus('submitting');

    try {
      const response = await fetch("https://formsubmit.co/ajax/info@blinkfinance.in", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          city: formData.city,
          "Loan Type": formData.loanType,
          _subject: `New Loan Inquiry from ${formData.name}`,
          _template: "table"
        })
      });

      if (response.ok) {
        setFormStatus('success');
      } else {
        console.error("Form submission failed", await response.text());
        setFormStatus('idle');
        alert("Something went wrong with the submission. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setFormStatus('idle');
      alert("Something went wrong. Please check your network connection and try again.");
    }
  };

  return (
    <section id="apply" className="py-28 relative overflow-hidden bg-background">
      <div className="max-w-4xl mx-auto px-6 relative z-10 perspective-1000">
        <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02} transitionSpeed={2000}>
          <motion.div initial={{ opacity: 0, y: 30, rotateX: 5 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }} viewport={{ once: true }} className="bg-white shadow-2xl rounded-3xl p-10 md:p-16 border border-black/10 transform-gpu min-h-[600px] flex flex-col justify-center">

            {formStatus === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10"
              >
                <div className="w-24 h-24 bg-[#009E5F]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-12 h-12 text-[#009E5F]" />
                </div>
                <h2 className="text-4xl font-extrabold font-display mb-4 text-foreground">Application Received!</h2>
                <p className="text-foreground/70 text-xl font-medium mb-8">Thank you, {formData.name.split(' ')[0] || 'there'}! Our loan experts will review your request for a {formData.loanType} and get back to you shortly.</p>
                <button
                  onClick={() => {
                    setFormStatus('idle');
                    setCaptchaStatus('idle');
                    setFormData({ name: '', phone: '', loanType: '', city: '' });
                  }}
                  className="bg-brand-orange text-white font-bold py-3 px-8 rounded-xl hover:bg-brand-orange/90 transition-colors"
                >
                  Submit Another Application
                </button>
              </motion.div>
            ) : (
              <>
                <div className="text-center mb-10">
                  <img src="/new_logo.png" alt="Blink Finance" className="h-20 w-auto object-contain mx-auto mb-6 drop-shadow-md" />
                  <h2 className="text-5xl font-extrabold font-display mb-4 text-foreground">Apply For Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-pink to-brand-orange">Loan Today</span></h2>
                  <p className="text-foreground/70 text-xl font-medium">Leave your details and our loan experts will get back to you in a blink.</p>
                </div>

                <form className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left" onSubmit={handleSubmit}>
                  <div className="flex flex-col">
                    <label className="text-base font-bold mb-2 text-foreground">Full Name *</label>
                    <input type="text" name="name" required value={formData.name} onChange={handleInputChange} placeholder="Your name" className="border border-black/20 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition-all bg-white text-foreground placeholder:text-foreground/40 shadow-sm" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold mb-2 text-foreground">Phone Number *</label>
                    <input type="tel" name="phone" required minLength={10} value={formData.phone} onChange={handleInputChange} placeholder="+91 98765 43210" className="border border-black/20 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition-all bg-white text-foreground placeholder:text-foreground/40 shadow-sm" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold mb-2 text-foreground">Loan Type *</label>
                    <select name="loanType" required value={formData.loanType} onChange={handleInputChange} className="border border-black/20 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition-all bg-white text-foreground shadow-sm">
                      <option value="" className="text-gray-900">Select loan type</option>
                      <option value="Home Loan" className="text-gray-900">Home Loan</option>
                      <option value="Mortgage Loan" className="text-gray-900">Mortgage Loan</option>
                      <option value="Personal Loan" className="text-gray-900">Personal Loan</option>
                      <option value="Business Loan" className="text-gray-900">Business Loan</option>
                      <option value="Overdraft Facility" className="text-gray-900">Overdraft Facility</option>
                      <option value="Cash Credit" className="text-gray-900">Cash Credit</option>
                      <option value="MSME / CGTSME Loan" className="text-gray-900">MSME / CGTSME Loan</option>
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold mb-2 text-foreground">City *</label>
                    <input type="text" name="city" required value={formData.city} onChange={handleInputChange} placeholder="Your City" className="border border-black/20 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition-all bg-white text-foreground placeholder:text-foreground/40 shadow-sm" />
                  </div>

                  <div className="md:col-span-2 mt-2">
                    <ReCAPTCHA
                      sitekey="6Ld4TYotAAAAADzwB9MZV1kYwJ3tTx5bQiYy9GT"
                      onChange={handleCaptchaChange}
                    />
                  </div>

                  <div className="md:col-span-2 mt-4">
                    <button
                      type="submit"
                      disabled={captchaStatus !== 'success' || formStatus === 'submitting'}
                      className={`w-full text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 text-lg ${(captchaStatus !== 'success' || formStatus === 'submitting')
                        ? 'bg-gray-400 opacity-70 cursor-not-allowed'
                        : 'bg-gradient-brand hover:-translate-y-1 active:translate-y-1 cursor-pointer'
                        }`}
                    >
                      {formStatus === 'submitting' ? (
                        <>Processing... <Loader2 className="w-5 h-5 animate-spin" /></>
                      ) : (
                        <>Submit Application <ArrowRight className="w-5 h-5" /></>
                      )}
                    </button>
                    <p className="text-xs text-foreground/40 text-center mt-4 font-medium">Your information is safe with us. We never share data with third parties.</p>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </Tilt>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════════
   FAQ SECTION — AEO (Answer Engine Optimization)
   ═══════════════════════════════════════════════════════════════ */
const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: 'How to apply for a home loan?',
      a: 'Contact Blink Finance at 8828821333 or fill out our online application form. As a trusted DSA, we connect you with 50+ bank partners including SBI, HDFC, ICICI, and Axis Bank to find the best rates. We handle all documentation and processing for a hassle-free experience.'
    },
    {
      q: 'What is a DSA (Direct Selling Agent) in banking?',
      a: 'A DSA is an authorized intermediary that connects loan seekers with banks and NBFCs. Blink Finance is a registered DSA (GST: 27ABAFB5553C1ZT) that helps customers find the right loan by comparing offers from 50+ financial institutions. DSAs do not lend money directly — they facilitate the entire loan process.'
    },
    {
      q: 'What documents are needed for a personal loan?',
      a: 'For a personal loan, you typically need: Identity Proof (Aadhaar, PAN, Passport), Address Proof (utility bills, rent agreement), Income Proof (last 3-6 months salary slips or bank statements), and Employment Proof (offer letter or business registration). Blink Finance guides you through exact requirements.'
    },
    {
      q: 'How to check loan eligibility?',
      a: 'Loan eligibility depends on your CIBIL score (ideally 700+), monthly income, existing debts, age, and employment type. Blink Finance offers free eligibility assessment — our experts evaluate your profile against 50+ bank criteria to find the best match.'
    },
    {
      q: 'What is CIBIL score and why does it matter?',
      a: 'CIBIL score is a 3-digit credit score (300-900) that reflects your creditworthiness. A score of 750+ is considered excellent. Banks use this to decide loan eligibility, interest rates, and amounts. Blink Finance helps clients understand their score and matches them with suitable lenders.'
    },
    {
      q: 'How does Blink Finance help with loan processing?',
      a: 'We provide end-to-end support: free consultation, CIBIL evaluation, matching with 50+ bank partners, complete documentation, application submission, bank coordination for faster approval, and support until disbursement. Our services are free for borrowers.'
    },
    {
      q: 'What types of loans are available for small businesses?',
      a: 'Small businesses can access: Business Loans (unsecured working capital), MSME/CGTSME Loans (government-backed up to ₹5 crore), Cash Credit (revolving facility), Overdraft Facility (flexible credit), and Mortgage/LAP (loans against property). Blink Finance specializes in MSME financing.'
    },
    {
      q: 'How long does loan approval take through Blink Finance?',
      a: 'Personal Loans: 24-72 hours. Home Loans: 7-15 working days. Business Loans: 5-10 working days. We accelerate the process with complete verified documentation and direct bank relationships.'
    },
  ];

  return (
    <section id="faq" className="py-28 relative overflow-hidden bg-background" aria-label="Frequently Asked Questions about Loans">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-sm font-bold text-brand-orange uppercase tracking-widest">FAQ</span>
          <h2 className="text-4xl lg:text-5xl font-extrabold font-display mt-3 mb-4">Frequently Asked <span className="text-gradient">Questions</span></h2>
          <p className="text-foreground/70 max-w-2xl mx-auto text-lg font-medium">Everything you need to know about loans, DSA services, and working with Blink Finance.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="rounded-2xl border border-black/10 bg-white shadow-sm overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full text-left px-8 py-6 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
                aria-expanded={openIndex === idx}
              >
                <span className="flex items-center gap-4">
                  <HelpCircle className="w-5 h-5 text-brand-orange shrink-0" />
                  <span className="font-bold text-lg text-foreground">{faq.q}</span>
                </span>
                <ChevronDown className={`w-5 h-5 text-gray-500 shrink-0 transition-transform duration-300 ${openIndex === idx ? 'rotate-180' : ''}`} />
              </button>
              {openIndex === idx && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="px-8 pb-6 pt-0"
                >
                  <p className="text-foreground/70 text-base leading-relaxed pl-9 font-medium">{faq.a}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════════════════════ */
const Footer = () => (
  <footer className="bg-foreground text-white py-20 relative overflow-hidden border-t border-black/10" id="contact" aria-label="Contact and company information">
    <div className="max-w-7xl mx-auto px-6 relative z-10">
      <div className="grid md:grid-cols-12 gap-12 items-center">
        {/* Left Side: Content & Links */}
        <div className="md:col-span-7 lg:col-span-8 bg-white/5 backdrop-blur-md rounded-3xl p-10 md:p-12 border border-white/20 shadow-2xl relative z-20">
          <div className="grid md:grid-cols-2 gap-10">
            {/* Brand Info */}
            <div className="flex flex-col">
              <div className="flex items-center gap-4 mb-8">
                <img src="/new_logo.png" alt="Blink Finance logo - trusted loan DSA partner in India" loading="lazy" className="h-24 w-auto object-contain drop-shadow-xl brightness-0 invert" />
              </div>
              <p className="text-white/90 mb-8 leading-relaxed text-base font-medium">Right Credit. Not Just Random Loans. Your trusted DSA partner bridging the gap between you and your financial goals.</p>
              <div className="flex gap-4 mt-auto">
                <a href="https://www.blinkfinance.in" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center hover:bg-brand-orange hover:border-brand-orange transition-colors">
                  <Globe className="w-5 h-5 text-white" />
                </a>
              </div>
            </div>

            {/* Links and Contact */}
            <div className="flex flex-col gap-8">
              <div>
                <h4 className="text-white font-extrabold font-display mb-5 text-xl">Contact</h4>
                <ul className="space-y-4 text-white/90 text-base font-medium">
                  <li className="flex items-start gap-4">
                    <MapPin className="w-5 h-5 text-brand-orange shrink-0 drop-shadow-sm mt-1" />
                    <span className="leading-relaxed">FF-12 and FF-13, Delta Vrindavan, G Wing, MIDC Rd, Siddhi Vinayak Nagar, Mahajan Wadi, Mira Road East, Mira Bhayandar, Maharashtra 401107</span>
                  </li>
                  <li className="flex items-center gap-4"><Phone className="w-5 h-5 text-brand-orange shrink-0 drop-shadow-sm" /> 8828821333</li>
                  <li className="flex items-center gap-4"><Mail className="w-5 h-5 text-brand-orange shrink-0 drop-shadow-sm" /> info@blinkfinance.in</li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-extrabold font-display mb-5 text-xl">Quick Links</h4>
                <ul className="space-y-3 text-white/90 text-base font-medium grid grid-cols-2 gap-x-4">
                  <li><a href="#about" className="hover:text-brand-orange transition-colors">About Us</a></li>
                  <li><a href="#products" className="hover:text-brand-orange transition-colors">Loan Products</a></li>
                  <li><a href="#process" className="hover:text-brand-orange transition-colors">How It Works</a></li>
                  <li><a href="#apply" className="hover:text-brand-orange transition-colors">Apply Now</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: 3D Transparent Image */}
        <div className="md:col-span-5 lg:col-span-4 relative z-10 flex justify-center md:justify-end cursor-pointer group">
          <Tilt tiltMaxAngleX={15} tiltMaxAngleY={15} scale={1.1} transitionSpeed={2000}>
            <a
              href="https://www.google.com/search?sca_esv=0de39d36a0190d15&rlz=1C5OZZY_enIN1197IN1203&biw=1470&bih=801&sxsrf=APpeQntkFazgZSwhyUTGWm-ntpF2bNZzZA:1786945418809&q=blink+finance+thane+address&ludocid=17907768507553525018&sa=X&ved=2ahUKEwj75a63-qaWAxX9juEIHUSHLNEQ6BN6BAg5EAI"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <img
                src="/ChatGPT_Image_Aug_16__2026__11_53_29_PM-removebg-preview.png"
                alt="Blink Finance 3D office building - click to view on Google Maps at Mira Road, Maharashtra"
                loading="lazy"
                className="w-full max-w-[400px] h-auto object-contain drop-shadow-[0_20px_50px_rgba(255,110,64,0.3)] transform md:scale-125 md:translate-x-4 group-hover:scale-110 transition-transform duration-500"
              />
            </a>
          </Tilt>
        </div>
      </div>
    </div>

    <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 text-xs text-white/50 text-center space-y-2 relative z-10">
      <p>Blink Finance is a loan facilitation/advisory service (DSA) and does not itself lend money. All loans are sanctioned and disbursed by partner banks/NBFCs at their sole discretion.</p>
      <p>GST/Udyam/Gumasta Registered | Registration: 27ABAFB5553C1ZT</p>
      <p>© {new Date().getFullYear()} Blink Finance. All rights reserved.</p>
    </div>
  </footer>
);

/* ═══════════════════════════════════════════════════════════════
   APP ROOT
   ═══════════════════════════════════════════════════════════════ */
export default function App() {
  return (
    <main id="main-content" className="w-full bg-background min-h-screen text-foreground scroll-smooth font-body relative" role="main">
      <Navbar />
      <Hero />
      <BankPartners />
      <TheStatement />
      <TheProducts />
      <TheMetrics />
      <ProcessRoadmap />
      <TeamSection />
      <ClientShowcase />
      <LeadForm />
      <FAQ />
      <Footer />

      {/* WhatsApp FAB */}
      <a
        href="https://wa.me/918828821333"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform cursor-pointer flex items-center justify-center border-2 border-white"
      >
        <MessageCircle className="w-8 h-8" />
      </a>
    </main>
  );
}
