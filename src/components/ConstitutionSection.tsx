import React, { useState } from 'react';
import {
  Scale,
  Search,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  BookMarked,
} from 'lucide-react';
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
    'Member meets all Constitutional Criteria (Age 18–62, 18M Lock-in completed, ≥90% Sahyog participation, and active Trust Fee).',
    'सदस्य सभी संवैधानिक शर्तों (आयु 18–62, 18-माह लॉक-इन पूर्ण, ≥90% सहयोग भागीदारी और सक्रिय व्यवस्था शुल्क) को पूरा करते हैं।'
  );
  if (!passesAge) {
    statusReason = t(
      lang,
      `Article 04: Coverage is valid only between ages 18 and 62 (Selected Age: ${simAge}).`,
      `अनुच्छेद 04: सुरक्षा कवर केवल 18 से 62 वर्ष की आयु तक मान्य है (चयनित आयु: ${simAge})।`
    );
  } else if (!passesLockIn) {
    statusReason = t(
      lang,
      `Article 05: Member is in the 18-Month Lock-in Period (${18 - simMonths} months remaining).`,
      `अनुच्छेद 05: सदस्य अभी 18-माह की लॉक-इन अवधि में हैं (${18 - simMonths} माह शेष)।`
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
      'Article 10: Annual Vyawastha Shulk renewal is pending.',
      'अनुच्छेद 10: वार्षिक व्यवस्था शुल्क का नवीनीकरण बाकी है।'
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
    { id: 'PHILOSOPHY', labelEn: 'Philosophy', labelHi: 'विचारधारा' },
    { id: 'ELIGIBILITY', labelEn: 'Eligibility', labelHi: 'पात्रता नियम' },
    { id: 'SAHYOG_RULES', labelEn: 'Sahyog Rules', labelHi: 'सहयोग नियम' },
    { id: 'AUDIT_GOVERNANCE', labelEn: 'Audit & Governance', labelHi: 'ऑडिट व प्रशासन' },
    { id: 'WELFARE', labelEn: 'Welfare Schemes', labelHi: 'कल्याण योजनाएं' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="text-xs font-bold uppercase tracking-wider text-blue-800">
          {t(
            lang,
            'Mutual Care Constitution & By-Laws (niyamawali)',
            'आपसी सहयोग संविधान एवं 22-सूत्रीय नियमावली (niyamawali)'
          )}
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
          {t(
            lang,
            '22-Article Sovereign Constitutional Charter & Live Rule Engine',
            'प्रबुद्ध भारत स्वाभिमान न्यास — 22-अनुच्छेद संवैधानिक नियमावली एवं पात्रता सिम्युलेटर'
          )}
        </h2>
        <p className="text-xs text-slate-600 mt-1 max-w-3xl">
          {t(
            lang,
            'Transparent, rule-bound discipline inspired by Babasaheb Dr. B.R. Ambedkar’s constitutional principles: Age 18–60 registration (coverage up to 62), 18-Month Lock-in Period, and 90% Mandatory Sahyog Participation.',
            'बाबासाहेब डॉ. बी.आर. अम्बेडकर के संवैधानिक अनुशासन पर आधारित पारदर्शी नियम: 18–60 वर्ष पंजीकरण आयु (62 वर्ष तक सुरक्षा), 18-माह लॉक-इन अवधि और 90% अनिवार्य सहयोग नियम।'
          )}
        </p>
      </div>

      {/* Live Constitutional Eligibility Simulator */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <Scale className="w-5 h-5 text-blue-800" />
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              {t(
                lang,
                'Interactive Constitutional Rule Simulator (Articles 4, 5, 6 & 10)',
                'इंटरएक्टिव संवैधानिक पात्रता सिम्युलेटर (अनुच्छेद 4, 5, 6 एवं 10 की जांच करें)'
              )}
            </h3>
            <p className="text-xs text-slate-500">
              {t(
                lang,
                'Test how Age (18–62), Lock-in Tenure (18 Months), and the 90% Participation Rule determine Valid & Verified status.',
                'आयु (18–62 वर्ष), लॉक-इन अवधि (18 माह) और 90% सहयोग नियम बदलकर देखें कि सदस्य की वैधता कैसे तय होती है।'
              )}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {t(
                  lang,
                  `Member Age: ${simAge} Years (Rule: 18–62)`,
                  `सदस्य की आयु: ${simAge} वर्ष (नियम: 18–62)`
                )}
              </label>
              <input
                type="range"
                min={16}
                max={68}
                value={simAge}
                onChange={(e) => setSimAge(Number(e.target.value))}
                className="w-full accent-blue-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {t(
                  lang,
                  `Membership Completed: ${simMonths} Months (Lock-in: 18M)`,
                  `सदस्यता अवधि: ${simMonths} माह (लॉक-इन: 18 माह)`
                )}
              </label>
              <input
                type="range"
                min={1}
                max={48}
                value={simMonths}
                onChange={(e) => setSimMonths(Number(e.target.value))}
                className="w-full accent-blue-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {t(
                  lang,
                  `Appeals Contributed: ${simAppealsDone} of ${simTotalAppeals}`,
                  `सहयोग की गई अपीलें: ${simAppealsDone} / ${simTotalAppeals}`
                )}
              </label>
              <input
                type="range"
                min={0}
                max={simTotalAppeals}
                value={simAppealsDone}
                onChange={(e) => setSimAppealsDone(Number(e.target.value))}
                className="w-full accent-blue-800"
              />
            </div>

            <div className="flex items-center gap-2 pt-4">
              <input
                id="sim-shulk"
                type="checkbox"
                checked={simShulkPaid}
                onChange={(e) => setSimShulkPaid(e.target.checked)}
                className="w-4 h-4 accent-blue-800 rounded"
              />
              <label htmlFor="sim-shulk" className="font-bold text-slate-800">
                {t(
                  lang,
                  'Annual Vyawastha Shulk Paid (Article 10)',
                  'वार्षिक व्यवस्था शुल्क जमा है (अनुच्छेद 10)'
                )}
              </label>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div
              className={`p-4 rounded-xl border ${
                isFullyEligible
                  ? 'bg-emerald-50 border-emerald-300'
                  : 'bg-amber-50 border-amber-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase text-slate-900">
                  {isFullyEligible ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-700" />
                  )}
                  {isFullyEligible
                    ? t(lang, 'VALID & VERIFIED MEMBER', 'वैध एवं सत्यापित सदस्य')
                    : t(lang, 'INELIGIBLE / UNDER LOCK-IN', 'अपात्र / लॉक-इन अधीन')}
                </span>
                <span className="font-mono-tabular text-sm font-extrabold text-blue-900">
                  {participationRate}% Sahyog
                </span>
              </div>
              <p className="text-xs text-slate-700 mt-2 leading-relaxed">
                {statusReason}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar for 22 Articles */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t(
              lang,
              'Search all 22 Constitutional Articles (e.g., Lock-in, 90%, Audit, Kanyadan)...',
              '22 संवैधानिक अनुच्छेदों में खोजें (जैसे: लॉक-इन, 90%, ऑडिट, कन्यादान)...'
            )}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 text-xs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-2.5 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                categoryFilter === cat.id
                  ? 'bg-blue-800 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {lang === 'en' ? cat.labelEn : cat.labelHi}
            </button>
          ))}
        </div>
      </div>

      {/* 22 Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredArticles.map((art) => (
          <div
            key={art.articleNumber}
            className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded bg-slate-900 text-amber-300 font-mono-tabular text-xs font-extrabold">
                  {t(
                    lang,
                    `ARTICLE ${String(art.articleNumber).padStart(2, '0')}`,
                    `अनुच्छेद ${String(art.articleNumber).padStart(2, '0')}`
                  )}
                </span>
                <span className="text-[11px] font-bold text-blue-800">
                  {art.category}
                </span>
              </div>

              <h4 className="text-sm font-extrabold text-slate-900 mt-2">
                {lang === 'en' ? art.titleEn : art.titleHi}
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {lang === 'en' ? art.summaryEn : art.summaryHi}
              </p>
            </div>

            <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono-tabular text-slate-500">
              <span className="flex items-center gap-1 font-semibold text-slate-700">
                <BookMarked className="w-3.5 h-3.5 text-blue-700" />
                {art.clauseRule}
              </span>
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
