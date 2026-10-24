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
      {/* Sovereign Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
            {t(
              lang,
              'Supreme Governing Charter of PBSCN',
              'प्रबुद्ध भारत स्वाभिमान न्यास की सर्वोच्च नियमावली'
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            {t(
              lang,
              'The 22-Article Constitution (Niyamawali)',
              '22-सूत्रीय संवैधानिक नियमावली'
            )}
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            {t(
              lang,
              'Transparent, legally bound principles under Indian Trusts Act 1882 ensuring 100% direct peer-to-peer solidarity with zero leakages.',
              '100% पारदर्शी, स्वाभिमान-आधारित नियम जो यह सुनिश्चित करते हैं कि हर दिवंगत परिवार को बिना किसी बिचौलिए या पक्षपात के सीधा जन-सहयोग मिले।'
            )}
          </p>
        </div>
      </div>

      {/* Interactive Compliance Simulator */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
          <Scale className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-extrabold text-white">
            {t(
              lang,
              'Interactive Constitutional Compliance Simulator',
              'संवैधानिक पात्रता सिम्युलेटर'
            )}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-300 mb-1">
              {t(lang, `Member Age: ${simAge} Yrs`, `सदस्य की आयु: ${simAge} वर्ष`)}
            </label>
            <input
              type="range"
              min={16}
              max={65}
              value={simAge}
              onChange={(e) => setSimAge(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono-tabular">
              <span>18 (Min)</span>
              <span>60 (Max Reg)</span>
              <span>62 (Cap)</span>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">
              {t(lang, `Tenure: ${simMonths} Months`, `सदस्यता: ${simMonths} माह`)}
            </label>
            <input
              type="range"
              min={1}
              max={36}
              value={simMonths}
              onChange={(e) => setSimMonths(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono-tabular">
              <span>0M</span>
              <span>18M (Lock-in)</span>
              <span>36M</span>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">
              {t(lang, `Appeals Completed (${simAppealsDone}/${simTotalAppeals})`, `सहयोग किया (${simAppealsDone}/${simTotalAppeals})`)}
            </label>
            <input
              type="range"
              min={0}
              max={simTotalAppeals}
              value={simAppealsDone}
              onChange={(e) => setSimAppealsDone(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono-tabular">
              <span>0%</span>
              <span>90% (Mandatory)</span>
              <span>100%</span>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">
              {t(lang, 'Sahyog Ratio', 'सहयोग अनुपात')}
            </label>
            <div className="text-xl font-mono-tabular font-extrabold text-amber-300 pt-1">
              {participationRate}%
            </div>
            <div className="text-[10px] text-slate-400">
              {passes90Rule ? t(lang, 'Above 90% Rule ✓', '90% नियम पूर्ण ✓') : t(lang, 'Below 90% Rule ✗', '90% से कम ✗')}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-4">
            <input
              id="sim-fee"
              type="checkbox"
              checked={simShulkPaid}
              onChange={(e) => setSimShulkPaid(e.target.checked)}
              className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
            />
            <label htmlFor="sim-fee" className="font-bold text-slate-300 cursor-pointer">
              {t(lang, 'Annual Fee Active', 'व्यवस्था शुल्क जमा है')}
            </label>
          </div>
        </div>

        {/* Compliance Result Box */}
        <div
          className={`p-4 rounded-xl border ${
            isFullyEligible
              ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200'
              : 'bg-amber-950/80 border-amber-500/40 text-amber-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {isFullyEligible ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            )}
            <span className="text-xs font-extrabold uppercase tracking-wider">
              {isFullyEligible
                ? t(lang, 'FULL CONSTITUTIONAL COMPLIANCE CERTIFIED', 'संवैधानिक पात्रता पूर्ण एवं प्रमाणित')
                : t(lang, 'COMPLIANCE CRITERIA PENDING', 'संवैधानिक शर्तें अभी अधूरी हैं')}
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">{statusReason}</p>
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  categoryFilter === cat.id
                    ? 'bg-blue-600 text-white shadow-sm font-extrabold'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {lang === 'en' ? cat.labelEn : cat.labelHi}
              </button>
            ))}
          </div>

          <div className="w-full sm:w-64 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t(lang, 'Search 22 articles...', '22 नियम खोजें...')}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-700 bg-slate-950 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* 22 Articles List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredArticles.map((art) => (
            <div
              key={art.articleNumber}
              className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-blue-700/60 transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono-tabular font-extrabold bg-blue-950 text-blue-300 border border-blue-800">
                  {t(lang, `Article ${art.articleNumber}`, `अनुच्छेद ${art.articleNumber}`)}
                </span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  {art.category}
                </span>
              </div>

              <h4 className="text-sm font-extrabold text-white">
                {lang === 'en' ? art.titleEn : art.titleHi}
              </h4>

              <p className="text-xs text-slate-300 leading-relaxed">
                {lang === 'en' ? art.summaryEn : art.summaryHi}
              </p>

              <div className="mt-2 pt-2 border-t border-slate-800/60 text-[11px] font-mono-tabular text-amber-300 font-semibold">
                {art.clauseRule}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
