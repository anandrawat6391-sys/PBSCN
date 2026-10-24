"use client";

import React, { useState } from 'react';
import MurmurationWordmark, {
  MurmurationPreset,
} from './ui/murmuration-wordmark';
import { MarkerText, Mark } from './ui/marker-text';
import { DhammaChakraIcon } from './DhammaChakraIcon';
import { Sparkles, MousePointer, ShieldCheck, HeartHandshake, ArrowDown } from 'lucide-react';
import { LangMode, t } from '../utils/i18n';

interface HeroSectionProps {
  lang: LangMode;
  onOpenRegisterModal: () => void;
  onExploreCases: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  lang,
  onOpenRegisterModal,
  onExploreCases,
}) => {
  const [preset, setPreset] = useState<MurmurationPreset>('ambedkarite');

  return (
    <section className="relative w-full bg-[#050B17] border-b border-blue-900/30 overflow-hidden">
      {/* Majestic Starlings Murmuration Canvas - "JAI BHIM" */}
      <div className="relative w-full">
        <MurmurationWordmark
          word="JAI BHIM"
          birds={4600}
          preset={preset}
          flyFor={5.5}
          holdFor={4.0}
          height="480px"
          interactive={true}
          reeds={true}
        >
          {/* Top Floating Badge Bar */}
          <div className="absolute top-5 left-4 sm:left-8 right-4 sm:right-8 flex flex-wrap items-center justify-between gap-3 pointer-events-none select-none">
            <div className="inline-flex items-center gap-2.5 bg-slate-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-amber-400/30 text-xs font-semibold text-amber-200 shadow-xl pointer-events-auto">
              <DhammaChakraIcon size={16} className="text-amber-400 animate-dhamma-spin" />
              <span>
                {t(
                  lang,
                  'Dr. B.R. Ambedkar Vision · Pay Back to Society',
                  'डॉ. बी.आर. अम्बेडकर विचारधारा · Pay Back to Society'
                )}
              </span>
            </div>

            {/* Sky Preset Switcher */}
            <div className="inline-flex rounded-full border border-white/15 bg-slate-950/70 backdrop-blur-md p-1 pointer-events-auto shadow-xl text-xs">
              {(
                [
                  { id: 'ambedkarite', en: 'Ambedkarite Blue', hi: 'अम्बेडकरवादी नीला' },
                  { id: 'dusk', en: 'Dusk Sky', hi: 'गोधूलि गगन' },
                  { id: 'night', en: 'Deep Night', hi: 'नील रात्रि' },
                ] as const
              ).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPreset(p.id)}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                    preset === p.id
                      ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {lang === 'en' ? p.en : p.hi}
                </button>
              ))}
            </div>
          </div>

          {/* Hero Bottom Overlay: Main Title, Dignified Description & CTA */}
          <div className="absolute bottom-6 left-4 sm:left-8 right-4 sm:right-8 pointer-events-none">
            <div className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-3 pointer-events-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/60 border border-blue-400/30 text-blue-200 text-xs font-semibold backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>
                  {t(
                    lang,
                    '4,600 Starlings in Dynamic Flight Converge into "JAI BHIM"',
                    '4,600 संगठित परिंदे गगन में रचते हैं: "जय भीम"'
                  )}
                </span>
              </div>

              <MarkerText as="h1" className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-md">
                {lang === 'en' ? (
                  <>
                    Prabuddha Bharat <Mark type="underline" color="#fbbf24">Social Care Network</Mark>
                  </>
                ) : (
                  <>
                    प्रबुद्ध भारत <Mark type="underline" color="#fbbf24">स्वाभिमान न्यास</Mark>
                  </>
                )}
              </MarkerText>

              <MarkerText as="p" className="text-xs sm:text-sm md:text-base text-slate-200 max-w-2xl font-medium leading-relaxed drop-shadow">
                {lang === 'en' ? (
                  <>
                    <Mark type="highlight" color="#1e3a8a">100% Direct Peer-to-Peer Mutual Aid</Mark>. When a verified community member passes away, 62,410+ brothers and sisters transfer ₹35 directly into the legal nominee's account with <Mark type="circle" color="#10b981">zero middlemen</Mark>.
                  </>
                ) : (
                  <>
                    <Mark type="highlight" color="#1e3a8a">100% प्रत्यक्ष जन-सहयोग</Mark>। जब हमारे किसी सदस्य का आकस्मिक निधन होता है, तो 62,410+ साथी सीधे दिवंगत सदस्य के नॉमिनी के खाते में ₹35 भेजकर परिवार को <Mark type="circle" color="#10b981">सम्मानजनक आर्थिक संबल</Mark> प्रदान करते हैं।
                  </>
                )}
              </MarkerText>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={onExploreCases}
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs sm:text-sm font-extrabold transition-all transform hover:-translate-y-0.5 cursor-pointer shadow-lg shadow-amber-400/20 flex items-center gap-2"
                >
                  <HeartHandshake className="w-4 h-4 text-slate-950" />
                  <span>
                    {t(
                      lang,
                      'View Active Sahyog Alert (#09)',
                      'सक्रिय सहयोग अलर्ट देखें (केस संख्या 09)'
                    )}
                  </span>
                  <ArrowDown className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={onOpenRegisterModal}
                  className="px-5 py-2.5 rounded-xl bg-blue-600/90 hover:bg-blue-500 text-white text-xs sm:text-sm font-extrabold border border-blue-400/40 backdrop-blur-md transition-all transform hover:-translate-y-0.5 cursor-pointer shadow-lg flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-300" />
                  <span>
                    {t(
                      lang,
                      'Join Network (18–60 Yrs)',
                      'नेटवर्क सदस्यता लें (आयु 18–60 वर्ष)'
                    )}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Hint */}
          <div className="absolute bottom-3 right-4 sm:right-8 hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/60 border border-slate-700/60 text-[10px] text-slate-300 backdrop-blur-sm pointer-events-none">
            <MousePointer className="w-3 h-3 text-sky-400" />
            <span>
              {t(
                lang,
                'Move cursor to scatter starlings like a hawk',
                'कैनवास पर कर्सर घुमाकर परिंदों को गति दें'
              )}
            </span>
          </div>
        </MurmurationWordmark>
      </div>

      {/* Sovereign Verified Ledger Strip (4 Golden Pillars) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-blue-900/40 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {t(lang, 'Verified Members', 'सत्यापित सदस्य')}
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-white font-mono-tabular mt-0.5">
                62,410+
              </div>
              <div className="text-[11px] text-emerald-400 font-semibold">
                {t(lang, 'Across 75 UP Districts', '75 जिलों में सक्रिय')}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-800/60 flex items-center justify-center text-amber-400 shrink-0">
              <DhammaChakraIcon size={20} />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-blue-900/40 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {t(lang, 'Micro-Contribution', 'प्रति सदस्य सहयोग')}
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-amber-300 font-mono-tabular mt-0.5">
                ₹35 – ₹50
              </div>
              <div className="text-[11px] text-slate-300 font-medium">
                {t(lang, 'Direct to Nominee Bank', 'सीधे नॉमिनी बैंक खाते में')}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-800/50 flex items-center justify-center text-amber-300 shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-blue-900/40 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {t(lang, 'Total Direct Aid', 'कुल प्रत्यक्ष सहायता')}
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-white font-mono-tabular mt-0.5">
                ₹28.45 Cr
              </div>
              <div className="text-[11px] text-emerald-400 font-semibold">
                {t(lang, '114 Bereaved Families', '114 परिवारों को संबल')}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-800/50 flex items-center justify-center text-emerald-300 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-blue-900/40 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {t(lang, 'Intermediary Fee', 'बिचौलिया कमीशन')}
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-mono-tabular mt-0.5">
                0.00%
              </div>
              <div className="text-[11px] text-slate-300 font-medium">
                {t(lang, 'Zero Middlemen Cut', '100% सीधा हस्तांतरण')}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 font-mono-tabular font-bold text-xs shrink-0">
              P2P
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
