import React, { useState } from 'react';
import {
  Shield,
  Server,
  Scale,
  Users,
  CheckCircle2,
  Copy,
  Check,
  Receipt,
  QrCode,
} from 'lucide-react';
import { isValidUtrNumber } from '../utils/pbscnRules';
import { BharatQrWidget } from './BharatQrWidget';
import { GradientBlobCard } from './ui/gradient-blob-card';
import { LangMode, t } from '../utils/i18n';

interface TrustFundSectionProps {
  lang: LangMode;
}

const TRUST_BANK = {
  accountName: 'Prabuddha Bharat Swabhiman Nyas (PBSCN)',
  bankName: 'State Bank of India (SBI)',
  branch: 'Hazratganj Main Branch, Lucknow',
  accountNumber: '41920837465',
  ifsc: 'SBIN0000125',
  upiId: 'pbscn.trust@sbi',
  registrationNo: 'Regd. under Indian Trusts Act 1882 · UP/LCK/2023-08914',
  taxExemption80G: '12A & 80G Certified Transparent Public Trust Ledger',
};

export const TrustFundSection: React.FC<TrustFundSectionProps> = ({ lang }) => {
  const [selectedTier, setSelectedTier] = useState<51 | 101 | 500>(101);
  const [memberId, setMemberId] = useState('PB-2025-01042');
  const [memberName, setMemberName] = useState(
    lang === 'en' ? 'Er. Milind Gautam' : 'इंजीनियर मिलिंद गौतम'
  );
  const [utr, setUtr] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [receiptGenerated, setReceiptGenerated] = useState<{
    receiptNo: string;
    validFrom: string;
    validUntil: string;
    amount: number;
    utr: string;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleCopy = (val: string, key: string) => {
    navigator.clipboard.writeText(val);
    setCopiedField(key);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSubmitShulk = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!isValidUtrNumber(utr)) {
      setErrorMsg(
        t(
          lang,
          'Please enter a valid 12-digit UPI UTR / Bank Reference number.',
          'कृपया सही 12-अंकों का UPI UTR / बैंक रेफरेंस नंबर दर्ज करें।'
        )
      );
      return;
    }
    setReceiptGenerated({
      receiptNo: `VS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      validFrom: '2026-10-24',
      validUntil: '2027-10-23',
      amount: selectedTier,
      utr: utr.toUpperCase(),
    });
    setUtr('');
  };

  const tiers = [
    {
      amount: 51 as const,
      title: t(lang, 'Grassroots Sahyog Tier (Cadre D)', 'जन सहयोग श्रेणी (संवर्ग D)'),
      desc: t(
        lang,
        'Standard annual maintenance contribution for students, agricultural workers, and grassroots youth.',
        'छात्रों, किसानों, श्रमिकों और सामाजिक कार्यकर्ताओं के लिए वार्षिक पोर्टल शुल्क।'
      ),
    },
    {
      amount: 101 as const,
      title: t(lang, 'Standard Swabhiman Tier (Recommended)', 'स्वाभिमान मानक श्रेणी (अनुशंसित)'),
      desc: t(
        lang,
        'Supports 256-bit cloud database infrastructure, automated BharatQR generators, and district committee audits.',
        'क्लाउड सर्वर सुरक्षा, ऑटोमैटिक भारत क्यूआर जनरेटर और 5-सदस्यीय जिला भौतिक सत्यापन खर्च हेतु।'
      ),
    },
    {
      amount: 500 as const,
      title: t(lang, 'Patron & Intellectual Tier (Cadre A/B/C)', 'संरक्षक प्रबुद्ध श्रेणी (संवर्ग A/B/C)'),
      desc: t(
        lang,
        'Directly strengthens the Ambedkarite Legal Aid Cell and Savitribai Phule Kanyadan Welfare Corpus.',
        'लीगल एड सेल और सावित्रीबाई फुले कन्यादान/शिक्षा फेलोशिप को अतिरिक्त संबल प्रदान करने हेतु।'
      ),
    },
  ];

  const allocationItems = [
    {
      icon: Server,
      percent: '35%',
      title: t(lang, 'Cloud Infrastructure & Encryption', 'क्लाउड सर्वर एवं एन्क्रिप्शन'),
      desc: t(
        lang,
        'High-availability database hosting, automated BharatQR generation & real-time SMS/WhatsApp alert dispatches.',
        'हाई-स्पीड डेटाबेस होस्टिंग, ऑटोमैटिक BharatQR जनरेटर और आपातकालीन SMS/WhatsApp अलर्ट सिस्टम।'
      ),
    },
    {
      icon: Users,
      percent: '40%',
      title: t(
        lang,
        '48-Hour District Physical Audits',
        '48-घंटे में जिला भौतिक सत्यापन'
      ),
      desc: t(
        lang,
        'Fuel, travel, and documentation stipends for 5-member district committees conducting ground verification.',
        'दिवंगत साथी के घर जाकर नॉमिनी के वैध बैंक खातों का मौके पर सत्यापन करने वाली 5-सदस्यीय जिला कमेटी का खर्च।'
      ),
    },
    {
      icon: Scale,
      percent: '15%',
      title: t(
        lang,
        'Legal Protection & Audit Registry',
        'विधिक सुरक्षा एवं ऑडिट रजिस्ट्री'
      ),
      desc: t(
        lang,
        'Advocate retainer for trust deed compliance, annual CA audits, and 80G tax certification filing.',
        'वार्षिक चार्टर्ड अकाउंटेंट (CA) ऑडिट, 12A/80G इनकम टैक्स सर्टिफिकेशन और ट्रस्ट डीड की कानूनी सुरक्षा।'
      ),
    },
    {
      icon: Shield,
      percent: '10%',
      title: t(
        lang,
        'Emergency Mutual Aid Reserve',
        'आपातकालीन रिज़र्व फंड'
      ),
      desc: t(
        lang,
        'Immediate transit assistance for bereaved families before standard alert contributions complete.',
        'सहयोग राशि एकत्र होने से पूर्व दिवंगत परिवार को फौरी राहत देने के लिए आपातकालीन रिज़र्व फंड।'
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Sovereign Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
            {t(lang, 'Annual Portal Maintenance Fund', 'वार्षिक पोर्टल व्यवस्था शुल्क')}
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            {t(
              lang,
              'Transparent Portal Maintenance (₹51 / ₹101 / ₹500)',
              'पारदर्शी व्यवस्था शुल्क (₹51 / ₹101 / ₹500)'
            )}
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            {t(
              lang,
              'PBSCN takes 0.00% commission from bereavement contributions. The portal, server security, and ground physical audits are sustained entirely through this transparent annual fee.',
              'दिवंगत साथी की सहयोग राशि में से ट्रस्ट 1 रुपया भी नहीं काटता। पोर्टल सर्वर का खर्च, 256-बिट सुरक्षा और जिला सत्यापन कमेटियों की व्यवस्था इसी नाममात्र वार्षिक शुल्क से चलती है।'
            )}
          </p>
        </div>
      </div>

      {/* Tier Selector with Animated Gradient Blob Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
        {tiers.map((tier, idx) => {
          const gradients = [
            "bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-400",
            "bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500",
            "bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400",
          ];
          const isSelected = selectedTier === tier.amount;

          return (
            <GradientBlobCard
              key={tier.amount}
              width="w-full max-w-[340px]"
              height="h-[270px]"
              blobGradient={gradients[idx % gradients.length]}
              onClick={() => setSelectedTier(tier.amount)}
              cardClassName={isSelected ? "ring-2 ring-amber-400 scale-[1.02]" : ""}
            >
              <div className="flex flex-col justify-between h-full w-full py-1">
                <div className="flex items-center justify-between w-full">
                  <span className="text-2xl font-black text-stone-900 dark:text-white font-mono-tabular">
                    ₹{tier.amount}
                    <span className="text-xs font-normal text-stone-500 dark:text-stone-400">
                      {' '}
                      / {t(lang, 'year', 'वर्ष')}
                    </span>
                  </span>
                  {isSelected ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-stone-950 shadow-xs">
                      {t(lang, 'Selected', 'चयनित')}
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-stone-400 dark:text-stone-500">
                      {t(lang, 'Click to choose', 'चुनने के लिए क्लिक करें')}
                    </span>
                  )}
                </div>

                <div className="text-left my-auto space-y-1.5">
                  <h4 className="text-xs sm:text-sm font-extrabold text-amber-700 dark:text-amber-300">
                    {tier.title}
                  </h4>
                  <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
                    {tier.desc}
                  </p>
                </div>

                <div className="w-full pt-2 border-t border-stone-200/60 dark:border-white/10 flex items-center justify-between text-[10px] font-bold text-stone-500 dark:text-stone-400">
                  <span>PBSCN Trust Transparency</span>
                  <span className="text-amber-600 dark:text-amber-400">100% Direct</span>
                </div>
              </div>
            </GradientBlobCard>
          );
        })}
      </div>

      {/* Official State Bank of India Trust Account Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-400" />
              <span>{t(lang, 'Official SBI Trust Account', 'आधिकारिक एसबीआई ट्रस्ट खाता')}</span>
            </h3>
            <span className="text-[11px] font-mono-tabular text-emerald-400 font-bold">
              12A & 80G Certified
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block mb-0.5">{t(lang, 'Beneficiary Name:', 'खाताधारक का नाम:')}</span>
              <span className="font-extrabold text-white">{TRUST_BANK.accountName}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block mb-0.5">{t(lang, 'Bank & Branch:', 'बैंक व शाखा:')}</span>
              <span className="font-extrabold text-white">{TRUST_BANK.bankName} · {TRUST_BANK.branch}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-slate-400 block mb-0.5">{t(lang, 'Account Number:', 'खाता संख्या:')}</span>
                <span className="font-mono-tabular font-extrabold text-amber-300 text-sm">
                  {TRUST_BANK.accountNumber}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(TRUST_BANK.accountNumber, 'trust-ac')}
                className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                {copiedField === 'trust-ac' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-slate-400 block mb-0.5">IFSC Code:</span>
                <span className="font-mono-tabular font-extrabold text-white text-sm">
                  {TRUST_BANK.ifsc}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(TRUST_BANK.ifsc, 'trust-ifsc')}
                className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                {copiedField === 'trust-ifsc' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Form to submit annual fee UTR */}
          <form onSubmit={handleSubmitShulk} className="pt-2 space-y-3 text-xs">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950 border border-rose-500/40 text-rose-200">
                {errorMsg}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  {t(lang, 'Your Member ID *', 'आपकी सदस्य संख्या (Member ID) *')}
                </label>
                <input
                  type="text"
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white font-mono-tabular font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  {t(lang, '12-Digit UPI UTR *', '12 अंकों का UTR नंबर *')}
                </label>
                <input
                  type="text"
                  value={utr}
                  onChange={(e) => setUtr(e.target.value)}
                  placeholder="e.g. 429104829103"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-amber-300 font-mono-tabular font-bold"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold transition-all cursor-pointer shadow-md"
            >
              {t(
                lang,
                `Confirm ₹${selectedTier} Trust Fee Payment`,
                `₹${selectedTier} वार्षिक व्यवस्था शुल्क रसीद जारी करें`
              )}
            </button>
          </form>

          {receiptGenerated && (
            <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-xs space-y-2">
              <div className="flex items-center gap-2 text-emerald-300 font-extrabold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{t(lang, 'Annual Maintenance Certified', 'वार्षिक व्यवस्था शुल्क सत्यापित')}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-slate-300 font-mono-tabular">
                <div>Receipt: <strong className="text-white">{receiptGenerated.receiptNo}</strong></div>
                <div>Amount: <strong className="text-white">₹{receiptGenerated.amount}</strong></div>
                <div>Valid Until: <strong className="text-emerald-300">{receiptGenerated.validUntil}</strong></div>
                <div>UTR: <strong className="text-amber-300">{receiptGenerated.utr}</strong></div>
              </div>
            </div>
          )}
        </div>

        {/* Right 5 Cols: Transparency Allocation Breakdown */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-extrabold text-white">
            {t(lang, 'Where Every Rupee Goes', 'शुल्क का 100% पारदर्शी विभाजन')}
          </h3>

          <div className="space-y-3">
            {allocationItems.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 font-bold text-white">
                      <IconComp className="w-4 h-4 text-amber-400" />
                      <span>{item.title}</span>
                    </div>
                    <span className="font-mono-tabular font-extrabold text-amber-300">
                      {item.percent}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
