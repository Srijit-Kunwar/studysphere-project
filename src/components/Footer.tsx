import React from 'react';
import { MapPin, Heart } from 'lucide-react';
import { StudySphereLogo } from './StudySphereLogo';

interface FooterProps {
  onNavigateExplore?: () => void;
  onShowToast?: (title: string, description?: string) => void;
}

export function Footer({ onNavigateExplore, onShowToast }: FooterProps) {
  const handleAction = (label: string) => {
    if (onShowToast) {
      onShowToast(label, `StudySphere Birtamode ${label} placeholder.`);
    }
  };

  return (
    <footer className="hidden md:block border-t border-[#E5E5E1] bg-white/70 backdrop-blur-xs mt-16 text-stone-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#1B4332] flex items-center justify-center text-white shadow-xs p-1.5">
                <StudySphereLogo className="w-full h-full" />
              </div>
              <span className="text-base font-bold text-[#1B4332] tracking-tight">
                StudySphere
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold bg-[#E8F5E9] text-[#1B4332] px-2 py-0.5 rounded-full border border-[#D8F3DC]">
                Birtamode
              </span>
            </div>
            <p className="text-stone-500 max-w-sm leading-relaxed text-xs">
              Find your focus in Birtamode. Quiet study carrels, silent archive libraries, and sunlit work benches across Jhapa.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
              <MapPin className="w-3.5 h-3.5 text-[#1B4332]" />
              <span>Birtamode, Jhapa, Koshi Province, Nepal</span>
            </div>
          </div>

          {/* Links: Explore */}
          <div>
            <h4 className="font-semibold text-stone-900 mb-3 text-xs uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateExplore ? onNavigateExplore() : handleAction('Browse Spaces')}
                  className="hover:text-[#1B4332] transition-colors text-left"
                >
                  Browse Spaces
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleAction('How it Works')}
                  className="hover:text-[#1B4332] transition-colors text-left"
                >
                  How it Works
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleAction('Student Pass')}
                  className="hover:text-[#1B4332] transition-colors text-left"
                >
                  Student Discount
                </button>
              </li>
            </ul>
          </div>

          {/* Links: Company */}
          <div>
            <h4 className="font-semibold text-stone-900 mb-3 text-xs uppercase tracking-wider">Company</h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => handleAction('About StudySphere')}
                  className="hover:text-[#1B4332] transition-colors text-left"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleAction('Contact Support')}
                  className="hover:text-[#1B4332] transition-colors text-left"
                >
                  Contact
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleAction('List a Space')}
                  className="hover:text-[#1B4332] transition-colors text-left"
                >
                  Partner With Us
                </button>
              </li>
            </ul>
          </div>

          {/* Links: Legal */}
          <div>
            <h4 className="font-semibold text-stone-900 mb-3 text-xs uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => handleAction('Privacy Policy')}
                  className="hover:text-[#1B4332] transition-colors text-left"
                >
                  Privacy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleAction('Terms of Service')}
                  className="hover:text-[#1B4332] transition-colors text-left"
                >
                  Terms
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleAction('Code of Conduct')}
                  className="hover:text-[#1B4332] transition-colors text-left"
                >
                  Quiet Guidelines
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-6 border-t border-stone-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-stone-500">
          <p>© 2026 StudySphere. Made in Birtamode, Nepal.</p>
          <div className="flex items-center gap-1 text-stone-400">
            <span>Crafted for focused minds in Jhapa</span>
            <Heart className="w-3 h-3 text-emerald-600 fill-emerald-600" />
          </div>
        </div>
      </div>
    </footer>
  );
}
