import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Phone, Calculator } from 'lucide-react';

const links = [
  { label: 'About', href: '/#about' },
  { label: 'Loans', href: '/#products' },
  { label: 'How It Works', href: '/#process' },
  { label: 'Team', href: '/#team' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'Contact', href: '/#contact' },
];

export default function Navbar({ alwaysSolid = false }: { alwaysSolid?: boolean }) {
  const [scrolled, setScrolled] = useState(alwaysSolid);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const onEmiPage = location.pathname === '/emi-calculator';
  const onLegalPage = location.pathname === '/privacy-policy' || location.pathname === '/terms';
  const solid = alwaysSolid || scrolled || onEmiPage || onLegalPage;

  useEffect(() => {
    if (alwaysSolid) return;
    const h = () => setScrolled(window.scrollY > 50);
    h();
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, [alwaysSolid]);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <nav
      aria-label="Main navigation"
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        solid
          ? 'bg-white/80 backdrop-blur-xl border-b border-black/10 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 group relative z-10" onClick={() => setOpen(false)}>
          <img
            src="/new_logo.png"
            alt="Blink Finance Logo"
            width={1602}
            height={888}
            className="h-16 w-auto object-contain drop-shadow-md filter-none"
          />
        </Link>

        <div className="hidden lg:flex items-center gap-7">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm font-bold text-foreground/70 hover:text-foreground transition-colors"
            >
              {l.label}
            </a>
          ))}
          <Link
            to="/emi-calculator"
            className={`text-sm font-bold flex items-center gap-1.5 transition-colors ${
              onEmiPage ? 'text-brand-orange' : 'text-foreground/70 hover:text-brand-orange'
            }`}
          >
            <Calculator className="w-4 h-4" />
            EMI Calculator
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <a href="tel:8828821333" className="text-sm font-bold flex items-center gap-1.5 text-foreground/70 hover:text-foreground transition-colors">
            <Phone className="w-4 h-4" /> 8828821333
          </a>
          <a href="/#apply" className="bg-foreground text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-foreground/80 transition-all hover:scale-105 shadow-md shadow-black/10">
            Apply Now
          </a>
        </div>

        <button className="lg:hidden text-foreground" onClick={() => setOpen(!open)} aria-label="Toggle mobile menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl shadow-xl py-6 px-6 flex flex-col gap-4 lg:hidden border-t border-black/10"
        >
          {links.map((l) => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)} className="text-base font-bold py-2 hover:text-foreground text-foreground/70 transition-colors">
              {l.label}
            </a>
          ))}
          <Link
            to="/emi-calculator"
            onClick={() => setOpen(false)}
            className="text-base font-bold py-2 text-brand-orange flex items-center gap-2"
          >
            <Calculator className="w-4 h-4" />
            EMI Calculator
          </Link>
          <a href="/#apply" className="bg-foreground text-white px-6 py-3 rounded-full text-center text-sm font-bold mt-2" onClick={() => setOpen(false)}>
            Apply Now
          </a>
        </motion.div>
      )}
    </nav>
  );
}
