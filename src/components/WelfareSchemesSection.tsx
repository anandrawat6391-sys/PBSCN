import React, { useState } from 'react';
import {
  Heart,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { FELLOWSHIP_MENTORS } from '../data/pbscnData';
import { formatINR } from '../utils/pbscnRules';
import { LangMode, t } from '../utils/i18n';

interface WelfareSchemesSectionProps {
  lang: LangMode;
}

export const WelfareSchemesSection: React.FC<WelfareSchemesSectionProps> = ({
  lang,
}) => {
  // Kanyadan Calculator State
  const [membershipMonths, setMembershipMonths] = useState<number>(24);
  const [participationRate, setParticipationRate] = useState<number>(96);
  const [noticeDays, setNoticeDays] = useState<number>(105);
  const [shulkActive, setShulkActive] = useState<boolean>(true);

  // Education Fellowship Calculator State
  const [examCategory, setExamCategory] = useState<
    'UPSC_PSC' | 'NEET_JEE' | 'CLAT_JUDICIARY' | 'OVERSEAS_MASTERS'
  >('UPSC_PSC');
  const [marksPercentage, setMarksPercentage] = useState<number>(78);
  const [familyIncome, setFamilyIncome] = useState<number>(320000);

  // Dynamic Kanyadan Validation
  const reasons: string[] = [];
  if (membershipMonths < 12) {
    reasons.push(
      t(
        lang,
        `Active parent membership must be at least 12 months (Current: ${membershipMonths} months).`,
        `सदस्यता कम से कम 12 माह पुरानी होनी चाहिए (वर्तमान: ${membershipMonths} माह)।`
      )
    );
  }
  if (participationRate < 90) {
    reasons.push(
      t(
        lang,
        `Sahyog participation must be at least 90% (Current: ${participationRate}%).`,
        `सहयोग भागीदारी कम से कम 90% होनी चाहिए (वर्तमान: ${participationRate}%)।`
      )
    );
  }
  if (noticeDays < 90) {
    reasons.push(
      t(
        lang,
        `Application must be submitted at least 90 days before marriage (Current: ${noticeDays} days).`,
        `आवेदन विवाह से कम से कम 90 दिन पहले होना चाहिए (वर्तमान: ${noticeDays} दिन)।`
      )
    );
  }
  if (!shulkActive) {
    reasons.push(
      t(
        lang,
        'Annual Portal Maintenance Fee must be actively renewed.',
        'वार्षिक व्यवस्था शुल्क जमा होना अनिवार्य है।'
      )
    );
  }

  const kanyadanEligible = reasons.length === 0;
  let estimatedGrant = 0;
  if (kanyadanEligible) {
    const seniorityBonus = Math.min(3, Math.floor(membershipMonths / 12)) * 75000;
    const fullComplianceBonus = participationRate >= 98 ? 75000 : 0;
    estimatedGrant = Math.min(500000, 200000 + seniorityBonus + fullComplianceBonus);
  }

  // Fellowship Grant Calculation
  const fellowshipBaseMap = {
    UPSC_PSC: 100000,
    NEET_JEE: 85000,
    CLAT_JUDICIARY: 75000,
    OVERSEAS_MASTERS: 150000,
  };
  const fellowshipEligible = marksPercentage >= 60 && familyIncome <= 800000;
  const fellowshipGrant = fellowshipEligible ? fellowshipBaseMap[examCategory] : 0;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
            {t(
              lang,
              'Social Empowerment & Welfare Schemes',
              'सामाजिक सशक्तिकरण एवं कल्याणकारी योजनाएं'
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            {t(
              lang,
              'Savitribai Phule Kanyadan & Babasaheb Higher Education Fellowship',
              'सावित्रीबाई फुले कन्यादान सम्मान एवं बाबासाहेब उच्च शिक्षा फेलोशिप'
            )}
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
            {t(
              lang,
              'Beyond bereavement mutual aid, PBSCN empowers community daughters with marriage grants (₹2 Lakh to ₹5 Lakh) and meritorious students preparing for Civil Services, IIT/NEET, and Overseas PhDs.',
              'दिवंगत परिवारों की सुरक्षा के साथ-साथ यह नेटवर्क बेटियों के सम्मानजनक विवाह हेतु ₹2 लाख से ₹5 लाख तक का सीधा अनुदान और मेधावी छात्रों के लिए उच्च शिक्षा कोचिंग फेलोशिप प्रदान करता है।'
            )}
          </p>
        </div>
      </div>

      {/* Two Calculators Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scheme 1: Savitribai Phule Kanyadan Scheme */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-start gap-3.5 pb-4 border-b border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-rose-950 border border-rose-800/60 text-rose-300 flex items-center justify-center shrink-0">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400">
                  {t(
                    lang,
                    'Grant: ₹2,00,000 to ₹5,00,000 Direct Aid',
                    'अनुदान: ₹2,00,000 से ₹5,00,000 तक सीधा सहयोग'
                  )}
                </span>
                <h3 className="text-base font-extrabold text-white mt-0.5">
                  {t(
                    lang,
                    'Rashtramata Savitribai Phule Kanyadan Scheme',
                    'राष्ट्रमाता सावित्रीबाई फुले कन्यादान सम्मान योजना'
                  )}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {t(
                    lang,
                    'Eligibility: 12+ months parent membership, 90%+ Sahyog participation, and 90-day advance notice.',
                    'न्यूनतम 12 माह की सदस्यता, 90%+ सहयोग भागीदारी और विवाह से 90 दिन पूर्व आवेदन अनिवार्य।'
                  )}
                </p>
              </div>
            </div>

            {/* Interactive Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1.5">
                  {t(
                    lang,
                    `Parent Membership (${membershipMonths} Months)`,
                    `सदस्यता अवधि (${membershipMonths} माह)`
                  )}
                </label>
                <input
                  type="range"
                  min={3}
                  max={60}
                  value={membershipMonths}
                  onChange={(e) => setMembershipMonths(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono-tabular mt-1">
                  <span>3M</span>
                  <span>Min: 12M</span>
                  <span>60M</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1.5">
                  {t(
                    lang,
                    `Sahyog Compliance (${participationRate}%)`,
                    `सहयोग भागीदारी (${participationRate}%)`
                  )}
                </label>
                <input
                  type="range"
                  min={50}
                  max={100}
                  value={participationRate}
                  onChange={(e) => setParticipationRate(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono-tabular mt-1">
                  <span>50%</span>
                  <span>Rule: 90%</span>
                  <span>100%</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1.5">
                  {t(
                    lang,
                    'Days Before Wedding *',
                    'विवाह से कितने दिन पूर्व आवेदन? *'
                  )}
                </label>
                <input
                  type="number"
                  min={10}
                  max={365}
                  value={noticeDays}
                  onChange={(e) => setNoticeDays(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white font-mono-tabular font-bold"
                />
              </div>

              <div className="flex items-center gap-2 pt-5">
                <input
                  id="kanyadan-fee"
                  type="checkbox"
                  checked={shulkActive}
                  onChange={(e) => setShulkActive(e.target.checked)}
                  className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
                />
                <label htmlFor="kanyadan-fee" className="font-bold text-slate-300 cursor-pointer">
                  {t(lang, 'Annual Trust Fee Active', 'वार्षिक व्यवस्था शुल्क जमा है')}
                </label>
              </div>
            </div>
          </div>

          {/* Result Badge */}
          <div
            className={`p-4 rounded-xl border ${
              kanyadanEligible
                ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200'
                : 'bg-amber-950/80 border-amber-500/40 text-amber-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {kanyadanEligible ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
                )}
                <span className="text-xs font-extrabold uppercase tracking-wider">
                  {kanyadanEligible
                    ? t(lang, 'Eligible for Kanyadan Grant', 'कन्यादान अनुदान के लिए पात्र')
                    : t(lang, 'Conditions Incomplete', 'शर्तें अभी अधूरी हैं')}
                </span>
              </div>
              <span className="text-lg font-mono-tabular font-extrabold text-amber-300">
                {formatINR(estimatedGrant)}
              </span>
            </div>

            {reasons.length > 0 && (
              <ul className="mt-2.5 space-y-1 text-xs text-amber-300/90 list-disc list-inside">
                {reasons.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Scheme 2: Babasaheb Education & Mentorship Fellowship */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-start gap-3.5 pb-4 border-b border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-800/60 text-blue-300 flex items-center justify-center shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
                  {t(
                    lang,
                    'Grant: Up to ₹1,50,000 + 1-on-1 Mentorship',
                    'अनुदान: ₹1,50,000 तक + आईएएस/आईपीएस मेंटरशिप'
                  )}
                </span>
                <h3 className="text-base font-extrabold text-white mt-0.5">
                  {t(
                    lang,
                    'Babasaheb Higher Education & Civil Services Fellowship',
                    'बाबासाहेब उच्च शिक्षा एवं सिविल सेवा फेलोशिप'
                  )}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {t(
                    lang,
                    'Guided by senior IAS/IPS officers, doctors, and High Court advocates of Cadre A and C.',
                    'संवर्ग A एवं C के वरिष्ठ प्रशासनिक अधिकारियों, न्यायाधीशों व डॉक्टरों द्वारा रविवार मार्गदर्शन।'
                  )}
                </p>
              </div>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1.5">
                  {t(lang, 'Target Exam *', 'लक्षित परीक्षा *')}
                </label>
                <select
                  value={examCategory}
                  onChange={(e) =>
                    setExamCategory(
                      e.target.value as
                        | 'UPSC_PSC'
                        | 'NEET_JEE'
                        | 'CLAT_JUDICIARY'
                        | 'OVERSEAS_MASTERS'
                    )
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white font-bold"
                >
                  <option value="UPSC_PSC">UPSC / State PSC</option>
                  <option value="NEET_JEE">NEET / IIT-JEE</option>
                  <option value="CLAT_JUDICIARY">CLAT / Judiciary</option>
                  <option value="OVERSEAS_MASTERS">Overseas Masters/PhD</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1.5">
                  {t(lang, 'Qualifying Marks *', 'अर्हक परीक्षा अंक (%) *')}
                </label>
                <input
                  type="number"
                  min={40}
                  max={100}
                  value={marksPercentage}
                  onChange={(e) => setMarksPercentage(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white font-mono-tabular font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1.5">
                  {t(lang, 'Annual Family Income (₹)', 'वार्षिक पारिवारिक आय (₹)')}
                </label>
                <input
                  type="number"
                  step={50000}
                  value={familyIncome}
                  onChange={(e) => setFamilyIncome(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white font-mono-tabular font-bold"
                />
              </div>
            </div>
          </div>

          {/* Fellowship Result */}
          <div
            className={`p-4 rounded-xl border ${
              fellowshipEligible
                ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200'
                : 'bg-amber-950/80 border-amber-500/40 text-amber-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {fellowshipEligible ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
                )}
                <span className="text-xs font-extrabold uppercase tracking-wider">
                  {fellowshipEligible
                    ? t(lang, 'Eligible for Coaching Grant', 'कोचिंग फेलोशिप हेतु पात्र')
                    : t(lang, 'Criteria Below Threshold', 'अर्हता मानक से कम')}
                </span>
              </div>
              <span className="text-lg font-mono-tabular font-extrabold text-amber-300">
                {formatINR(fellowshipGrant)}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1.5">
              {fellowshipEligible
                ? t(
                    lang,
                    'Application includes complete tuition waiver at partner institutes + monthly study stipend.',
                    'अनुदान में पार्टनर संस्थानों में पूरी फीस छूट एवं अध्ययन सामग्री भत्ता शामिल है।'
                  )
                : t(
                    lang,
                    'Requires min 60% qualifying marks and family income under ₹8 Lakh/year.',
                    'पात्रता: न्यूनतम 60% अंक एवं पारिवारिक वार्षिक आय ₹8 लाख से कम।'
                  )}
            </p>
          </div>
        </div>
      </div>

      {/* Mentorship Board Roster */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-extrabold text-white">
            {t(
              lang,
              'Voluntary Mentorship Board (Cadre A & C Senior Leaders)',
              'स्वैच्छिक मेंटरशिप बोर्ड (संवर्ग A व C के वरिष्ठ मार्गदर्शक)'
            )}
          </h3>
          <p className="text-xs text-slate-400">
            {t(
              lang,
              'Serving bureaucrats and legal luminaries dedicating free Sunday hours to guide community aspirants.',
              'समुदाय के सेवारत अधिकारी जो हर रविवार मेधावी युवाओं को निःशुल्क व्यक्तिगत मार्गदर्शन देते हैं।'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FELLOWSHIP_MENTORS.map((m, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-800 text-amber-400 flex items-center justify-center text-xs font-bold font-mono-tabular">
                0{idx + 1}
              </div>
              <h4 className="text-sm font-extrabold text-white">{m.name}</h4>
              <div className="text-[11px] text-amber-300 font-semibold">{lang === 'en' ? m.roleEn : m.role}</div>
              <p className="text-xs text-slate-400 leading-relaxed">{m.examTrack} · {m.district} ({m.studentsMentored} {t(lang, 'mentored', 'मार्गदर्शित')})</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
