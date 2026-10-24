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
import { DhammaChakraIcon, StupaMonumentIllustration } from './DhammaChakraIcon';
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
      className="w-14 h-14 rounded-lg shrink-0 border border-slate-200 bg-slate-50 shadow-2xs"
      role="img"
      aria-label={`Portrait ${initialsMap[portraitId]}`}
    >
      <rect width="88" height="88" rx="8" fill="#F8FAFC" />
      <circle
        cx="44"
        cy="44"
        r="38"
        fill={accent}
        fillOpacity="0.08"
        stroke={accent}
        strokeWidth="1.2"
        strokeDasharray="3 2"
      />
      {isFemale ? (
        <>
          <path
            d="M22 78 C22 58 66 58 66 78"
            fill={accent}
            fillOpacity="0.18"
            stroke={accent}
            strokeWidth="2"
          />
          <circle
            cx="44"
            cy="34"
            r="14"
            fill={accent}
            fillOpacity="0.15"
            stroke={accent}
            strokeWidth="2"
          />
        </>
      ) : (
        <>
          <path
            d="M20 78 C20 56 68 56 68 78"
            fill={accent}
            fillOpacity="0.15"
            stroke={accent}
            strokeWidth="2"
          />
          <circle
            cx="44"
            cy="33"
            r="14"
            fill={accent}
            fillOpacity="0.14"
            stroke={accent}
            strokeWidth="2"
          />
        </>
      )}
      <rect x="18" y="60" width="52" height="18" rx="4" fill={accent} />
      <text
        x="44"
        y="73"
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="11"
        fontWeight="700"
        fontFamily="Plus Jakarta Sans, sans-serif"
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
  const [expandedQrCase, setExpandedQrCase] = useState<string | null>(
    cases[0]?.case_id || 'PB-CASE-01'
  );
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Receipt Upload Engine State
  const [selectedCaseId, setSelectedCaseId] = useState<string>(
    cases[0]?.case_id || 'PB-CASE-01'
  );
  const [donorMemberId, setDonorMemberId] = useState<string>('PB-2025-01042');
  const [donorName, setDonorName] = useState<string>('Er. Milind Gautam');
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
          'कृपया अपनी सही Member ID और पूरा नाम दर्ज करें।'
        )
      );
      return;
    }

    if (!isValidUtrNumber(utrNumber)) {
      setFormError(
        t(
          lang,
          'Please enter a valid 12-digit UPI UTR / Reference Number (8–28 chars).',
          'कृपया सही 12-अंकों का UPI UTR / Reference Number डालें (8–28 अक्षर या नंबर)।'
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
        `रसीद ${newSubmission.receipt_id} (${activeCase.deceased_name}) सफलतापूर्वक दर्ज हो गई! जिला ऑडिट कमेटी द्वारा जांच के बाद यह Verified हो जाएगी।`
      )
    );
  };

  const filteredReceipts =
    receiptFilterCase === 'ALL'
      ? receipts
      : receipts.filter((r) => r.case_id === receiptFilterCase);

  return (
    <div className="space-y-6">
      {/* Compact Sovereign Architectural Banner + 4-KPI Ledger Bar */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-xs overflow-hidden">
        <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#1E3A8A] text-white px-5 py-4 sm:px-6 sm:py-5">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-1.5 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold tracking-wide text-amber-300 uppercase">
                <DhammaChakraIcon size={15} className="text-amber-400 shrink-0" />
                <span>
                  {t(
                    lang,
                    'Dr. B.R. Ambedkar Vision · "Pay Back to Society" · Educate, Agitate, Organise',
                    'डॉ. बी.आर. अम्बेडकर विचारधारा · "Pay Back to Society" · शिक्षित बनो, संगठित रहो, संघर्ष करो'
                  )}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white leading-snug">
                {t(
                  lang,
                  'Prabuddha Bharat Social Care Network (PBSCN) — 100% Direct Peer-to-Peer Family Security',
                  'प्रबुद्ध भारत स्वाभिमान न्यास (PBSCN) — 100% Direct Peer-to-Peer पारिवारिक सुरक्षा नेटवर्क'
                )}
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {t(
                  lang,
                  'Zero middleman cut. When an active member passes away, 62,410+ verified members transfer ₹35–₹50 directly into the legal nominee’s bank account via UPI/IMPS, raising ₹22 Lakh to ₹50 Lakh+ within days.',
                  'बिना किसी बिचौलिए या एजेंट के — जब हमारे किसी सदस्य का आकस्मिक निधन होता है, तो 62,410+ सदस्य सीधे नॉमिनी के बैंक खाते में ₹35 से ₹50 UPI करते हैं, जिससे परिवार को ₹22 लाख से ₹50 लाख+ की सीधी आर्थिक सुरक्षा मिलती है।'
                )}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="hidden xl:block w-28 h-20 rounded-lg bg-slate-900/50 border border-white/10 p-1.5">
                <StupaMonumentIllustration className="w-full h-full" />
              </div>
              <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
                {onOpenJoinModal && (
                  <button
                    type="button"
                    onClick={onOpenJoinModal}
                    className="px-4 py-2 rounded-lg text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <span>
                      {t(lang, '+ Register as New Member', '+ नए सदस्य के रूप में जुड़ें')}
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                )}
                <a
                  href="#receipt-upload-engine"
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-colors text-center"
                >
                  {t(lang, 'Submit UTR Receipt ↓', 'अपनी सहयोग रसीद (UTR) अपलोड करें ↓')}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column High-Contrast Sovereign KPI Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 bg-slate-50/70">
          <div className="px-4 py-3 sm:px-5 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                {t(lang, 'Verified Members', 'सत्यापित सदस्य संख्या')}
              </div>
              <div className="text-lg sm:text-xl font-extrabold text-slate-900 font-mono-tabular mt-0.5">
                62,410
              </div>
              <div className="text-[11px] text-emerald-700 font-medium">
                {t(lang, 'Across 75 UP Districts & States', '75 जिलों व अन्य राज्यों में सक्रिय')}
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 shrink-0">
              <Users className="w-4 h-4" />
            </div>
          </div>

          <div className="px-4 py-3 sm:px-5 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                {t(lang, 'Micro-Contribution', 'प्रति केस सहयोग राशि')}
              </div>
              <div className="text-lg sm:text-xl font-extrabold text-blue-800 font-mono-tabular mt-0.5">
                ₹35 – ₹50
              </div>
              <div className="text-[11px] text-slate-600 font-medium">
                {t(lang, 'Direct to Nominee Bank A/C', 'सीधे नॉमिनी के बैंक खाते में')}
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
              <HeartHandshake className="w-4 h-4" />
            </div>
          </div>

          <div className="px-4 py-3 sm:px-5 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                {t(lang, 'Total P2P Aid Delivered', 'अब तक कुल सीधा सहयोग')}
              </div>
              <div className="text-lg sm:text-xl font-extrabold text-slate-900 font-mono-tabular mt-0.5">
                ₹28.45 Cr
              </div>
              <div className="text-[11px] text-emerald-700 font-medium">
                {t(lang, '114 Bereaved Families Supported', '114 दिवंगत परिवारों को संबल')}
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
              <Landmark className="w-4 h-4" />
            </div>
          </div>

          <div className="px-4 py-3 sm:px-5 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                {t(lang, 'Intermediary Commission', 'बिचौलिया कमीशन / कटौती')}
              </div>
              <div className="text-lg sm:text-xl font-extrabold text-emerald-700 font-mono-tabular mt-0.5">
                0.00%
              </div>
              <div className="text-[11px] text-slate-600 font-medium">
                {t(lang, '100% Direct Bank-to-Bank', '100% पारदर्शी सीधा बैंक ट्रांसफर')}
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: Active Sahyog Alert #09 — 3 Bereavement Case Profile Cards */}
      <div className="space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-amber-50/90 border border-amber-300/80 rounded-xl px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-extrabold uppercase tracking-wider bg-amber-600 text-white font-mono-tabular">
              {t(
                lang,
                `ACTIVE APPEAL #0${activeAlert.alert_number}`,
                `सक्रिय अपील #0${activeAlert.alert_number}`
              )}
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                {t(
                  lang,
                  'Mandatory Emergency Sahyog Alert — 3 Verified Bereavement Cases',
                  'अनिवार्य आपातकालीन सहयोग अलर्ट — 3 भौतिक सत्यापित दिवंगत केस'
                )}
              </h2>
              <p className="text-xs text-slate-600">
                {t(
                  lang,
                  'Copy the nominee Account Number / IFSC or scan the BharatQR to transfer ₹35 directly, then upload your 12-digit UTR below.',
                  'नीचे दिए गए किसी भी केस के नॉमिनी का Account Number / IFSC कॉपी करें या BharatQR स्कैन करके ₹35 भेजें और अपना UTR अपलोड करें।'
                )}
              </p>
            </div>
          </div>
          <div className="text-xs font-semibold text-amber-950 font-mono-tabular shrink-0 bg-white px-3 py-1.5 rounded-lg border border-amber-200">
            {t(
              lang,
              `Window: ${activeAlert.start_date} to ${activeAlert.end_date}`,
              `अवधि: ${activeAlert.start_date} से ${activeAlert.end_date}`
            )}
          </div>
        </div>

        {/* 3 Case Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
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

            return (
              <article
                key={alertCase.case_id}
                className="bg-white border border-slate-200 rounded-xl shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between overflow-hidden"
              >
                <div>
                  {/* Card Top Bar */}
                  <div className="px-4 py-2.5 bg-slate-900 text-white flex items-center justify-between text-xs">
                    <span className="font-mono-tabular font-bold text-amber-300">
                      {alertCase.case_id} · {alertCase.deceased_member_id}
                    </span>
                    <span className="font-semibold text-emerald-300 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {t(lang, '5-Member Audited', '5-सदस्यीय सत्यापित')}
                    </span>
                  </div>

                  {/* Deceased Member Profile Header */}
                  <div className="p-4 border-b border-slate-100 flex items-start gap-3.5">
                    <MemberPortraitSvg
                      portraitId={alertCase.portrait_id}
                      cadre={alertCase.cadre}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
                        {t(
                          lang,
                          `Cadre ${alertCase.cadre}`,
                          `संवर्ग ${alertCase.cadre}`
                        )}{' '}
                        · {alertCase.district}, {alertCase.state}
                      </div>
                      <h3 className="text-base font-extrabold text-slate-900 leading-snug mt-0.5">
                        {alertCase.deceased_name}
                      </h3>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {lang === 'en'
                          ? alertCase.designation.split('·')[0].trim()
                          : alertCase.designation}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-mono-tabular text-slate-500">
                        <span>DOJ: {alertCase.doj}</span>
                        <span>·</span>
                        <span className="text-rose-700 font-semibold">
                          DOD: {alertCase.dod}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Collection Progress */}
                  <div className="px-4 py-3 bg-slate-50/80 border-b border-slate-100">
                    <div className="flex items-baseline justify-between text-xs mb-1.5">
                      <span className="font-semibold text-slate-600">
                        {t(lang, 'Direct Nominee Credit:', 'नॉमिनी खाते में प्राप्त सहयोग:')}
                      </span>
                      <span className="font-mono-tabular font-extrabold text-slate-900 text-sm">
                        {formatINR(alertCase.current_raised)}{' '}
                        <span className="text-slate-400 font-normal">
                          / {formatINR(alertCase.target_estimate)}
                        </span>
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-700 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-600 mt-1.5 font-mono-tabular">
                      <span>
                        <strong>
                          {alertCase.contributors_count.toLocaleString('en-IN')}
                        </strong>{' '}
                        {t(lang, 'members contributed', 'सदस्यों ने सहयोग किया')}
                      </span>
                      <span className="font-bold text-blue-800">
                        ₹{activeAlert.amount_per_case} /{' '}
                        {t(lang, 'member', 'सदस्य')}
                      </span>
                    </div>
                  </div>

                  {/* Verified Legal Nominee Box */}
                  <div className="px-4 py-2.5 border-b border-slate-100 bg-amber-50/40 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-500 font-medium">
                        {t(lang, 'Verified Nominee:', 'सत्यापित नॉमिनी:')}
                      </span>{' '}
                      <strong className="text-slate-900">
                        {alertCase.nominee_name}
                      </strong>
                    </div>
                    <span className="text-[11px] font-semibold text-amber-900">
                      {alertCase.nominee_relation}
                    </span>
                  </div>

                  {/* Dual Bank Account Switcher */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-blue-700" />
                        {t(lang, 'Nominee Bank Credentials', 'नॉमिनी बैंक खाता विवरण')}
                      </span>
                      <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-100 shrink-0">
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
                            className={`px-2.5 py-0.5 text-[11px] font-bold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                              activeBankIdx === idx
                                ? 'bg-blue-800 text-white shadow-2xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            {t(lang, `A/C ${idx + 1}`, `खाता ${idx + 1}`)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Bank Credentials Table */}
                    <div className="bg-slate-50 border border-slate-200/90 rounded-lg p-3 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">
                          {t(lang, 'Bank:', 'बैंक:')}
                        </span>
                        <span className="font-bold text-slate-900 text-right">
                          {currentBank.bank} ({currentBank.branch})
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200/70">
                        <div>
                          <div className="text-[10px] uppercase tracking-wider text-slate-400">
                            {t(lang, 'Account Number', 'खाता संख्या (A/C No.)')}
                          </div>
                          <div className="font-mono-tabular font-extrabold text-sm text-slate-900 tracking-wide">
                            {currentBank.ac}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            handleCopy(currentBank.ac, `${alertCase.case_id}-acc`)
                          }
                          className="px-2.5 py-1.5 rounded-md bg-white hover:bg-blue-50 text-blue-800 border border-slate-200 text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0 shadow-2xs"
                        >
                          {copiedKey === `${alertCase.case_id}-acc` ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700">
                                {t(lang, 'Copied', 'कॉपी हो गया')}
                              </span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>{t(lang, 'Copy A/C', 'A/C कॉपी')}</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200/70">
                        <div>
                          <div className="text-[10px] uppercase tracking-wider text-slate-400">
                            IFSC Code
                          </div>
                          <div className="font-mono-tabular font-bold text-xs text-slate-900">
                            {currentBank.ifsc}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            handleCopy(currentBank.ifsc, `${alertCase.case_id}-ifsc`)
                          }
                          className="px-2.5 py-1 rounded-md bg-white hover:bg-blue-50 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center gap-1 cursor-pointer shrink-0"
                        >
                          {copiedKey === `${alertCase.case_id}-ifsc` ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-700">
                                {t(lang, 'Copied', 'कॉपी')}
                              </span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>{t(lang, 'Copy IFSC', 'IFSC कॉपी')}</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200/70">
                        <div className="truncate">
                          <div className="text-[10px] uppercase tracking-wider text-slate-400">
                            {t(lang, 'Direct Nominee UPI ID', 'सीधी नॉमिनी UPI ID')}
                          </div>
                          <div className="font-mono-tabular font-semibold text-xs text-blue-800 truncate">
                            {currentBank.upi_id}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            handleCopy(currentBank.upi_id, `${alertCase.case_id}-upi`)
                          }
                          className="px-2.5 py-1 rounded-md bg-white hover:bg-blue-50 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center gap-1 cursor-pointer shrink-0"
                        >
                          {copiedKey === `${alertCase.case_id}-upi` ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-700">
                                {t(lang, 'Copied', 'कॉपी')}
                              </span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>UPI</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Toggle BharatQR Button */}
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedQrCase(isQrOpen ? null : alertCase.case_id)
                      }
                      className="w-full py-2 px-3 rounded-lg border border-blue-200 bg-blue-50/70 hover:bg-blue-100/70 text-blue-900 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <QrCode className="w-4 h-4 text-blue-700" />
                      <span>
                        {isQrOpen
                          ? t(
                              lang,
                              'Hide BharatQR / UPI Scanner',
                              'BharatQR / UPI स्कैनर छुपाएं'
                            )
                          : t(
                              lang,
                              `Show BharatQR (Pre-filled ₹${activeAlert.amount_per_case})`,
                              `BharatQR कोड देखें (₹${activeAlert.amount_per_case} ऑटो-फिल्ड)`
                            )}
                      </span>
                    </button>

                    {isQrOpen && (
                      <div className="pt-1">
                        <BharatQrWidget
                          upiId={currentBank.upi_id}
                          payeeName={alertCase.nominee_name}
                          amount={activeAlert.amount_per_case}
                          transactionNote={`PBSCN Sahyog ${alertCase.deceased_member_id}`}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer: Quick Select for Receipt Upload */}
                <div className="px-4 py-3 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-500 truncate">
                    {alertCase.audit_committee_lead}
                  </span>
                  <a
                    href="#receipt-upload-engine"
                    onClick={() => {
                      setSelectedCaseId(alertCase.case_id);
                      setAmountPaid(activeAlert.amount_per_case);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-blue-800 hover:bg-blue-900 text-white text-xs font-bold shrink-0 transition-colors"
                  >
                    {t(lang, 'Upload UTR →', 'UTR अपलोड करें →')}
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: Receipt Upload Engine & Live Audit Log */}
      <div
        id="receipt-upload-engine"
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2"
      >
        {/* Left 5 Cols: Receipt Upload Form */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-lg bg-blue-800 text-white flex items-center justify-center shrink-0">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                {t(
                  lang,
                  'Sahyog Receipt (UTR) Upload Engine',
                  'सहयोग रसीद (UTR) अपलोड इंजन'
                )}
              </h3>
              <p className="text-xs text-slate-500">
                {t(
                  lang,
                  'Link your 12-digit UPI UTR to maintain your 90%+ participation eligibility.',
                  'अपनी 90% सहयोग पात्रता बनाए रखने के लिए 12-अंकों का UPI UTR यहाँ दर्ज करें।'
                )}
              </p>
            </div>
          </div>

          <form onSubmit={handleReceiptSubmit} className="space-y-3.5 mt-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t(lang, 'Select Active Bereavement Case', 'दिवंगत सदस्य का केस चुनें')}
              </label>
              <select
                value={selectedCaseId}
                onChange={(e) => setSelectedCaseId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 focus:border-blue-600 focus:outline-none"
              >
                {cases.map((c) => (
                  <option key={c.case_id} value={c.case_id}>
                    {c.case_id} — {c.deceased_name} ({c.deceased_member_id})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t(lang, 'Your Member ID', 'आपकी Member ID')}
                </label>
                <input
                  type="text"
                  value={donorMemberId}
                  onChange={(e) => setDonorMemberId(e.target.value)}
                  placeholder="PB-2025-XXXXX"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-mono-tabular text-slate-900 focus:border-blue-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t(lang, 'Your Full Name', 'आपका पूरा नाम')}
                </label>
                <input
                  type="text"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t(lang, 'Contribution Amount (₹)', 'सहयोग राशि (₹)')}
                </label>
                <input
                  type="number"
                  min={35}
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-mono-tabular font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t(
                    lang,
                    '12-Digit UPI UTR / Reference *',
                    '12-अंकों का UPI UTR नंबर *'
                  )}
                </label>
                <input
                  type="text"
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  placeholder="e.g. UTR-202610248812"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-mono-tabular font-bold text-slate-900 focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t(
                  lang,
                  'Payment Screenshot Attachment (Optional)',
                  'पेमेंट स्क्रीनशॉट अटैच करें (वैकल्पिक)'
                )}
              </label>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) =>
                  setScreenshotName(e.target.files?.[0]?.name || 'upi_receipt.jpg')
                }
                className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-800 hover:file:bg-blue-100 cursor-pointer"
              />
            </div>

            {formError && (
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-800">
                {formError}
              </div>
            )}

            {uploadSuccess && (
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
                {uploadSuccess}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-lg bg-blue-800 hover:bg-blue-900 text-white text-xs font-extrabold uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
            >
              {t(
                lang,
                'Verify & Log Direct Sahyog Receipt',
                'सहयोग रसीद (UTR) सबमिट व लॉग करें'
              )}
            </button>
          </form>
        </div>

        {/* Right 7 Cols: Live Public Receipt Ledger */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-emerald-700 shrink-0" />
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {t(
                      lang,
                      'Live District Committee Receipt Audit Feed',
                      'लाइव जिला कमेटी रसीद ऑडिट लेजर'
                    )}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {t(
                      lang,
                      'Real-time stream of member UTR submissions verified against nominee bank statements.',
                      'सदस्यों द्वारा अपलोड किए गए UTR का जिला ऑडिट कमेटी द्वारा लाइव मिलान।'
                    )}
                  </p>
                </div>
              </div>

              <select
                value={receiptFilterCase}
                onChange={(e) => setReceiptFilterCase(e.target.value)}
                className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700"
              >
                <option value="ALL">
                  {t(lang, 'All 3 Active Cases', 'तीनों सक्रिय केस')}
                </option>
                {cases.map((c) => (
                  <option key={c.case_id} value={c.case_id}>
                    {c.case_id} ({c.deceased_member_id})
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-2 pr-3">{t(lang, 'Donor Member', 'सहयोगी सदस्य')}</th>
                    <th className="py-2 px-3">{t(lang, 'Case & Amount', 'केस व राशि')}</th>
                    <th className="py-2 px-3">UTR / Ref No.</th>
                    <th className="py-2 pl-3 text-right">
                      {t(lang, 'Audit Status', 'ऑडिट स्थिति')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredReceipts.slice(0, 6).map((rec) => {
                    const matchedCase = cases.find((c) => c.case_id === rec.case_id);
                    return (
                      <tr key={rec.receipt_id} className="hover:bg-slate-50/80">
                        <td className="py-2.5 pr-3">
                          <div className="font-bold text-slate-900">
                            {rec.member_name}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono-tabular">
                            {rec.member_id} · {rec.receipt_id}
                          </div>
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="font-mono-tabular font-extrabold text-blue-800">
                            ₹{rec.amount_paid}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate max-w-[160px]">
                            {matchedCase?.deceased_name || rec.case_id}
                          </div>
                        </td>
                        <td className="py-2.5 px-3 font-mono-tabular">
                          <div className="font-semibold text-slate-800">
                            {rec.utr_number}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {rec.submitted_at.slice(0, 10)}
                          </div>
                        </td>
                        <td className="py-2.5 pl-3 text-right">
                          {rec.verification_status === 'VERIFIED' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              {t(lang, 'Verified', 'सत्यापित')}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700">
                              {t(lang, 'Pending Audit', 'जांच अधीन')}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <span>
              {t(
                lang,
                'Every UTR is cross-verified with the nominee’s bank statement by the 5-member District Physical Audit Committee.',
                'प्रत्येक UTR का मिलान 5-सदस्यीय जिला भौतिक सत्यापन कमेटी द्वारा नॉमिनी के बैंक स्टेटमेंट से किया जाता है।'
              )}
            </span>
            <button
              type="button"
              onClick={() => onNavigateDirectory('ALL')}
              className="text-blue-800 hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>
                {t(lang, 'Inspect Member Passbooks →', 'सदस्य पासबुक देखें →')}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 3: The 4 Swabhiman Cadres Breakdown */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              {t(
                lang,
                'The 4 Swabhiman Cadres (चार स्वाभिमान संवर्ग) — Governance & Solidarity Structure',
                'चार स्वाभिमान संवर्ग (4 Functional Cadres) — संगठनात्मक ढांचा'
              )}
            </h3>
            <p className="text-xs text-slate-500">
              {t(
                lang,
                'Click any cadre to filter verified members in the Public Directory.',
                'किसी भी संवर्ग पर क्लिक करके लाइव मेंबर डायरेक्टरी में उस संवर्ग के सदस्यों की सूची देखें।'
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateDirectory('ALL')}
            className="text-xs font-bold text-blue-800 hover:text-blue-950 flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>{t(lang, 'View All 62,410 Members', 'सभी 62,410 सदस्य देखें')}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FOUR_CADRES.map((cadre) => {
            const roles =
              lang === 'en' ? cadre.rolesIncludedEn : cadre.rolesIncluded;
            return (
              <div
                key={cadre.code}
                onClick={() => onNavigateDirectory(cadre.code)}
                className="group border border-slate-200 hover:border-blue-400 rounded-xl p-4 bg-slate-50/50 hover:bg-white transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-blue-900 text-white text-xs font-extrabold font-mono-tabular">
                      {t(lang, `CADRE ${cadre.code}`, `संवर्ग ${cadre.code}`)}
                    </span>
                    <span className="text-xs font-mono-tabular font-bold text-slate-700">
                      {cadre.membersCount.toLocaleString('en-IN')}{' '}
                      {t(lang, 'Members', 'सदस्य')}
                    </span>
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-blue-800 transition-colors">
                    {lang === 'en' ? cadre.titleEn : cadre.titleHi}
                  </h4>
                  <p className="text-[11px] font-medium text-slate-600 mt-1 leading-relaxed">
                    {lang === 'en' ? cadre.subtitleEn : cadre.subtitleHi}
                  </p>
                  <ul className="mt-2.5 space-y-1 text-[11px] text-slate-600">
                    {roles.map((r) => (
                      <li key={r} className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-blue-700 shrink-0" />
                        <span className="truncate">{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex items-center justify-between text-[11px] font-mono-tabular text-slate-600">
                  <span>
                    {t(lang, 'District Teams:', 'ज़िला कमेटियां:')}{' '}
                    <strong className="text-emerald-700">
                      {cadre.activeDistrictCommittees}
                    </strong>
                  </span>
                  <span className="font-bold text-blue-800 group-hover:translate-x-0.5 transition-transform">
                    →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 4: Interactive Community Voices (CardStack) & 3D Draggable Solidarity Deck */}
      <div
        id="interactive-solidarity-showcase"
        className="grid grid-cols-1 lg:grid-cols-12 gap-6"
      >
        {/* Left 5 Cols: Aceternity CardStack Testimonials */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-blue-800">
              {t(
                lang,
                'Verified Nominee & Mentor Voices · CardStack',
                'सत्यापित नॉमिनी एवं मेंटर्स के अनुभव · CardStack'
              )}
            </div>
            <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
              {t(
                lang,
                'Real Impact Across Bereaved Families & Scholars',
                'दिवंगत परिवारों और छात्रों के जीवन में आया वास्तविक बदलाव'
              )}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {t(
                lang,
                'Direct testimonials from nominee families and Cadre A/C mentors.',
                'सीधे नॉमिनी परिवारों और संवर्ग A/C के वरिष्ठ मेंटर्स की ज़ुबानी।'
              )}
            </p>
          </div>

          <div className="my-auto pt-4">
            <CardStackDemo lang={lang} />
          </div>
        </div>

        {/* Right 7 Cols: Aceternity 3D Draggable Card Deck */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-blue-800">
              {t(
                lang,
                'Interactive 3D Solidarity Deck · Aceternity Draggable Cards',
                'इंटरएक्टिव 3D स्वाभिमान कार्ड डेक · Draggable Cards'
              )}
            </div>
            <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
              {t(
                lang,
                'Explore PBSCN’s 5 Constitutional Pillars in 3D Space',
                'न्यास के 5 संवैधानिक स्तंभों को 3D कार्ड्स के माध्यम से देखें'
              )}
            </h3>
          </div>

          <DraggableCardDemo lang={lang} />
        </div>
      </div>
    </div>
  );
};
