import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  BarChart3,
  Briefcase,
  Building2,
  CheckCircle2,
  FileText,
  Home,
  Landmark,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  ShieldCheck,
  X,
} from 'lucide-react';

/** Sister website — the loan DSA brand. */
const BLINK_FINANCE_URL = 'https://blinkfinance.in';

const PHONE = '8828821333';
const EMAIL = 'info@blinkfinance.in';
const ADDRESS = 'FF-12 and FF-13, Delta Vrindavan, G Wing, MIDC Rd, Siddhi Vinayak Nagar, Mahajan Wadi, Mira Road East, Mira Bhayandar, Maharashtra 401107';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.7 },
};

/* ═══════════════════════════════════════════════════════════════
   LOGO
   ═══════════════════════════════════════════════════════════════ */
const Logo = ({ onDark = false }: { onDark?: boolean }) => (
  <a href="#top" aria-label="Blink Fin-Advisory home" className={onDark ? 'inline-block bg-white rounded-2xl px-4 py-3' : 'inline-block'}>
    <img src="/logo.webp" alt="Blink Fin-Advisory logo" width={1686} height={933} className={onDark ? 'h-14 w-auto' : 'h-12 md:h-14 w-auto'} />
  </a>
);

/* ═══════════════════════════════════════════════════════════════
   NAVBAR
   ═══════════════════════════════════════════════════════════════ */
const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Recognition', href: '#awards' },
  { label: 'Leadership', href: '#leadership' },
  { label: 'Contact', href: '#contact' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav aria-label="Main navigation" className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled || open ? 'bg-paper/90 backdrop-blur-xl border-b border-ink/10 py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Logo />
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((l) => (
            <a key={l.label} href={l.href} className="text-sm font-semibold text-ink/70 hover:text-ink transition-colors">{l.label}</a>
          ))}
          <a href={BLINK_FINANCE_URL} target="_blank" rel="noopener" className="text-sm font-semibold text-flame hover:underline inline-flex items-center gap-1">
            Blink Finance <ArrowUpRight className="w-4 h-4" />
          </a>
          <a href="#contact" className="bg-gradient-to-r from-flame to-berry text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:opacity-90 transition-colors">Book a Consultation</a>
        </div>
        <button className="lg:hidden p-2 text-ink" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      {open && (
        <div className="lg:hidden max-w-7xl mx-auto px-6 pt-4 pb-6 flex flex-col gap-4">
          {navLinks.map((l) => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)} className="text-base font-semibold text-ink/80">{l.label}</a>
          ))}
          <a href={BLINK_FINANCE_URL} target="_blank" rel="noopener" className="text-base font-semibold text-flame inline-flex items-center gap-1">
            Visit Blink Finance <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      )}
    </nav>
  );
};

/* ═══════════════════════════════════════════════════════════════
   HERO
   ═══════════════════════════════════════════════════════════════ */
const Hero = () => (
  <section id="top" className="relative pt-36 pb-24 md:pt-44 md:pb-32 overflow-hidden">
    <div className="absolute -top-40 -right-40 w-[42rem] h-[42rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(244,81,30,0.16)_0%,transparent_65%)] pointer-events-none" />
    <div className="max-w-7xl mx-auto px-6 relative grid lg:grid-cols-12 gap-12 items-center">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="lg:col-span-7">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-flame/10 text-ink text-xs font-bold tracking-[0.2em] uppercase">
          <Award className="w-4 h-4 text-flame" /> Best Consultant in Mumbai
        </span>
        <h1 className="mt-6 text-5xl md:text-6xl lg:text-7xl font-bold text-ink leading-[1.05]">
          Financial advice <br className="hidden md:block" />
          you can <span className="text-transparent bg-clip-text bg-gradient-to-r from-flame via-berry to-magenta">build on.</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-ink/70 max-w-xl leading-relaxed">
          Blink Fin-Advisory Pvt. Ltd. helps individuals and businesses plan, structure and secure the right finance — with clear, independent guidance at every step.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <a href="#contact" className="bg-gradient-to-r from-flame to-berry text-white font-semibold px-8 py-4 rounded-full inline-flex items-center justify-center gap-2 hover:opacity-90 shadow-lg shadow-flame/25 transition-colors">
            Book a Consultation <ArrowRight className="w-5 h-5" />
          </a>
          <a href="#services" className="border border-ink/20 text-ink font-semibold px-8 py-4 rounded-full inline-flex items-center justify-center hover:border-ink/50 transition-colors">
            Explore Services
          </a>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15 }} className="lg:col-span-5">
        <div className="bg-ink text-white rounded-[2rem] p-8 md:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-magenta/30 blur-3xl" />
          <p className="text-flame text-xs font-bold tracking-[0.25em] uppercase">At a glance</p>
          <dl className="mt-6 grid grid-cols-2 gap-6 relative">
            {[
              { k: '1000+', v: 'Clients advised' },
              { k: '50+', v: 'Bank & NBFC relationships' },
              { k: '2022', v: 'Serving since' },
              { k: 'Mumbai', v: 'Award-winning consultant' },
            ].map((s) => (
              <div key={s.v}>
                <dt className="font-display text-3xl md:text-4xl font-bold">{s.k}</dt>
                <dd className="text-white/60 text-sm mt-1">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </motion.div>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════════════
   ABOUT
   ═══════════════════════════════════════════════════════════════ */
const About = () => (
  <section id="about" className="py-24 bg-white border-y border-ink/10 scroll-mt-20">
    <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-14 items-start">
      <motion.div {...fadeUp}>
        <p className="text-flame font-bold text-xs tracking-[0.25em] uppercase">About the company</p>
        <h2 className="mt-4 text-4xl md:text-5xl font-bold text-ink leading-tight">Advisory first. Products second.</h2>
      </motion.div>
      <motion.div {...fadeUp} transition={{ duration: 0.7, delay: 0.1 }} className="space-y-5 text-ink/70 text-lg leading-relaxed">
        <p>
          Blink Fin-Advisory Pvt. Ltd. is a Mumbai-based financial advisory company. We start by understanding your goals, cash flows and credit profile, then recommend the structure and lender that genuinely fits — not just the fastest sanction.
        </p>
        <p>
          Our team grew out of <a href={BLINK_FINANCE_URL} target="_blank" rel="noopener" className="text-flame font-semibold hover:underline">Blink Finance</a>, our trusted loan DSA brand. Blink Finance continues to serve customers who are ready to apply for a loan, while Blink Fin-Advisory focuses on planning, structuring and consulting.
        </p>
      </motion.div>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════════════
   SERVICES
   ═══════════════════════════════════════════════════════════════ */
const services = [
  { icon: Briefcase, title: 'Business Finance Advisory', desc: 'Planning term loans, expansion funding and the right mix of secured and unsecured credit for your business.' },
  { icon: BarChart3, title: 'Working Capital Structuring', desc: 'Sizing and structuring CC/OD limits, bill discounting and trade finance around your real cash cycle.' },
  { icon: Home, title: 'Home & Property Finance', desc: 'Guidance on home loans, loan against property and balance transfers to lower your total cost of borrowing.' },
  { icon: ShieldCheck, title: 'Credit Profile Guidance', desc: 'Understanding your CIBIL score and eligibility, and the steps that improve your chances of approval.' },
  { icon: FileText, title: 'Documentation & Project Reports', desc: 'Help preparing financials, CMA data and project reports that lenders expect to see.' },
  { icon: Landmark, title: 'Government Scheme Advisory', desc: 'Navigating MSME and CGTMSE-backed schemes to access collateral-free or subsidised credit.' },
];

const Services = () => (
  <section id="services" className="py-24 scroll-mt-20">
    <div className="max-w-7xl mx-auto px-6">
      <motion.div {...fadeUp} className="max-w-2xl">
        <p className="text-flame font-bold text-xs tracking-[0.25em] uppercase">What we do</p>
        <h2 className="mt-4 text-4xl md:text-5xl font-bold text-ink leading-tight">Advisory services</h2>
      </motion.div>
      <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s, i) => (
          <motion.div
            key={s.title}
            {...fadeUp}
            transition={{ duration: 0.6, delay: (i % 3) * 0.08 }}
            className="bg-white rounded-3xl p-8 border border-ink/10 hover:border-flame/50 hover:shadow-xl transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-flame to-magenta grid place-items-center text-white"><s.icon className="w-6 h-6" /></div>
            <h3 className="mt-6 text-2xl font-semibold text-ink">{s.title}</h3>
            <p className="mt-3 text-ink/65 leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════════════
   AWARD
   ═══════════════════════════════════════════════════════════════ */
const AwardSection = () => (
  <section id="awards" className="py-24 bg-ink text-white overflow-hidden relative scroll-mt-20">
    <div className="absolute top-0 left-1/4 w-[40rem] h-[40rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(194,19,155,0.25)_0%,transparent_60%)] pointer-events-none" />
    <div className="max-w-6xl mx-auto px-6 relative grid lg:grid-cols-2 gap-14 items-center">
      <motion.div {...fadeUp} className="relative mx-auto w-full max-w-md">
        <div className="rounded-[2rem] p-2 bg-gradient-to-br from-sun via-flame to-magenta shadow-2xl">
          <img
            src="/awards/best-consultant-mumbai.jpg"
            alt="Blink Fin-Advisory receiving the Best Consultant in Mumbai award at the Luxury Lifestyle & Business Awards"
            width={948}
            height={1600}
            loading="lazy"
            className="w-full h-auto rounded-[1.6rem]"
          />
        </div>
        <div className="absolute -bottom-6 -right-2 md:-right-6 bg-white text-ink rounded-2xl shadow-xl px-5 py-4 flex items-center gap-3">
          <Award className="w-7 h-7 text-flame" />
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/50">Winner</div>
            <div className="text-sm font-bold">Best Consultant · Mumbai</div>
          </div>
        </div>
      </motion.div>

      <motion.div {...fadeUp} transition={{ duration: 0.7, delay: 0.1 }}>
        <p className="text-flame font-bold text-xs tracking-[0.25em] uppercase">Recognition</p>
        <h2 className="mt-4 text-4xl md:text-5xl font-bold leading-tight">Awarded Best Consultant in Mumbai</h2>
        <p className="mt-6 text-white/70 text-lg leading-relaxed">
          We were honoured as the <strong className="text-white">Best Consultant in Mumbai</strong> at the <strong className="text-white">Luxury Lifestyle &amp; Business Awards</strong> — recognition of our commitment to honest advice and the right credit for every client.
        </p>
        <ul className="mt-8 space-y-3">
          {['Client-first financial consultancy', '1000+ clients guided across India', 'Relationships with 50+ banks & NBFCs'].map((p) => (
            <li key={p} className="flex items-start gap-3 text-white/85 font-medium">
              <CheckCircle2 className="w-5 h-5 text-flame shrink-0 mt-0.5" /> {p}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════════════
   LEADERSHIP
   ═══════════════════════════════════════════════════════════════ */
const Leadership = () => (
  <section id="leadership" className="py-24 scroll-mt-20">
    <div className="max-w-5xl mx-auto px-6">
      <motion.div {...fadeUp} className="text-center">
        <p className="text-flame font-bold text-xs tracking-[0.25em] uppercase">Leadership</p>
        <h2 className="mt-4 text-4xl md:text-5xl font-bold text-ink">Led by experience</h2>
      </motion.div>
      <motion.div {...fadeUp} className="mt-14 bg-white rounded-[2rem] border border-ink/10 p-8 md:p-12 grid md:grid-cols-[auto_1fr] gap-10 items-center shadow-sm">
        <div className="w-44 h-44 md:w-52 md:h-52 mx-auto rounded-full p-1.5 bg-gradient-to-br from-sun via-flame to-magenta">
          <div className="w-full h-full rounded-full overflow-hidden bg-white">
            <img src="/directors/ashish.png" alt="Ashish Ashok Ghadge" className="w-full h-full object-cover object-[center_30%] scale-[1.8]" loading="lazy" />
          </div>
        </div>
        <div className="text-center md:text-left">
          <h3 className="text-3xl font-bold text-ink">Ashish Ashok Ghadge</h3>
          <p className="mt-1 text-flame font-semibold tracking-[0.2em] uppercase text-sm">Blink Fin-Advisory Pvt. Ltd.</p>
          <p className="mt-5 text-ink/70 text-lg leading-relaxed">
            With over 5 years in financial services, Ashish is the driving force behind Blink Finance and Blink Fin-Advisory Pvt. Ltd. He specialises in loan consulting, credit structuring and lender relationships, with a simple aim: transparent advice that helps clients borrow right.
          </p>
        </div>
      </motion.div>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════════════
   SISTER BRAND BANNER
   ═══════════════════════════════════════════════════════════════ */
const SisterBrand = () => (
  <section className="pb-24">
    <div className="max-w-7xl mx-auto px-6">
      <motion.div {...fadeUp} className="rounded-[2rem] bg-gradient-to-r from-flame via-berry to-magenta text-white p-10 md:p-14 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <p className="text-white/80 font-bold text-xs tracking-[0.25em] uppercase">Ready to apply for a loan?</p>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold">Visit Blink Finance, our loan DSA brand</h2>
          <p className="mt-3 text-white/85 max-w-xl">Compare offers from 50+ banks and NBFCs, check eligibility and calculate your EMI.</p>
        </div>
        <a href={BLINK_FINANCE_URL} target="_blank" rel="noopener" className="shrink-0 bg-white text-ink font-semibold px-8 py-4 rounded-full inline-flex items-center justify-center gap-2 hover:bg-paper transition-colors">
          Go to blinkfinance.in <ArrowUpRight className="w-5 h-5" />
        </a>
      </motion.div>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════════════
   CONTACT + FOOTER
   ═══════════════════════════════════════════════════════════════ */
const Contact = () => (
  <footer id="contact" className="bg-ink text-white pt-24 pb-10 scroll-mt-20">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid lg:grid-cols-2 gap-14">
        <div>
          <p className="text-flame font-bold text-xs tracking-[0.25em] uppercase">Contact</p>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold leading-tight">Let's plan your next financial move.</h2>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <a href={`tel:+91${PHONE}`} className="bg-gradient-to-r from-flame to-berry text-white font-semibold px-7 py-4 rounded-full inline-flex items-center justify-center gap-2 hover:opacity-90 transition-colors">
              <Phone className="w-5 h-5" /> Call {PHONE}
            </a>
            <a href={`https://wa.me/91${PHONE}`} target="_blank" rel="noreferrer" className="border border-white/25 font-semibold px-7 py-4 rounded-full inline-flex items-center justify-center gap-2 hover:border-white/60 transition-colors">
              <MessageCircle className="w-5 h-5" /> WhatsApp us
            </a>
          </div>
        </div>
        <ul className="space-y-6 text-white/80 text-base lg:pt-10">
          <li className="flex gap-4"><MapPin className="w-5 h-5 text-flame shrink-0 mt-1" /> <span className="leading-relaxed">{ADDRESS}</span></li>
          <li className="flex gap-4 items-center"><Phone className="w-5 h-5 text-flame shrink-0" /> <a href={`tel:+91${PHONE}`} className="hover:text-white">{PHONE}</a></li>
          <li className="flex gap-4 items-center"><Mail className="w-5 h-5 text-flame shrink-0" /> <a href={`mailto:${EMAIL}`} className="hover:text-white">{EMAIL}</a></li>
          <li className="flex gap-4 items-center"><Building2 className="w-5 h-5 text-flame shrink-0" /> <span>Sister brand: <a href={BLINK_FINANCE_URL} target="_blank" rel="noopener" className="text-flame font-semibold hover:underline">Blink Finance ↗</a></span></li>
        </ul>
      </div>

      <div className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row gap-6 md:items-center justify-between">
        <Logo onDark />
        <p className="text-xs text-white/50 max-w-xl md:text-right leading-relaxed">
          Blink Fin-Advisory Pvt. Ltd. provides financial and loan advisory services and does not itself lend money. Loans are sanctioned and disbursed by banks/NBFCs at their sole discretion.
          <br />© {new Date().getFullYear()} Blink Fin-Advisory Pvt. Ltd. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default function App() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Services />
      <AwardSection />
      <Leadership />
      <SisterBrand />
      <Contact />
    </main>
  );
}
