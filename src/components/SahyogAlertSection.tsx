import React, { useState } from 'react';
import {
  Copy,
  Check,
  Upload,
  ShieldCheck,
  Building2,
  QrCode,
  FileCheck2,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  Star,
  ExternalLink,
  HeartHandshake,
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
import { GradientBlobCard } from './ui/gradient-blob-card';
import { LangMode, t } from '../utils/i18n';

interface SahyogAlertSectionProps {
  alerts: SahyogAlert[];
  receipts: ContributionReceipt[];
  onUploadReceipt: (newReceipt: ContributionReceipt) => void;
  onNavigateDirectory: (cadreFilter?: 'ALL' | CadreCode) => void;
  onOpenJoinModal?: () => void;
  lang: LangMode;
}

/**
 * Artisanal portrait medallion on warm alabaster/cream with soft inset depth
 */
function MemberPortraitSvg({
  portraitId,
  cadre,
}: {
  portraitId: 'surendra' | 'ramprakash' | 'anita';
  cadre: CadreCode;
}) {
  const bgMap: Record<CadreCode, string> = {
    A: '#B45309', // warm amber
    B: '#059669', // emerald
    C: '#7C3AED', // royal purple
    D: '#D97706', // gold
  };
  const initialsMap = {
    surendra: 'SKG',
    ramprakash: 'RPA',
    anita: 'AS',
  };
  const accent = bgMap[cadre];
  const isFemale = portraitId === 'anita';

  return (
    <div className="relative shrink-0 group-hover:scale-105 transition-transform duration-500">
      <div className="w-16 h-16 rounded-2xl p-1 bg-[#F5F1E8] shadow-[inset_3px_3px_6px_rgba(0,0,0,0.08),inset_-3px_-3px_6px_rgba(255,255,255,0.9)] border border-[#E5DFD3] flex items-center justify-center">
        <svg
          viewBox="0 0 88 88"
          className="w-full h-full rounded-xl"
          role="img"
          aria-label={`Portrait ${initialsMap[portraitId]}`}
        >
          <rect width="88" height="88" rx="10" fill="#FAF7F0" />
          <circle
            cx="44"
            cy="44"
            r="38"
            fill={accent}
            fillOpacity="0.12"
            stroke={accent}
            strokeWidth="1.5"
            strokeDasharray="3 2"
          />
          {isFemale ? (
            <>
              <path
                d="M22 78 C22 58 66 58 66 78"
                fill={accent}
                fillOpacity="0.28"
                stroke={accent}
                strokeWidth="2"
              />
              <circle
                cx="44"
                cy="34"
                r="14"
                fill={accent}
                fillOpacity="0.22"
                stroke={accent}
                strokeWidth="2"
              />
            </>
          ) : (
            <>
              <path
                d="M20 78 C20 56 68 56 68 78"
                fill={accent}
                fillOpacity="0.25"
                stroke={accent}
                strokeWidth="2"
              />
              <circle
                cx="44"
                cy="33"
                r="14"
                fill={accent}
                fillOpacity="0.22"
                stroke={accent}
                strokeWidth="2"
              />
            </>
          )}
          <rect x="20" y="60" width="48" height="18" rx="6" fill={accent} />
          <text
            x="44"
            y="73"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="10"
            fontWeight="bold"
            letterSpacing="1"
            fontFamily="monospace"
          >
            {initialsMap[portraitId]}
          </text>
        </svg>
      </div>
      {/* Outer subtle amber glow ring on hover */}
      <div className="absolute inset-0 rounded-2xl border-2 border-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </div>
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
  const activeAlert = alerts[0];
  const cases = activeAlert?.cases || [];

  const [selectedBankTab, setSelectedBankTab] = useState<{
    [caseId: string]: number;
  }>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [expandedQrCase, setExpandedQrCase] = useState<string | null>(null);

  // UTR Submission Form State
  const [selectedCaseId, setSelectedCaseId] = useState<string>(
    cases[0]?.case_id || ''
  );
  const [donorMemberId, setDonorMemberId] = useState<string>('');
  const [donorName, setDonorName] = useState<string>('');
  const [utrNumber, setUtrNumber] = useState<string>('');
  const [screenshotName, setScreenshotName] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  // Public Transparency Filter
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
          'Please enter your Member ID and Full Name.',
          'कृपया अपना सदस्य आईडी (Member ID) और पूरा नाम दर्ज करें।'
        )
      );
      return;
    }

    if (!isValidUtrNumber(utrNumber.trim())) {
      setFormError(
        t(
          lang,
          'Invalid Bank UTR / Reference Number. It must be between 8 and 22 alphanumeric characters.',
          'अमान्य बैंक यूटीआर (UTR) संख्या। कृपया बैंक या UPI रसीद से 8 से 22 अंकों का वैध संदर्भ क्रमांक दर्ज करें।'
        )
      );
      return;
    }

    const activeCase =
      cases.find((c) => c.case_id === selectedCaseId) || cases[0];
    const amountPaid = activeAlert.amount_per_case;

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
      {/* SECTION 1: Active Sahyog Alert #09 Banner (Cream-White / Warm-Gray Alabaster) */}
      <div className="relative overflow-hidden rounded-3xl bg-[#FCFAF7] border border-[#E7E2DA] p-6 sm:p-8 shadow-[10px_10px_25px_rgba(0,0,0,0.05),-8px_-8px_20px_rgba(255,255,255,0.9)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-amber-400 text-stone-950 font-mono-tabular shadow-xs">
                {t(
                  lang,
                  `ACTIVE APPEAL #0${activeAlert.alert_number}`,
                  `सक्रिय सहयोग अपील #0${activeAlert.alert_number}`
                )}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 border border-stone-200">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                {t(
                  lang,
                  `Window: ${activeAlert.start_date} to ${activeAlert.end_date}`,
                  `अवधि: ${activeAlert.start_date} से ${activeAlert.end_date}`
                )}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                {t(lang, 'Live Mutual Aid', 'लाइव जन-सहयोग')}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
              {t(
                lang,
                'Emergency Sahyog Alert — 3 Verified Bereavement Cases',
                'आपातकालीन सहयोग अपील — 3 भौतिक सत्यापित दिवंगत केस'
              )}
            </h2>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-medium">
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
              className="px-5 py-3 rounded-2xl text-xs font-extrabold bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 transition-all shadow-[4px_4px_12px_rgba(245,158,11,0.25)] hover:shadow-[6px_6px_16px_rgba(245,158,11,0.35)] active:scale-95 text-center cursor-pointer flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4 text-stone-950" />
              <span>{t(lang, 'Submit UTR Receipt', 'सहयोग रसीद दर्ज करें')}</span>
            </a>
          </div>
        </div>
      </div>

      {/* SECTION 2: The 3 Bereavement Case Cards (Refined Cream-White / Alabaster Neumorphic Aesthetic) */}
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
              className="group relative overflow-hidden rounded-3xl bg-[#FCFAF7] border border-[#E7E2DA] p-6 shadow-[10px_10px_25px_rgba(0,0,0,0.06),-8px_-8px_20px_rgba(255,255,255,0.95)] hover:shadow-[18px_18px_40px_rgba(0,0,0,0.1),-10px_-10px_30px_rgba(255,255,255,1)] hover:-translate-y-2 hover:scale-[1.015] transition-all duration-500 flex flex-col justify-between"
            >
              <div>
                {/* Top Dossier Bar: Case ID & Live Verified Badge */}
                <div className="flex items-center justify-between pb-3 border-b border-[#ECE7DE]">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-stone-700 font-mono-tabular font-extrabold text-[11px] shadow-[2px_2px_4px_rgba(0,0,0,0.03),-2px_-2px_4px_rgba(255,255,255,0.9)]">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>{alertCase.case_id}</span>
                    <span className="text-stone-400">·</span>
                    <span className="text-stone-500">{alertCase.deceased_member_id}</span>
                  </div>

                  {/* Pulsing Live Audit Beacon */}
                  <div className="flex items-center gap-2">
                    <div className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                    </div>
                    <div className="rounded-full bg-amber-100 p-1 text-amber-800 border border-amber-300 shadow-2xs group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" title="5-Member Physical Verification Team Approved">
                      <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                    </div>
                  </div>
                </div>

                {/* Profile & Portrait Section */}
                <div className="pt-4 pb-3 flex items-start gap-4">
                  <MemberPortraitSvg
                    portraitId={alertCase.portrait_id}
                    cadre={alertCase.cadre}
                  />

                  <div className="min-w-0 flex-1">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-stone-100 text-stone-700 border border-stone-200/80 shadow-2xs">
                      {cadreTitle}
                    </span>

                    <h3 className="text-base sm:text-lg font-extrabold text-stone-900 group-hover:text-amber-800 transition-colors mt-1">
                      {alertCase.deceased_name}
                    </h3>

                    <p className="text-xs text-stone-600 mt-0.5 leading-snug font-medium">
                      {designationText}
                    </p>

                    <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px] font-mono-tabular">
                      <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 border border-stone-200/60">
                        {t(lang, 'Joined:', 'सदस्यता:')} {alertCase.doj}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200/70 font-semibold">
                        {t(lang, 'Demise:', 'निधन:')} {alertCase.dod}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Tracker & Raised Amount (Sculpted Cream Inset) */}
                <div className="my-3 p-4 rounded-2xl bg-[#F6F3EC] border border-[#ECE7DE] shadow-[inset_2px_2px_6px_rgba(0,0,0,0.03)] space-y-2.5">
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="font-semibold text-stone-600">
                      {t(lang, 'Direct Nominee Credit:', 'नॉमिनी खाते में कुल जमा:')}
                    </span>
                    <span className="font-mono-tabular font-extrabold text-stone-900 text-sm sm:text-base">
                      {formatINR(alertCase.current_raised)}{' '}
                      <span className="text-stone-400 font-normal text-xs">
                        / {formatINR(alertCase.target_estimate)}
                      </span>
                    </span>
                  </div>

                  {/* Progress Bar with Soft Inset Glow */}
                  <div className="w-full h-3 bg-[#E5DFD5] rounded-full overflow-hidden p-0.5 shadow-inner">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-500 rounded-full transition-all duration-700 shadow-xs"
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono-tabular">
                    <span className="text-stone-600">
                      <strong className="text-emerald-700 font-extrabold">
                        {alertCase.contributors_count.toLocaleString('en-IN')}
                      </strong>{' '}
                      {t(lang, 'members sent aid', 'साथियों ने सहयोग भेजा')}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-extrabold border border-amber-200">
                      ₹{activeAlert.amount_per_case} / {t(lang, 'member', 'सदस्य')}
                    </span>
                  </div>
                </div>

                {/* Legal Nominee Info */}
                <div className="px-3.5 py-2.5 rounded-xl bg-white border border-[#E7E2DA] flex items-center justify-between text-xs shadow-[2px_2px_6px_rgba(0,0,0,0.02)] mb-3">
                  <div>
                    <span className="text-stone-500 font-medium">
                      {t(lang, 'Legal Nominee:', 'वैध नॉमिनी:')}
                    </span>{' '}
                    <strong className="text-stone-900 font-bold">
                      {alertCase.nominee_name}
                    </strong>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-stone-100 text-stone-700 border border-stone-200">
                    {alertCase.nominee_relation}
                  </span>
                </div>

                {/* Nominee Bank Credentials & One-Click Copy */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-amber-600" />
                      {t(lang, 'Nominee Bank Credentials', 'नॉमिनी बैंक खाता विवरण')}
                    </span>

                    {/* Multi-bank Switcher */}
                    <div className="inline-flex rounded-xl border border-stone-200 p-0.5 bg-stone-100">
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
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${
                            activeBankIdx === idx
                              ? 'bg-white text-stone-900 shadow-xs'
                              : 'text-stone-500 hover:text-stone-900'
                          }`}
                        >
                          {idx === 0
                            ? t(lang, 'Primary A/C', 'मुख्य खाता')
                            : t(lang, 'Alt A/C', 'वैकल्पिक खाता')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tactile Bank Details Card */}
                  <div className="p-3.5 rounded-2xl bg-white border border-[#E7E2DA] space-y-2 text-xs shadow-[2px_2px_8px_rgba(0,0,0,0.02)]">
                    <div className="flex items-center justify-between">
                      <span className="text-stone-500 font-medium">{t(lang, 'Bank Name:', 'बैंक:')}</span>
                      <span className="font-extrabold text-stone-900 text-right">
                        {currentBank.bank}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-stone-500 font-medium">{t(lang, 'Account No:', 'खाता संख्या:')}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono-tabular font-extrabold text-stone-900 text-sm">
                          {currentBank.ac}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(currentBank.ac, `ac-${alertCase.case_id}`)}
                          className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-950 transition-all cursor-pointer"
                          title="Copy Account Number"
                        >
                          {copiedKey === `ac-${alertCase.case_id}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-stone-500 font-medium">IFSC:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono-tabular font-extrabold text-stone-900">
                          {currentBank.ifsc}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(currentBank.ifsc, `ifsc-${alertCase.case_id}`)}
                          className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-950 transition-all cursor-pointer"
                          title="Copy IFSC"
                        >
                          {copiedKey === `ifsc-${alertCase.case_id}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* QR Code Action Toggle */}
                <div className="mt-4 pt-2">
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedQrCase(isQrOpen ? null : alertCase.case_id)
                    }
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-b from-[#FFFDF9] to-[#F5F2EA] hover:from-[#FAF6ED] hover:to-[#EDE8DC] text-stone-900 font-extrabold text-xs border border-[#D9D3C7] shadow-[4px_4px_10px_rgba(0,0,0,0.04),-3px_-3px_8px_rgba(255,255,255,0.95)] hover:shadow-[6px_6px_14px_rgba(0,0,0,0.07),-4px_-4px_10px_rgba(255,255,255,1)] hover:scale-[1.01] active:scale-98 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <QrCode className="w-4 h-4 text-amber-600" />
                    <span>
                      {isQrOpen
                        ? t(lang, 'Hide BharatQR', 'क्यूआर कोड छिपाएं')
                        : t(lang, 'Show BharatQR (Scan & Pay ₹35)', 'भारत क्यूआर कोड देखें (स्कैन करें)')}
                    </span>
                  </button>

                  {/* BharatQR Widget Modal Display */}
                  {isQrOpen && (
                    <div className="mt-3 p-4 rounded-2xl bg-white border border-[#E7E2DA] shadow-[inset_2px_2px_6px_rgba(0,0,0,0.03)]">
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

              {/* Animated subtle border on hover */}
              <div className="absolute inset-0 rounded-3xl border border-amber-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </article>
          );
        })}
      </div>

      {/* SECTION 3: UTR Receipt Verification Engine (Cream-White / Warm-Gray Card) */}
      <div
        id="receipt-upload-engine"
        className="rounded-3xl bg-[#FCFAF7] border border-[#E7E2DA] p-6 sm:p-8 shadow-[10px_10px_25px_rgba(0,0,0,0.05),-8px_-8px_20px_rgba(255,255,255,0.9)]"
      >
        <div className="flex items-center gap-3 border-b border-[#ECE7DE] pb-4 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 shrink-0 shadow-xs">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-stone-900">
              {t(
                lang,
                'Sahyog UTR Verification & Receipt Submission',
                'सहयोग यूटीआर सत्यापन एवं रसीद पंजीकरण'
              )}
            </h3>
            <p className="text-xs text-stone-600 font-medium">
              {t(
                lang,
                'Submit your 12-digit Bank/UPI reference number to certify your mandatory 90% participation rule.',
                'संविधान के 90% अनिवार्य सहयोग नियम की पात्रता बनाए रखने के लिए बैंक का 12 अंकों का संदर्भ क्रमांक (UTR) दर्ज करें।'
              )}
            </p>
          </div>
        </div>

        {uploadSuccess && (
          <div className="mb-5 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-semibold">{uploadSuccess}</span>
          </div>
        )}

        {formError && (
          <div className="mb-5 p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 text-xs font-semibold">
            {formError}
          </div>
        )}

        <form onSubmit={handleReceiptSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block font-bold text-stone-700 mb-1.5">
                {t(lang, 'Case ID *', 'सहयोग केस चुनें *')}
              </label>
              <select
                value={selectedCaseId}
                onChange={(e) => setSelectedCaseId(e.target.value)}
                className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 font-bold text-stone-900 shadow-2xs focus:border-amber-500 focus:outline-none"
              >
                {cases.map((c) => (
                  <option key={c.case_id} value={c.case_id}>
                    {c.case_id} — {c.deceased_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1.5">
                {t(lang, 'Your Member ID *', 'आपकी सदस्य संख्या (Member ID) *')}
              </label>
              <input
                type="text"
                value={donorMemberId}
                onChange={(e) => setDonorMemberId(e.target.value)}
                placeholder="e.g. PB-2025-01042"
                className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 font-mono-tabular font-bold text-stone-900 placeholder:text-stone-400 shadow-2xs focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1.5">
                {t(lang, 'Your Full Name *', 'आपका पूरा नाम *')}
              </label>
              <input
                type="text"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                placeholder="e.g. Dr. Siddharth Gautam"
                className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 font-bold text-stone-900 placeholder:text-stone-400 shadow-2xs focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1.5">
                {t(lang, '12-Digit UPI UTR / Ref No. *', '12 अंकों का UTR / बैंक संदर्भ क्रमांक *')}
              </label>
              <input
                type="text"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                placeholder="e.g. 429182948210"
                maxLength={24}
                className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 font-mono-tabular font-extrabold text-stone-900 placeholder:text-stone-400 shadow-2xs focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="text-[11px] text-stone-600 font-medium">
              {t(
                lang,
                'Amount: ₹35 per case · All transfers are verified against direct nominee bank statements.',
                'सहयोग राशि: ₹35 प्रति केस · सभी यूटीआर का भौतिक मिलान नॉमिनी के बैंक स्टेटमेंट से किया जाता है।'
              )}
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 text-xs font-extrabold transition-all shadow-[4px_4px_12px_rgba(245,158,11,0.25)] hover:shadow-[6px_6px_16px_rgba(245,158,11,0.35)] active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4 text-stone-950" />
              <span>{t(lang, 'Submit Receipt to Ledger', 'रसीद दर्ज करें')}</span>
            </button>
          </div>
        </form>
      </div>

      {/* SECTION 4: The 4 Swabhiman Cadres Overview (Cream-White / Warm-Gray Cards) */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-extrabold text-stone-900">
            {t(
              lang,
              'The 4 Swabhiman Cadres of Prabuddha Bharat',
              'प्रबुद्ध भारत के 4 स्वाभिमान संवर्ग'
            )}
          </h3>
          <p className="text-xs text-stone-600 font-medium">
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
              className="p-5 rounded-3xl bg-[#FCFAF7] border border-[#E7E2DA] shadow-[6px_6px_16px_rgba(0,0,0,0.04),-4px_-4px_12px_rgba(255,255,255,0.9)] hover:shadow-[10px_10px_22px_rgba(0,0,0,0.07)] hover:-translate-y-1 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-300 text-amber-900 font-extrabold text-xs flex items-center justify-center shadow-2xs">
                    {cadre.code}
                  </span>
                  <span className="text-xs font-mono-tabular font-bold text-stone-600">
                    {cadre.membersCount.toLocaleString('en-IN')} {t(lang, 'members', 'सदस्य')}
                  </span>
                </div>

                <h4 className="text-sm font-extrabold text-stone-900">
                  {lang === 'en' ? cadre.titleEn : cadre.titleHi}
                </h4>

                <p className="text-xs text-stone-600 leading-relaxed font-medium">
                  {lang === 'en' ? cadre.subtitleEn : cadre.subtitleHi}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#ECE7DE] flex items-center justify-between text-xs text-stone-600">
                <span>{t(lang, 'District Committees:', 'जिला कमेटियां:')} {cadre.activeDistrictCommittees}</span>
                <button
                  type="button"
                  onClick={() => onNavigateDirectory(cadre.code)}
                  className="font-extrabold text-amber-700 hover:text-amber-800 cursor-pointer"
                >
                  {t(lang, 'View →', 'देखें →')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4.5: Animated Gradient Blob Holographic Impact Cards */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-extrabold text-stone-900">
            {t(
              lang,
              'Holographic Pillars of Self-Respect (Swabhiman)',
              'स्वाभिमान के 3 जीवंत संवैधानिक स्तंभ'
            )}
          </h3>
          <p className="text-xs text-stone-600 font-medium">
            {t(
              lang,
              'Interactive animated gradient glass cards showcasing the core pillars of Prabuddha Bharat.',
              'एनिमेटेड ग्रेडिएंट ब्लब ग्लास कार्ड्स जो प्रबुद्ध भारत के मूल सिद्धांतों को दर्शाते हैं।'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 justify-items-center">
          <GradientBlobCard
            width="w-full max-w-[280px]"
            height="h-[250px]"
            blobGradient="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500"
          >
            <div className="flex flex-col items-center justify-between h-full py-2">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800 shadow-xs mb-2">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div className="text-2xl font-black font-mono-tabular text-stone-900">
                ₹35 / {t(lang, 'Case', 'केस')}
              </div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-amber-700 mt-1">
                {t(lang, 'Direct P2P Aid', '100% सीधा जन-सहयोग')}
              </div>
              <p className="text-[11px] text-stone-600 mt-1 font-medium leading-tight">
                {t(
                  lang,
                  'Zero middleman deduction. 100% transferred to legal nominee account.',
                  'बिना किसी कटौती के शत-प्रतिशत राशि सीधे नॉमिनी के खाते में।'
                )}
              </p>
            </div>
          </GradientBlobCard>

          <GradientBlobCard
            width="w-full max-w-[280px]"
            height="h-[250px]"
            blobGradient="bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-400"
          >
            <div className="flex flex-col items-center justify-between h-full py-2">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-800 shadow-xs mb-2">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-2xl font-black font-mono-tabular text-stone-900">
                62,410+
              </div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 mt-1">
                {t(lang, 'Verified Members', 'सत्यापित सदस्य संख्या')}
              </div>
              <p className="text-[11px] text-stone-600 mt-1 font-medium leading-tight">
                {t(
                  lang,
                  'Organised across 75 Uttar Pradesh districts and 4 cadres.',
                  'उत्तर प्रदेश के 75 जिलों और 4 संवर्गों में संगठित जन-शक्ति।'
                )}
              </p>
            </div>
          </GradientBlobCard>

          <GradientBlobCard
            width="w-full max-w-[280px]"
            height="h-[250px]"
            blobGradient="bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400"
          >
            <div className="flex flex-col items-center justify-between h-full py-2">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-900 shadow-xs mb-2">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-2xl font-black font-mono-tabular text-stone-900">
                ₹28.45 Cr
              </div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-amber-800 mt-1">
                {t(lang, 'Solidarity Delivered', 'कुल वितरित सहायता')}
              </div>
              <p className="text-[11px] text-stone-600 mt-1 font-medium leading-tight">
                {t(
                  lang,
                  '114 bereaved families supported with dignity and transparency.',
                  '114 दिवंगत परिवारों को स्वाभिमानपूर्वक आर्थिक संबल प्रदान किया।'
                )}
              </p>
            </div>
          </GradientBlobCard>
        </div>
      </div>

      {/* SECTION 5: Interactive Solidarity Showcase (CardStack & 3D Cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-[#FCFAF7] border border-[#E7E2DA] rounded-3xl p-6 shadow-[10px_10px_25px_rgba(0,0,0,0.05),-8px_-8px_20px_rgba(255,255,255,0.9)] flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
              {t(
                lang,
                'Verified Nominee Testimonials · CardStack',
                'सत्यापित नॉमिनी परिवारों के अनुभव · CardStack'
              )}
            </div>
            <h3 className="text-base font-extrabold text-stone-900 mt-0.5">
              {t(
                lang,
                'Direct Impact on Bereaved Families',
                'दिवंगत परिवारों को मिला सीधा संबल'
              )}
            </h3>
            <p className="text-xs text-stone-600 mt-1 font-medium">
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

        <div className="lg:col-span-7 bg-[#FCFAF7] border border-[#E7E2DA] rounded-3xl p-6 shadow-[10px_10px_25px_rgba(0,0,0,0.05),-8px_-8px_20px_rgba(255,255,255,0.9)] space-y-3">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
              {t(
                lang,
                'Interactive 3D Solidarity Deck · Draggable Cards',
                '3D स्वाभिमान कार्ड डेक · Draggable Cards'
              )}
            </div>
            <h3 className="text-base font-extrabold text-stone-900 mt-0.5">
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
