import React, { useState } from 'react';
import {
  Scale,
  Search,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  BookMarked,
  Filter,
} from 'lucide-react';
import { MarkerText, Mark } from './ui/marker-text';
import { CONSTITUTION_22_ARTICLES } from '../data/pbscnData';
import {
  calculateParticipationRate,
  meetsParticipationRule,
} from '../utils/pbscnRules';
import { LangMode, t } from '../utils/i18n';

interface ConstitutionSectionProps {
  lang: LangMode;
}

export const ConstitutionSection: React.FC<ConstitutionSectionProps> = ({
  lang,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Interactive Eligibility Simulator State
  const [simAge, setSimAge] = useState<number>(34);
  const [simMonths, setSimMonths] = useState<number>(22);
  const [simAppealsDone, setSimAppealsDone] = useState<number>(19);
  const [simTotalAppeals, setSimTotalAppeals] = useState<number>(20);
  const [simShulkPaid, setSimShulkPaid] = useState<boolean>(true);

  const participationRate = calculateParticipationRate(
    simAppealsDone,
    simTotalAppeals
  );
  const passes90Rule = meetsParticipationRule(simAppealsDone, simTotalAppeals);
  const passesAge = simAge >= 18 && simAge <= 62;
  const passesLockIn = simMonths >= 18;
  const isFullyEligible =
    passesAge && passesLockIn && passes90Rule && simShulkPaid;

  let statusReason = t(
    lang,
    'Member complies with all Constitutional Articles (Age 18–62, 18-Month Lock-in complete, ≥90% Sahyog participation, and active Trust Maintenance Fee).',
    'सदस्य संविधान के सभी नियमों (आयु 18–62, 18-माह लॉक-इन पूर्ण, ≥90% सहयोग रिकॉर्ड और सक्रिय व्यवस्था शुल्क) को पूर्ण करते हैं।'
  );
  if (!passesAge) {
    statusReason = t(
      lang,
      `Article 04: Bereavement coverage is valid between ages 18 and 62 (Selected: ${simAge} years).`,
      `अनुच्छेद 04: पारिवारिक सुरक्षा कवर केवल 18 से 62 वर्ष की आयु तक मान्य है (वर्तमान: ${simAge} वर्ष)।`
    );
  } else if (!passesLockIn) {
    statusReason = t(
      lang,
      `Article 05: Member is currently in the 18-Month Lock-in Period (${18 - simMonths} months remaining).`,
      `अनुच्छेद 05: सदस्य अभी 18-माह की अनिवार्य लॉक-इन अवधि में हैं (${18 - simMonths} माह शेष)।`
    );
  } else if (!passes90Rule) {
    statusReason = t(
      lang,
      `Article 06: Participation rate (${participationRate}%) is below the mandatory 90% threshold.`,
      `अनुच्छेद 06: सहयोग भागीदारी (${participationRate}%) अनिवार्य 90% सीमा से कम है।`
    );
  } else if (!simShulkPaid) {
    statusReason = t(
      lang,
      'Article 10: Annual Portal Maintenance Fee renewal is pending.',
      'अनुच्छेद 10: वार्षिक व्यवस्था शुल्क का नवीनीकरण लंबित है।'
    );
  }

  const filteredArticles = CONSTITUTION_22_ARTICLES.filter((art) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      art.titleEn.toLowerCase().includes(q) ||
      art.titleHi.toLowerCase().includes(q) ||
      art.summaryEn.toLowerCase().includes(q) ||
      art.summaryHi.toLowerCase().includes(q) ||
      art.clauseRule.toLowerCase().includes(q) ||
      String(art.articleNumber).includes(q);

    const matchesCategory =
      categoryFilter === 'ALL' || art.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'ALL', labelEn: 'All 22 Articles', labelHi: 'सभी 22 अनुच्छेद' },
    { id: 'PHILOSOPHY', labelEn: 'Philosophy', labelHi: 'संवैधानिक विचारधारा' },
    { id: 'ELIGIBILITY', labelEn: 'Eligibility Rules', labelHi: 'पात्रता नियम' },
    { id: 'SAHYOG_RULES', labelEn: 'Sahyog Rules', labelHi: 'सहयोग प्रक्रिया' },
    { id: 'AUDIT_GOVERNANCE', labelEn: 'Audit & Physical Verification', labelHi: 'ऑडिट व भौतिक सत्यापन' },
    { id: 'WELFARE', labelEn: 'Welfare Schemes', labelHi: 'कल्याण योजनाएं' },
  ];

  return (
    <div className="space-y-8">
      {/* Sovereign Header in Tactile Cream-White Alabaster */}
      <div className="rounded-3xl bg-[#FCFAF7] border border-[#E7E2DA] p-6 sm:p-8 shadow-[10px_10px_25px_rgba(0,0,0,0.05),-8px_-8px_20px_rgba(255,255,255,0.95)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-extrabold uppercase tracking-wider text-amber-700">
            {t(
              lang,
              'Supreme Governing Charter of PBSCN',
              'प्रबुद्ध भारत स्वाभिमान न्यास की सर्वोच्च नियमावली'
            )}
          </div>
          <MarkerText as="h2" className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight mt-1">
            {lang === 'en' ? (
              <>
                The 22-Article Constitution <Mark type="underline" color="#f59e0b">(Niyamawali)</Mark>
              </>
            ) : (
              <>
                22-सूत्रीय <Mark type="underline" color="#f59e0b">संवैधानिक नियमावली</Mark>
              </>
            )}
          </MarkerText>
          <MarkerText as="p" className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed font-medium">
            {lang === 'en' ? (
              <>
                Transparent, legally bound principles under <Mark type="highlight" color="#fef3c7">Indian Trusts Act 1882</Mark> ensuring 100% direct peer-to-peer solidarity with <Mark type="strike" color="#ef4444">zero leakages</Mark>.
              </>
            ) : (
              <>
                100% पारदर्शी, स्वाभिमान-आधारित नियम जो यह सुनिश्चित करते हैं कि हर दिवंगत परिवार को बिना किसी <Mark type="strike" color="#ef4444">बिचौलिए या पक्षपात</Mark> के <Mark type="box" color="#10b981">सीधा जन-सहयोग</Mark> मिले।
              </>
            )}
          </MarkerText>
        </div>
      </div>

      {/* Interactive Compliance Simulator (Cream-White / Warm-Gray) */}
      <div className="rounded-3xl bg-[#FCFAF7] border border-[#E7E2DA] p-6 sm:p-7 shadow-[10px_10px_25px_rgba(0,0,0,0.05),-8px_-8px_20px_rgba(255,255,255,0.95)] space-y-5">
        <div className="flex items-center gap-2.5 border-b border-[#ECE7DE] pb-3.5">
          <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 shadow-2xs">
            <Scale className="w-4 h-4 text-amber-700" />
          </div>
          <h3 className="text-base font-extrabold text-stone-900">
            {t(
              lang,
              'Interactive Constitutional Compliance Simulator',
              'संवैधानिक पात्रता सिम्युलेटर'
            )}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-white border border-[#E7E2DA] shadow-2xs space-y-1.5">
            <label className="block font-extrabold text-stone-800">
              {t(lang, `Member Age: ${simAge} Yrs`, `सदस्य की आयु: ${simAge} वर्ष`)}
            </label>
            <input
              type="range"
              min={16}
              max={65}
              value={simAge}
              onChange={(e) => setSimAge(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-500 font-mono-tabular">
              <span>18 (Min)</span>
              <span>60 (Max Reg)</span>
              <span>62 (Cap)</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-[#E7E2DA] shadow-2xs space-y-1.5">
            <label className="block font-extrabold text-stone-800">
              {t(lang, `Tenure: ${simMonths} Months`, `सदस्यता: ${simMonths} माह`)}
            </label>
            <input
              type="range"
              min={1}
              max={36}
              value={simMonths}
              onChange={(e) => setSimMonths(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-500 font-mono-tabular">
              <span>0M</span>
              <span>18M (Lock-in)</span>
              <span>36M</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-[#E7E2DA] shadow-2xs space-y-1.5">
            <label className="block font-extrabold text-stone-800">
              {t(lang, `Appeals Completed (${simAppealsDone}/${simTotalAppeals})`, `सहयोग किया (${simAppealsDone}/${simTotalAppeals})`)}
            </label>
            <input
              type="range"
              min={0}
              max={simTotalAppeals}
              value={simAppealsDone}
              onChange={(e) => setSimAppealsDone(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-500 font-mono-tabular">
              <span>0%</span>
              <span>90% (Mandatory)</span>
              <span>100%</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-[#E7E2DA] shadow-2xs space-y-1">
            <label className="block font-extrabold text-stone-800">
              {t(lang, 'Sahyog Ratio', 'सहयोग अनुपात')}
            </label>
            <div className="text-2xl font-mono-tabular font-black text-stone-900 pt-0.5">
              {participationRate}%
            </div>
            <div className="text-[11px] font-bold">
              {passes90Rule ? (
                <span className="text-emerald-700">{t(lang, 'Above 90% Rule ✓', '90% नियम पूर्ण ✓')}</span>
              ) : (
                <span className="text-rose-600">{t(lang, 'Below 90% Rule ✗', '90% से कम ✗')}</span>
              )}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-[#E7E2DA] shadow-2xs flex flex-col justify-center">
            <div className="flex items-center gap-2">
              <input
                id="sim-fee"
                type="checkbox"
                checked={simShulkPaid}
                onChange={(e) => setSimShulkPaid(e.target.checked)}
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
              <label htmlFor="sim-fee" className="font-extrabold text-stone-800 text-xs cursor-pointer">
                {t(lang, 'Annual Fee Active', 'व्यवस्था शुल्क जमा है')}
              </label>
            </div>
            <p className="text-[10px] text-stone-500 mt-1">
              {t(lang, 'Portal server & audit compliance', 'पोर्टल एवं ऑडिट संधारण')}
            </p>
          </div>
        </div>

        {/* Compliance Result Box in Cream / Alabaster */}
        <div
          className={`p-4 rounded-2xl border transition-all ${
            isFullyEligible
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-2xs'
              : 'bg-amber-50 border-amber-300 text-amber-950 shadow-2xs'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {isFullyEligible ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
            )}
            <span className="text-xs font-black uppercase tracking-wider">
              {isFullyEligible
                ? t(lang, 'FULL CONSTITUTIONAL COMPLIANCE CERTIFIED', 'संवैधानिक पात्रता पूर्ण एवं प्रमाणित')
                : t(lang, 'COMPLIANCE CRITERIA PENDING', 'संवैधानिक शर्तें अभी अधूरी हैं')}
            </span>
          </div>
          <p className="text-xs text-stone-700 mt-1.5 leading-relaxed font-medium">{statusReason}</p>
        </div>
      </div>

      {/* Category Pills & Search in Clean Cream-White Aesthetic */}
      <div className="rounded-3xl bg-[#FCFAF7] border border-[#E7E2DA] p-6 shadow-[10px_10px_25px_rgba(0,0,0,0.05),-8px_-8px_20px_rgba(255,255,255,0.95)] space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  categoryFilter === cat.id
                    ? 'bg-amber-400 text-stone-950 shadow-sm border border-amber-400'
                    : 'bg-white text-stone-700 hover:text-stone-950 border border-stone-200/90 shadow-2xs hover:bg-stone-50'
                }`}
              >
                {lang === 'en' ? cat.labelEn : cat.labelHi}
              </button>
            ))}
          </div>

          <div className="w-full sm:w-72 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t(lang, 'Search 22 articles...', '22 नियम खोजें...')}
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 placeholder:text-stone-400 shadow-2xs font-medium focus:border-amber-500 focus:outline-none"
            />
          </div>
        </div>

        {/* 22 Articles List in Clean Cream-White Tactile Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredArticles.map((art) => (
            <div
              key={art.articleNumber}
              className="p-5 rounded-3xl bg-white border border-[#E7E2DA] shadow-[4px_4px_14px_rgba(0,0,0,0.04),-3px_-3px_10px_rgba(255,255,255,0.9)] hover:shadow-[10px_10px_24px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[11px] font-mono-tabular font-extrabold bg-stone-100 text-stone-700 border border-stone-200 shadow-2xs">
                    {t(lang, `Article ${art.articleNumber}`, `अनुच्छेद ${art.articleNumber}`)}
                  </span>
                  <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider">
                    {art.category}
                  </span>
                </div>

                <h4 className="text-sm font-extrabold text-stone-900 leading-snug tracking-tight">
                  {lang === 'en' ? art.titleEn : art.titleHi}
                </h4>

                <p className="text-xs text-stone-600 leading-relaxed font-medium">
                  {lang === 'en' ? art.summaryEn : art.summaryHi}
                </p>
              </div>

              <div className="mt-2 pt-2.5 border-t border-[#ECE7DE] text-[11px] font-mono-tabular text-amber-900 font-bold bg-amber-50/80 p-2.5 rounded-xl border border-amber-200/70">
                {art.clauseRule}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
