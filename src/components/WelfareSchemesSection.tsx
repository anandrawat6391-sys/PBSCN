import React, { useState } from 'react';
import {
  Heart,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Award,
  Sparkles,
} from 'lucide-react';
import { FELLOWSHIP_MENTORS } from '../data/pbscnData';
import { evaluateKanyadanEligibility, formatINR } from '../utils/pbscnRules';
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

  const kanyadanResult = evaluateKanyadanEligibility({
    membershipMonths,
    participationRate,
    daysBeforeMarriage: noticeDays,
    vyawasthaShulkActive: shulkActive,
  });

  // Fellowship Grant Calculation
  const fellowshipBaseMap = {
    UPSC_PSC: 100000,
    NEET_JEE: 85000,
    CLAT_JUDICIARY: 75000,
    OVERSEAS_MASTERS: 150000,
  };
  const fellowshipEligible = marksPercentage >= 60 && familyIncome <= 800000;
  const fellowshipGrant = fellowshipEligible
    ? fellowshipBaseMap[examCategory]
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="text-xs font-bold uppercase tracking-wider text-blue-800">
          {t(
            lang,
            'Social Empowerment & Pay Back to Society Initiatives',
            'सामाजिक सशक्तिकरण एवं "Pay Back to Society" कल्याणकारी योजनाएं'
          )}
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
          {t(
            lang,
            'Rashtramata Savitribai Phule Kanyadan & Babasaheb Higher Education Fellowship',
            'राष्ट्रमाता सावित्रीबाई फुले कन्यादान योजना एवं बाबासाहेब उच्च शिक्षा फेलोशिप'
          )}
        </h2>
        <p className="text-xs text-slate-600 mt-1 max-w-3xl">
          {t(
            lang,
            'Beyond bereavement support, PBSCN empowers our community’s daughters and meritorious students preparing for UPSC, State PSC, NEET, JEE, CLAT, and Overseas Master’s/PhD programs.',
            'दिवंगत परिवारों की सुरक्षा के साथ-साथ हमारा नेटवर्क बेटियों के सम्मानजनक विवाह और मेधावी छात्र-छात्राओं की UPSC, पीसीएस, NEET, JEE एवं विदेश में उच्च शिक्षा के लिए सीधा अनुदान देता है।'
          )}
        </p>
      </div>

      {/* Two-Column Interactive Scheme Calculators */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scheme 1: Rashtramata Savitribai Phule Kanyadan Scheme */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-start gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center shrink-0">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">
                  {t(
                    lang,
                    'Grant: ₹2,00,000 to ₹5,00,000',
                    'अनुदान: ₹2,00,000 से ₹5,00,000'
                  )}
                </span>
                <h3 className="text-base font-extrabold text-slate-900">
                  {t(
                    lang,
                    'Rashtramata Savitribai Phule Kanyadan Samman Scheme',
                    'राष्ट्रमाता सावित्रीबाई फुले कन्यादान सम्मान योजना'
                  )}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t(
                    lang,
                    'Requires 12+ months active membership, 90%+ Sahyog participation, and 90 days advance application.',
                    'पात्रता: न्यूनतम 1 वर्ष पुरानी सदस्यता, 90%+ सहयोग रिकॉर्ड और विवाह से 90 दिन पूर्व आवेदन।'
                  )}
                </p>
              </div>
            </div>

            {/* Interactive Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {t(
                    lang,
                    `Parent Membership Tenure (${membershipMonths} Months)`,
                    `सदस्यता अवधि (${membershipMonths} माह)`
                  )}
                </label>
                <input
                  type="range"
                  min={3}
                  max={60}
                  value={membershipMonths}
                  onChange={(e) => setMembershipMonths(Number(e.target.value))}
                  className="w-full accent-blue-800"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono-tabular">
                  <span>3M</span>
                  <span>Min: 12M</span>
                  <span>60M</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {t(
                    lang,
                    `Sahyog Participation (${participationRate}%)`,
                    `सहयोग भागीदारी (${participationRate}%)`
                  )}
                </label>
                <input
                  type="range"
                  min={50}
                  max={100}
                  value={participationRate}
                  onChange={(e) => setParticipationRate(Number(e.target.value))}
                  className="w-full accent-blue-800"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono-tabular">
                  <span>50%</span>
                  <span>Rule: 90%</span>
                  <span>100%</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {t(
                    lang,
                    'Advance Notice Before Marriage (Days)',
                    'विवाह से कितने दिन पूर्व आवेदन?'
                  )}
                </label>
                <input
                  type="number"
                  min={10}
                  max={365}
                  value={noticeDays}
                  onChange={(e) => setNoticeDays(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono-tabular font-bold text-slate-900"
                />
              </div>

              <div className="flex items-center gap-2 pt-4">
                <input
                  id="kanyadan-shulk"
                  type="checkbox"
                  checked={shulkActive}
                  onChange={(e) => setShulkActive(e.target.checked)}
                  className="w-4 h-4 accent-blue-800 rounded"
                />
                <label
                  htmlFor="kanyadan-shulk"
                  className="font-bold text-slate-800"
                >
                  {t(
                    lang,
                    'Annual Vyawastha Shulk Active',
                    'वार्षिक व्यवस्था शुल्क जमा है'
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* Kanyadan Result Box */}
          <div
            className={`p-4 rounded-xl border ${
              kanyadanResult.eligible
                ? 'bg-emerald-50/90 border-emerald-300'
                : 'bg-amber-50/90 border-amber-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {kanyadanResult.eligible ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" />
                )}
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                  {kanyadanResult.eligible
                    ? t(
                        lang,
                        'ELIGIBLE FOR KANYADAN SAMMAN GRANT',
                        'कन्यादान सम्मान अनुदान के लिए पात्र'
                      )
                    : t(
                        lang,
                        'REQUIREMENTS PENDING FOR KANYADAN GRANT',
                        'कन्यादान अनुदान की शर्तें अधूरी हैं'
                      )}
                </span>
              </div>
              <span className="text-lg font-mono-tabular font-extrabold text-emerald-800">
                {formatINR(kanyadanResult.estimatedGrantInr)}
              </span>
            </div>

            {kanyadanResult.reasons.length > 0 && (
              <ul className="mt-2 space-y-1 text-xs text-amber-900 list-disc list-inside">
                {kanyadanResult.reasons.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Scheme 2: Babasaheb Higher Education & Coaching Fellowship */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-start gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 flex items-center justify-center shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800">
                  {t(
                    lang,
                    'UPSC · State PSC · NEET · JEE · CLAT · Overseas PhD',
                    'UPSC · स्टेट पीसीएस · NEET · JEE · CLAT · विदेश शिक्षा'
                  )}
                </span>
                <h3 className="text-base font-extrabold text-slate-900">
                  {t(
                    lang,
                    'Babasaheb Dr. B.R. Ambedkar Higher Education Fellowship',
                    'बाबासाहेब डॉ. बी.आर. अम्बेडकर उच्च शिक्षा एवं कोचिंग फेलोशिप'
                  )}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t(
                    lang,
                    'Direct coaching & tuition grant plus 1-on-1 mentorship by IAS, IPS, AIIMS & IIT officers from Cadre A & C.',
                    'संवर्ग A व C के वरिष्ठ IAS, IPS, डॉक्टर और प्रोफेसरों द्वारा मार्गदर्शन एवं सीधा कोचिंग/ट्यूशन अनुदान।'
                  )}
                </p>
              </div>
            </div>

            {/* Fellowship Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">
                  {t(
                    lang,
                    'Select Target Competitive Exam / Track',
                    'प्रतियोगी परीक्षा / उच्च शिक्षा श्रेणी चुनें'
                  )}
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
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-bold text-slate-900"
                >
                  <option value="UPSC_PSC">
                    UPSC Civil Services / State PSC (Grant up to ₹1,00,000)
                  </option>
                  <option value="NEET_JEE">
                    NEET Medical / IIT-JEE Engineering (Grant up to ₹85,000)
                  </option>
                  <option value="CLAT_JUDICIARY">
                    CLAT Law / Judicial Services PCS-J (Grant up to ₹75,000)
                  </option>
                  <option value="OVERSEAS_MASTERS">
                    Overseas Master’s / PhD Fellowship (Grant up to ₹1,50,000)
                  </option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {t(
                    lang,
                    `Previous Qualifying Exam Marks (${marksPercentage}%)`,
                    `पिछली परीक्षा के अंक (${marksPercentage}%)`
                  )}
                </label>
                <input
                  type="number"
                  min={40}
                  max={100}
                  value={marksPercentage}
                  onChange={(e) => setMarksPercentage(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono-tabular font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {t(
                    lang,
                    'Annual Family Income (₹)',
                    'वार्षिक पारिवारिक आय (₹)'
                  )}
                </label>
                <input
                  type="number"
                  step={25000}
                  value={familyIncome}
                  onChange={(e) => setFamilyIncome(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono-tabular font-bold text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Fellowship Output */}
          <div
            className={`p-4 rounded-xl border ${
              fellowshipEligible
                ? 'bg-blue-50/90 border-blue-300'
                : 'bg-amber-50/90 border-amber-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-800 shrink-0" />
                <div>
                  <div className="text-xs font-extrabold text-slate-900">
                    {fellowshipEligible
                      ? t(
                          lang,
                          'ELIGIBLE FOR BABASAHEB FELLOWSHIP',
                          'बाबासाहेब शिक्षा फेलोशिप के लिए पात्र'
                        )
                      : t(
                          lang,
                          'CRITERIA NOT MET (MIN 60% MARKS & INCOME ≤ ₹8L)',
                          'न्यूनतम 60% अंक एवं आय ≤ ₹8 लाख आवश्यक'
                        )}
                  </div>
                  <div className="text-[11px] text-slate-600">
                    {t(
                      lang,
                      'Includes 1-on-1 Cadre A/C Officer Mentorship',
                      'संवर्ग A/C के अधिकारियों द्वारा 1-on-1 मेंटरशिप शामिल'
                    )}
                  </div>
                </div>
              </div>
              <span className="text-lg font-mono-tabular font-extrabold text-blue-900">
                {formatINR(fellowshipGrant)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Fellowship Mentors Panel */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-800" />
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              {t(
                lang,
                'National Academic & Civil Services Mentorship Board (Cadre A, B & C)',
                'राष्ट्रीय शैक्षणिक एवं सिविल सेवा मेंटरशिप बोर्ड (संवर्ग A, B एवं C)'
              )}
            </h3>
            <p className="text-xs text-slate-500">
              {t(
                lang,
                'Senior bureaucrats, doctors, and professors volunteering every Sunday to mentor PBSCN students.',
                'हर रविवार हमारे समाज के छात्र-छात्राओं को निःशुल्क मार्गदर्शन देने वाले वरिष्ठ अधिकारी एवं प्रोफेसर।'
              )}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {FELLOWSHIP_MENTORS.map((mentor) => (
            <div
              key={mentor.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between space-y-2"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono-tabular font-bold text-blue-800">
                  <span>Cadre {mentor.cadre}</span>
                  <span className="flex items-center gap-1 text-amber-700">
                    <Sparkles className="w-3 h-3" />
                    {mentor.studentsMentored} Guided
                  </span>
                </div>
                <h4 className="text-sm font-extrabold text-slate-900 mt-1">
                  {mentor.name}
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  {lang === 'en' ? mentor.roleEn : mentor.role}
                </p>
              </div>
              <div className="pt-2 border-t border-slate-200/70 text-[11px] font-semibold text-emerald-800">
                {mentor.examTrack} · {mentor.district}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
