import { useEffect, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const DEFAULT_TITLE =
  'Blink Finance — Best Loan DSA in Mumbai | Home, Personal, Business Loan Agent in Mira Road';

export default function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `${title} | Blink Finance`;
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [title]);

  return (
    <main id="main-content" className="w-full bg-background min-h-screen text-foreground font-body">
      <Navbar alwaysSolid />
      <article className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm font-semibold text-foreground/50 mb-4">
            <Link to="/" className="hover:text-brand-orange">Home</Link>
            <span className="mx-2">/</span>
            <span>{title}</span>
          </p>
          <h1 className="text-4xl md:text-5xl font-black font-display tracking-tight mb-3">{title}</h1>
          <p className="text-sm font-bold text-brand-orange uppercase tracking-widest mb-10">Last updated {updated}</p>
          <div className="space-y-8 text-foreground/75 text-base md:text-lg leading-relaxed font-medium">
            {children}
          </div>
          <p className="mt-12 text-sm text-foreground/50 font-medium">
            Questions? Call <a className="text-brand-orange font-bold" href="tel:8828821333">8828821333</a> or email{' '}
            <a className="text-brand-orange font-bold" href="mailto:info@blinkfinance.in">info@blinkfinance.in</a>.
          </p>
        </div>
      </article>
      <Footer />
    </main>
  );
}

export function LegalH2({ children }: { children: ReactNode }) {
  return <h2 className="text-2xl font-black font-display text-foreground pt-2">{children}</h2>;
}
