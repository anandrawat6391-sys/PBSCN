import React, { useState } from 'react';
import {
  Copy,
  Check,
  Upload,
  ShieldCheck,
  Building2,
  QrCode,
  FileCheck2,
  Search,
  ArrowUpRight,
  Users,
  HeartHandshake,
  Landmark,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { FOUR_CADRES } from '../data/pbscnData';
import {
  SahyogAlert,
  ContributionReceipt,
  CadreCode,
  formatINR,
  isValidUtrNumber,
} from '../utils/pbscnRules';
import { BharatQrWidget } from './BharatQrWidget';
import { DhammaChakraIcon } from './DhammaChakraIcon';
import DraggableCardDemo from './draggable-card-demo-2';
import { CardStackDemo } from './card-stack-demo';
import { LangMode, t } from '../utils/i18n';

interface SahyogAlertSectionProps {
  alerts: SahyogAlert[];
  receipts: ContributionReceipt[];
  onUploadReceipt: (newReceipt: ContributionReceipt) => void;
  onNavigateDirectory: (cadreFilter?: 'ALL' | CadreCode) => void;
  onOpenJoinModal?: () => void;
  lang: LangMode;
}

function MemberPortraitSvg({
  portraitId,
  cadre,
}: {
  portraitId: 'surendra' | 'ramprakash' | 'anita';
  cadre: CadreCode;
}) {
  const bgMap: Record<CadreCode, string> = {
    A: '#1E40AF',
    B: '#0284C7',
    C: '#4338CA',
    D: '#0D9488',
  };
  const initialsMap = {
    surendra: 'SKG',
    ramprakash: 'RPA',
    anita: 'AS',
  };
  const accent = bgMap[cadre];
  const isFemale = portraitId === 'anita';

  return (
    <svg
      viewBox="0 0 88 88"
      className="w-14 h-14 rounded-xl shrink-0 border border-slate-700 bg-slate-900 shadow-md"
      role="img"
      aria-label={`Portrait ${initialsMap[portraitId]}`}
    >
      <rect width="88" height="88" rx="12" fill="#0B132B" />
      <circle
        cx="44"
        cy="44"
        r="38"
        fill={accent}
        fillOpacity="0.15"
        stroke={accent}
        strokeWidth="1.5"
        strokeDasharray="3 2"
      />
      {isFemale ? (
        <>
          <path
            d="M22 78 C22 58 66 58 66 78"
            fill={accent}
            fillOpacity="0.25"
            stroke={accent}
            strokeWidth="2"
          />
          <circle
            cx="44"
            cy="34"
            r="14"
            fill={accent}
            fillOpacity="0.2"
            stroke={accent}
            strokeWidth="2"
          />
        </>
      ) : (
        <>
          <path
            d="M20 78 C20 56 68 56 68 78"
            fill={accent}
            fillOpacity="0.22"
            stroke={accent}
            strokeWidth="2"
          />
          <circle
            cx="44"
            cy="33"
            r="14"
            fill={accent}
            fillOpacity="0.2"
            stroke={accent}
            strokeWidth="2"
          />
        </>
      )}
      <rect x="18" y="60" width="52" height="18" rx="6" fill={accent} />
      <text
        x="44"
        y="73"
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="11"
        fontWeight="800"
        fontFamily="JetBrains Mono, monospace"
      >
        {initialsMap[portraitId]}
      </text>
    </svg>
  );
}

export const SahyogAlertSection: React.FC<SahyogAlertSectionProps> = ({
  alerts,
  receipts,
  onUploadReceipt,
  onNavigateDirectory,
  onOpenJoinModal,
  lang,
}) => {
  const activeAlert = alerts.find((a) => a.status === 'ACTIVE') || alerts[0];
  const cases = activeAlert.cases;

  const [selectedBankTab, setSelectedBankTab] = useState<Record<string, number>>({});
  const [expandedQrCase, setExpandedQrCase] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Receipt Upload Engine State
  const [selectedCaseId, setSelectedCaseId] = useState<string>(
    cases[0]?.case_id || 'PB-CASE-01'
  );
  const [donorMemberId, setDonorMemberId] = useState<string>('PB-2025-01042');
  const [donorName, setDonorName] = useState<string>(
    lang === 'en' ? 'Er. Milind Gautam' : 'इंजीनियर मिलिंद गौतम'
  );
  const [amountPaid, setAmountPaid] = useState<number>(activeAlert.amount_per_case);
  const [utrNumber, setUtrNumber] = useState<string>('');
  const [screenshotName, setScreenshotName] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [receiptFilterCase, setReceiptFilterCase] = useState<string>('ALL');

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleReceiptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setUploadSuccess(null);

    if (!donorMemberId.trim() || !donorName.trim()) {
      setFormError(
        t(
          lang,
          'Please enter your valid Member ID and Full Name.',
          'कृपया अपनी सही सदस्य आईडी (Member ID) और पूरा नाम दर्ज करें।'
        )
      );
      return;
    }

    if (!isValidUtrNumber(utrNumber)) {
      setFormError(
        t(
          lang,
          'Please enter a valid 12-digit UPI UTR / Reference Number.',
          'कृपया वैध 12 अंकों का यूपीआई यूटीआर (UTR) या बैंक संदर्भ क्रमांक दर्ज करें।'
        )
      );
      return;
    }

    const activeCase = cases.find((c) => c.case_id === selectedCaseId) || cases[0];
    const newSubmission: ContributionReceipt = {
      receipt_id: `REC-${Math.floor(10000 + Math.random() * 90000)}`,
      member_id: donorMemberId.trim().toUpperCase(),
      member_name: donorName.trim(),
      alert_number: activeAlert.alert_number,
      case_id: activeCase.case_id,
      amount_paid: amountPaid,
      utr_number: utrNumber.trim().toUpperCase(),
      screenshot_url: screenshotName || 'verified-bank-proof://upi_receipt.jpg',
      submitted_at: new Date().toISOString(),
      verification_status: 'PENDING',
    };

    onUploadReceipt(newSubmission);
    setUtrNumber('');
    setScreenshotName('');
    setUploadSuccess(
      t(
        lang,
        `Receipt ${newSubmission.receipt_id} logged for ${activeCase.deceased_name}. Sent to District Audit Committee for verification.`,
        `रसीद संख्या ${newSubmission.receipt_id} (${activeCase.deceased_name}) सफलतापूर्वक दर्ज कर ली गई है। जिला ऑडिट कमेटी द्वारा सत्यापन के बाद यह प्रमाणित हो जाएगी।`
      )
    );
  };

  const filteredReceipts =
    receiptFilterCase === 'ALL'
      ? receipts
      : receipts.filter((r) => r.case_id === receiptFilterCase);

  return (
    <div className="space-y-8">
      {/* SECTION 1: Active Sahyog Alert #09 Banner */}
      <div className="bg-slate-900 border border-blue-900/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-amber-400 text-slate-950 font-mono-tabular shadow-sm">
                {t(
                  lang,
                  `ACTIVE APPEAL #0${activeAlert.alert_number}`,
                  `सक्रिय सहयोग अपील #0${activeAlert.alert_number}`
                )}
              </span>
              <span className="text-xs text-amber-300 font-semibold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {t(
                  lang,
                  `Window: ${activeAlert.start_date} to ${activeAlert.end_date}`,
                  `अवधि: ${activeAlert.start_date} से ${activeAlert.end_date}`
                )}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              {t(
                lang,
                'Emergency Sahyog Alert — 3 Verified Bereavement Cases',
                'आपातकालीन सहयोग अपील — 3 भौतिक सत्यापित दिवंगत केस'
              )}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {t(
                lang,
                'Transfer ₹35 directly into the legal nominee\'s bank account via UPI or IMPS. PBSCN charges zero commission. Once transferred, upload your 12-digit UTR below to update the public transparency ledger.',
                'दिवंगत साथी के नॉमिनी के बैंक खाते में बिना किसी बिचौलिए के सीधे ₹35 ट्रांसफर करें। ट्रांसफर के उपरांत नीचे अपना 12 अंकों का यूटीआर (UTR) दर्ज करें ताकि सार्वजनिक पारदर्शिता बहीखाते में आपकी सहभागिता दर्ज हो सके।'
              )}
            </p>
          </div>

          <div className="flex sm:flex-row lg:flex-col gap-2 shrink-0">
            <a
              href="#receipt-upload-engine"
              className="px-4 py-2.5 rounded-xl text-xs font-extrabold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md text-center cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Upload className="w-4 h-4 text-amber-300" />
              <span>{t(lang, 'Submit UTR Receipt', 'सहयोग रसीद दर्ज करें')}</span>
            </a>
          </div>
        </div>
      </div>

      {/* SECTION 2: The 3 Bereavement Case Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {cases.map((alertCase) => {
          const activeBankIdx = selectedBankTab[alertCase.case_id] ?? 0;
          const currentBank =
            alertCase.accounts[activeBankIdx] || alertCase.accounts[0];
          const pct = Math.min(
            100,
            Math.round(
              (alertCase.current_raised / alertCase.target_estimate) * 100
            )
          );
          const isQrOpen = expandedQrCase === alertCase.case_id;

          // Pure language separation
          const designationText =
            lang === 'en'
              ? alertCase.designation.split('·')[0].trim()
              : (alertCase.designation.split('·')[1] || alertCase.designation).trim();

          const cadreTitle =
            lang === 'en'
              ? `Cadre ${alertCase.cadre} · ${alertCase.district}, ${alertCase.state}`
              : `संवर्ग ${alertCase.cadre} · ${alertCase.district}, उत्तर प्रदेश`;

          return (
            <article
              key={alertCase.case_id}
              className="bg-slate-900/90 border border-slate-800 hover:border-blue-700/60 rounded-2xl shadow-xl transition-all flex flex-col justify-between overflow-hidden"
            >
              <div>
                {/* Dossier Header */}
                <div className="px-5 py-3 bg-[#0A1021] border-b border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-mono-tabular font-extrabold text-amber-300 tracking-wider">
                    {alertCase.case_id} · {alertCase.deceased_member_id}
                  </span>
                  <span className="font-semibold text-emerald-400 flex items-center gap-1 text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {t(lang, '5-Member Audited', '5-सदस्यीय टीम सत्यापित')}
                  </span>
                </div>

                {/* Profile Information */}
                <div className="p-5 border-b border-slate-800/80 flex items-start gap-4">
                  <MemberPortraitSvg
                    portraitId={alertCase.portrait_id}
                    cadre={alertCase.cadre}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
                      {cadreTitle}
                    </div>
                    <h3 className="text-base font-extrabold text-white mt-0.5">
                      {alertCase.deceased_name}
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5 leading-snug">
                      {designationText}
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-[11px] font-mono-tabular text-slate-400">
                      <span>{t(lang, 'Joined:', 'सदस्यता:')} {alertCase.doj}</span>
                      <span>·</span>
                      <span className="text-rose-400 font-semibold">
                        {t(lang, 'Demise:', 'निधन:')} {alertCase.dod}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar & Amount Raised */}
                <div className="px-5 py-3.5 bg-slate-950/60 border-b border-slate-800/80 space-y-2">
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="font-medium text-slate-400">
                      {t(lang, 'Direct Nominee Credit:', 'नॉमिनी खाते में कुल जमा:')}
                    </span>
                    <span className="font-mono-tabular font-extrabold text-white text-sm">
                      {formatINR(alertCase.current_raised)}{' '}
                      <span className="text-slate-500 font-normal text-xs">
                        / {formatINR(alertCase.target_estimate)}
                      </span>
                    </span>
                  </div>

                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-amber-400 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono-tabular">
                    <span>
                      <strong className="text-emerald-400">
                        {alertCase.contributors_count.toLocaleString('en-IN')}
                      </strong>{' '}
                      {t(lang, 'members sent aid', 'साथियों ने सहयोग भेजा')}
                    </span>
                    <span className="font-extrabold text-amber-300">
                      ₹{activeAlert.amount_per_case} / {t(lang, 'member', 'सदस्य')}
                    </span>
                  </div>
                </div>

                {/* Legal Nominee Info */}
                <div className="px-5 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 font-medium">
                      {t(lang, 'Legal Nominee:', 'वैध नॉमिनी:')}
                    </span>{' '}
                    <strong className="text-amber-200">
                      {alertCase.nominee_name}
                    </strong>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800">
                    {alertCase.nominee_relation}
                  </span>
                </div>

                {/* Nominee Bank Credentials & One-Click Copy */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-blue-400" />
                      {t(lang, 'Nominee Bank Credentials', 'नॉमिनी बैंक खाता विवरण')}
                    </span>

                    {/* Multi-bank Switcher */}
                    <div className="inline-flex rounded-lg border border-slate-800 p-0.5 bg-slate-950">
                      {alertCase.accounts.map((acc, idx) => (
                        <button
                          key={acc.ac}
                          type="button"
                          onClick={() =>
                            setSelectedBankTab((prev) => ({
                              ...prev,
                              [alertCase.case_id]: idx,
                            }))
                          }
                          className={`px-2 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                            activeBankIdx === idx
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {idx === 0
                            ? t(lang, 'Primary A/C', 'मुख्य खाता')
                            : t(lang, 'Alt A/C', 'वैकल्पिक खाता')}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">{t(lang, 'Bank Name:', 'बैंक:')}</span>
                      <span className="font-extrabold text-white text-right">
                        {currentBank.bank}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">{t(lang, 'Account No:', 'खाता संख्या:')}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono-tabular font-bold text-amber-300">
                          {currentBank.ac}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(currentBank.ac, `ac-${alertCase.case_id}`)}
                          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                          title="Copy Account Number"
                        >
                          {copiedKey === `ac-${alertCase.case_id}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">IFSC:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono-tabular font-bold text-white">
                          {currentBank.ifsc}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(currentBank.ifsc, `ifsc-${alertCase.case_id}`)}
                          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                          title="Copy IFSC"
                        >
                          {copiedKey === `ifsc-${alertCase.case_id}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* QR Code Action Toggle */}
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedQrCase(isQrOpen ? null : alertCase.case_id)
                    }
                    className="w-full py-2.5 rounded-xl border border-blue-500/30 hover:border-blue-400 bg-blue-950/40 hover:bg-blue-900/40 text-blue-300 hover:text-white text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <QrCode className="w-4 h-4 text-amber-400" />
                    <span>
                      {isQrOpen
                        ? t(lang, 'Hide BharatQR', 'क्यूआर कोड छिपाएं')
                        : t(lang, 'Show BharatQR (Scan & Pay ₹35)', 'भारत क्यूआर कोड देखें (स्कैन करें)')}
                    </span>
                  </button>

                  {/* BharatQR Widget Modal Display */}
                  {isQrOpen && (
                    <div className="pt-2">
                      <BharatQrWidget
                        upiId={currentBank.upi_id}
                        payeeName={currentBank.holder}
                        amount={activeAlert.amount_per_case}
                        transactionNote={`PBSCN Alert ${activeAlert.alert_number} ${alertCase.case_id}`}
                      />
                    </div>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* SECTION 3: UTR Receipt Verification Engine */}
      <div
        id="receipt-upload-engine"
        className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl"
      >
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-white">
              {t(
                lang,
                'Sahyog UTR Verification & Receipt Submission',
                'सहयोग यूटीआर सत्यापन एवं रसीद पंजीकरण'
              )}
            </h3>
            <p className="text-xs text-slate-400">
              {t(
                lang,
                'Submit your 12-digit Bank/UPI reference number to certify your mandatory 90% participation rule.',
                'संविधान के 90% अनिवार्य सहयोग नियम की पात्रता बनाए रखने के लिए बैंक का 12 अंकों का संदर्भ क्रमांक (UTR) दर्ज करें।'
              )}
            </p>
          </div>
        </div>

        {uploadSuccess && (
          <div className="mb-5 p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{uploadSuccess}</span>
          </div>
        )}

        {formError && (
          <div className="mb-5 p-4 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs">
            {formError}
          </div>
        )}

        <form onSubmit={handleReceiptSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-300 mb-1.5">
                {t(lang, 'Case ID *', 'सहयोग केस चुनें *')}
              </label>
              <select
                value={selectedCaseId}
                onChange={(e) => setSelectedCaseId(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 font-bold text-white focus:border-blue-500 focus:outline-none"
              >
                {cases.map((c) => (
                  <option key={c.case_id} value={c.case_id}>
                    {c.case_id} — {c.deceased_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1.5">
                {t(lang, 'Your Member ID *', 'आपकी सदस्य संख्या (Member ID) *')}
              </label>
              <input
                type="text"
                value={donorMemberId}
                onChange={(e) => setDonorMemberId(e.target.value)}
                placeholder="e.g. PB-2025-01042"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 font-mono-tabular font-bold text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1.5">
                {t(lang, 'Your Full Name *', 'आपका पूरा नाम *')}
              </label>
              <input
                type="text"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                placeholder="e.g. Dr. Siddharth Gautam"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 font-bold text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1.5">
                {t(lang, '12-Digit UPI UTR / Ref No. *', '12 अंकों का UTR / बैंक संदर्भ क्रमांक *')}
              </label>
              <input
                type="text"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                placeholder="e.g. 429182948210"
                maxLength={24}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 font-mono-tabular font-bold text-amber-300 focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="text-[11px] text-slate-400">
              {t(
                lang,
                'Amount: ₹35 per case · All transfers are verified against direct nominee bank statements.',
                'सहयोग राशि: ₹35 प्रति केस · सभी यूटीआर का भौतिक मिलान नॉमिनी के बैंक स्टेटमेंट से किया जाता है।'
              )}
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4 text-slate-950" />
              <span>{t(lang, 'Submit Receipt to Ledger', 'रसीद दर्ज करें')}</span>
            </button>
          </div>
        </form>
      </div>

      {/* SECTION 4: The 4 Swabhiman Cadres Overview */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-extrabold text-white">
            {t(
              lang,
              'The 4 Swabhiman Cadres of Prabuddha Bharat',
              'प्रबुद्ध भारत के 4 स्वाभिमान संवर्ग'
            )}
          </h3>
          <p className="text-xs text-slate-400">
            {t(
              lang,
              'Equal solidarity across government servants, private professionals, legal/medical experts, and grassroots citizens.',
              'सरकारी कर्मचारियों, निजी क्षेत्र, अधिवक्ताओं/चिकित्सकों तथा आम नागरिकों का संयुक्त स्वाभिमान मंच।'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FOUR_CADRES.map((cadre) => (
            <div
              key={cadre.code}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-700/60 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-800 text-amber-400 font-extrabold text-xs flex items-center justify-center">
                    {cadre.code}
                  </span>
                  <span className="text-xs font-mono-tabular font-bold text-slate-300">
                    {cadre.membersCount.toLocaleString('en-IN')} {t(lang, 'members', 'सदस्य')}
                  </span>
                </div>

                <h4 className="text-sm font-extrabold text-white">
                  {lang === 'en' ? cadre.titleEn : cadre.titleHi}
                </h4>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {lang === 'en' ? cadre.subtitleEn : cadre.subtitleHi}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>{t(lang, 'District Committees:', 'जिला कमेटियां:')} {cadre.activeDistrictCommittees}</span>
                <button
                  type="button"
                  onClick={() => onNavigateDirectory(cadre.code)}
                  className="font-bold text-amber-400 hover:text-amber-300 cursor-pointer"
                >
                  {t(lang, 'View →', 'देखें →')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 5: Interactive Solidarity Showcase (CardStack & 3D Cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
              {t(
                lang,
                'Verified Nominee Testimonials · CardStack',
                'सत्यापित नॉमिनी परिवारों के अनुभव · CardStack'
              )}
            </div>
            <h3 className="text-base font-extrabold text-white mt-0.5">
              {t(
                lang,
                'Direct Impact on Bereaved Families',
                'दिवंगत परिवारों को मिला सीधा संबल'
              )}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {t(
                lang,
                'Real accounts from nominee families and community mentors.',
                'नॉमिनी परिवारों और जिला मेंटर्स के वास्तविक अनुभव।'
              )}
            </p>
          </div>

          <div className="my-auto pt-4">
            <CardStackDemo lang={lang} />
          </div>
        </div>

        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
              {t(
                lang,
                'Interactive 3D Solidarity Deck · Draggable Cards',
                '3D स्वाभिमान कार्ड डेक · Draggable Cards'
              )}
            </div>
            <h3 className="text-base font-extrabold text-white mt-0.5">
              {t(
                lang,
                'Explore the 5 Constitutional Pillars of PBSCN',
                'प्रबुद्ध भारत के 5 संवैधानिक स्तंभ'
              )}
            </h3>
          </div>

          <DraggableCardDemo lang={lang} />
        </div>
      </div>
    </div>
  );
};
