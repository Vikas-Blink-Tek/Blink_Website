import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Globe, MessageCircle } from 'lucide-react';
import Tilt from 'react-parallax-tilt';
import { FIN_ADVISORY_URL } from '../lib/sites';

export function WhatsAppFab() {
  return (
    <a
      href="https://wa.me/918828821333"
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform cursor-pointer flex items-center justify-center border-2 border-white"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-8 h-8" />
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="bg-foreground text-white py-20 relative overflow-hidden border-t border-black/10" id="contact" aria-label="Contact and company information">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-7 lg:col-span-8 bg-white/5 backdrop-blur-md rounded-3xl p-10 md:p-12 border border-white/20 shadow-2xl relative z-20">
            <div className="grid md:grid-cols-2 gap-10">
              <div className="flex flex-col">
                <div className="flex items-center gap-4 mb-8">
                  <img
                    src="/new_logo.png"
                    alt="Blink Finance logo - trusted loan DSA partner in India"
                    width={1602}
                    height={888}
                    loading="lazy"
                    className="h-24 w-auto object-contain drop-shadow-xl brightness-0 invert"
                  />
                </div>
                <p className="text-white/90 mb-8 leading-relaxed text-base font-medium">Right Credit. Not Just Random Loans. Your trusted DSA partner bridging the gap between you and your financial goals.</p>
                <div className="flex gap-4 mt-auto">
                  <a href="https://www.blinkfinance.in" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center hover:bg-brand-orange hover:border-brand-orange transition-colors">
                    <Globe className="w-5 h-5 text-white" />
                  </a>
                </div>
              </div>

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
                    <li><a href="/#about" className="hover:text-brand-orange transition-colors">About Us</a></li>
                    <li><a href="/#products" className="hover:text-brand-orange transition-colors">Loan Products</a></li>
                    <li><a href="/#process" className="hover:text-brand-orange transition-colors">How It Works</a></li>
                    <li><Link to="/emi-calculator" className="hover:text-brand-orange transition-colors">EMI Calculator</Link></li>
                    <li><a href="/#apply" className="hover:text-brand-orange transition-colors">Apply Now</a></li>
                    <li><a href="/#faq" className="hover:text-brand-orange transition-colors">FAQ</a></li>
                    <li><Link to="/privacy-policy" className="hover:text-brand-orange transition-colors">Privacy Policy</Link></li>
                    <li><Link to="/terms" className="hover:text-brand-orange transition-colors">Terms &amp; Conditions</Link></li>
                    <li className="col-span-2"><a href={FIN_ADVISORY_URL} target="_blank" rel="noopener" className="hover:text-brand-orange transition-colors">Blink Fin-Advisory Pvt. Ltd. ↗</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

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
        <p>Sister company: <a href={FIN_ADVISORY_URL} target="_blank" rel="noopener" className="underline hover:text-brand-orange">Blink Fin-Advisory Pvt. Ltd.</a> — financial &amp; loan advisory.</p>
        <p>GST/Udyam/Gumasta Registered | Registration: 27ABAFB5553C1ZT</p>
        <p>
          <Link to="/privacy-policy" className="hover:text-brand-orange">Privacy Policy</Link>
          <span className="mx-2">|</span>
          <Link to="/terms" className="hover:text-brand-orange">Terms &amp; Conditions</Link>
        </p>
        <p>© {new Date().getFullYear()} Blink Finance. All rights reserved.</p>
      </div>
    </footer>
  );
}
