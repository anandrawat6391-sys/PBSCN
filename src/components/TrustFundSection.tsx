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
} from 'lucide-react';
import { isValidUtrNumber } from '../utils/pbscnRules';
import { BharatQrWidget } from './BharatQrWidget';
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
  const [memberName, setMemberName] = useState('Er. Milind Gautam');
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
          'Please enter a valid 12-digit UPI UTR / Bank Reference number (8–28 chars).',
          'कृपया सही 12-अंकों का UPI UTR / बैंक रेफरेंस नंबर दर्ज करें।'
        )
      );
      return;
    }
    setReceiptGenerated({
      receiptNo: `VS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      validFrom: '2026-10-23',
      validUntil: '2027-10-22',
      amount: selectedTier,
      utr: utr.toUpperCase(),
    });
    setUtr('');
  };

  const tiers = [
    {
      amount: 51 as const,
      title: t(lang, 'Grassroots Sahyog Tier', 'जन सहयोग श्रेणी (Cadre D)'),
      desc: t(
        lang,
        'Standard annual digital maintenance fee for students, workers, farmers & youth.',
        'छात्रों, किसानों, श्रमिकों और सामाजिक कार्यकर्ताओं के लिए वार्षिक पोर्टल शुल्क।'
      ),
    },
    {
      amount: 101 as const,
      title: t(lang, 'Standard Swabhiman Tier', 'स्वाभिमान मानक श्रेणी (Recommended)'),
      desc: t(
        lang,
        'Supports 256-bit cloud server security, SMS alert gateway & district audit logistics.',
        'क्लाउड सर्वर सुरक्षा, SMS अलर्ट और 5-सदस्यीय जिला भौतिक सत्यापन यात्रा खर्च हेतु।'
      ),
    },
    {
      amount: 500 as const,
      title: t(lang, 'Patron & Intellectual Tier', 'प्रबुद्ध संरक्षक श्रेणी (Cadre A/B/C)'),
      desc: t(
        lang,
        'Additionally supports the Ambedkarite Legal Aid Cell & Kanyadan/Education Corpus.',
        'लीगल एड सेल और सावित्रीबाई फुले कन्यादान/शिक्षा फेलोशिप को अतिरिक्त संबल प्रदान करने हेतु।'
      ),
    },
  ];

  const allocationItems = [
    {
      icon: Server,
      percent: '35%',
      title: t(lang, 'Cloud Servers & 256-Bit Security', 'क्लाउड सर्वर एवं 256-बिट एन्क्रिप्शन'),
      desc: t(
        lang,
        'High-availability database hosting, automated BharatQR generation & SMS/WhatsApp alert dispatches.',
        'हाई-स्पीड डेटाबेस होस्टिंग, ऑटोमैटिक BharatQR जनरेटर और आपातकालीन SMS/WhatsApp अलर्ट सिस्टम।'
      ),
    },
    {
      icon: Users,
      percent: '40%',
      title: t(
        lang,
        '5-Member District Physical Audit Teams',
        '5-सदस्यीय जिला भौतिक सत्यापन कमेटी'
      ),
      desc: t(
        lang,
        'On-ground travel & verification of death certificates and legal nominee bank accounts within 48 hours.',
        'दिवंगत सदस्य के घर जाकर 48 घंटे के भीतर मृत्यु प्रमाण पत्र और नॉमिनी के बैंक खातों का भौतिक सत्यापन।'
      ),
    },
    {
      icon: Scale,
      percent: '25%',
      title: t(
        lang,
        'Free Legal Aid & Statutory Audit Cell',
        'निःशुल्क विधिक सहायता एवं सीए (CA) ऑडिट'
      ),
      desc: t(
        lang,
        'Quarterly Chartered Accountant public audit reports and nominee dispute resolution support.',
        'हर तिमाही चार्टर्ड अकाउंटेंट (CA) द्वारा सार्वजनिक ऑडिट और नॉमिनी को कानूनी सहायता।'
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="text-xs font-bold uppercase tracking-wider text-blue-800">
          {t(
            lang,
            'Annual Operational Trust Fund (vyawasthashulk)',
            'वार्षिक व्यवस्था शुल्क एवं न्यास संचालन कोष (vyawasthashulk)'
          )}
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
          {t(
            lang,
            'Annual Portal Maintenance & District Verification Fund (₹51 / ₹101 / ₹500)',
            'वार्षिक पोर्टल संचालन एवं भौतिक सत्यापन व्यवस्था शुल्क (₹51 / ₹101 / ₹500)'
          )}
        </h2>
        <p className="text-xs text-slate-600 mt-1 max-w-3xl">
          {t(
            lang,
            'Note: Bereavement Sahyog (₹35–₹50) goes 100% directly to the deceased member’s nominee. Only this small annual Vyawastha Shulk goes to the Trust bank account to run the digital infrastructure and physical verification teams for 365 days.',
            'विशेष नोट: दिवंगत परिवार का सहयोग (₹35–₹50) 100% सीधे नॉमिनी के खाते में जाता है। न्यास के खाते में केवल यह वार्षिक व्यवस्था शुल्क लिया जाता है जिससे पूरे 365 दिन वेबसाइट, सर्वर और जिला सत्यापन कमेटियों का खर्च चलता है।'
          )}
        </p>
      </div>

      {/* 3 Allocation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {allocationItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <div
              key={item.title}
              className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-start gap-3.5"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 flex items-center justify-center shrink-0">
                <IconComponent className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-mono-tabular font-extrabold text-blue-800">
                  {item.percent} {t(lang, 'ALLOCATION', 'बजट आवंटन')}
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 mt-0.5">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Payment & QR Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Tier Selector + Payment Form */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-5">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              {t(
                lang,
                'Step 1: Select Annual Contribution Slab (Valid for 365 Days)',
                'चरण 1: अपना वार्षिक व्यवस्था शुल्क स्लैब चुनें (365 दिनों के लिए वैध)'
              )}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
              {tiers.map((tier) => (
                <button
                  key={tier.amount}
                  type="button"
                  onClick={() => setSelectedTier(tier.amount)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedTier === tier.amount
                      ? 'border-blue-700 bg-blue-50/70 ring-2 ring-blue-700/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-mono-tabular font-extrabold text-slate-900">
                      ₹{tier.amount}
                    </span>
                    <span className="text-[11px] font-mono-tabular font-bold text-emerald-700">
                      / 365 {t(lang, 'Days', 'दिन')}
                    </span>
                  </div>
                  <div className="text-xs font-extrabold text-blue-900 mt-1">
                    {tier.title}
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-normal">
                    {tier.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmitShulk} className="space-y-4 pt-3 border-t border-slate-100">
            <h3 className="text-base font-extrabold text-slate-900">
              {t(
                lang,
                'Step 2: Submit Trust Fee UTR & Generate 365-Day Validity Pass',
                'चरण 2: भुगतान का UTR दर्ज करें और 365-दिन की वैधता रसीद प्राप्त करें'
              )}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t(lang, 'Member ID', 'सदस्य आईडी (Member ID)')}
                </label>
                <input
                  type="text"
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-mono-tabular font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t(lang, 'Member Name', 'सदस्य का नाम')}
                </label>
                <input
                  type="text"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t(
                  lang,
                  `12-Digit UPI UTR Number for ₹${selectedTier} Payment *`,
                  `₹${selectedTier} भुगतान का 12-अंकों वाला UPI UTR नंबर *`
                )}
              </label>
              <input
                type="text"
                value={utr}
                onChange={(e) => setUtr(e.target.value)}
                placeholder="e.g. UTR-512598741230"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-mono-tabular font-bold text-slate-900"
              />
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-800">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-lg bg-blue-800 hover:bg-blue-900 text-white text-xs font-extrabold uppercase tracking-wider transition-colors cursor-pointer"
            >
              {t(
                lang,
                `Verify ₹${selectedTier} Vyawastha Shulk & Issue 365-Day Receipt`,
                `₹${selectedTier} व्यवस्था शुल्क सत्यापित करें और रसीद डाउनलोड करें`
              )}
            </button>
          </form>

          {receiptGenerated && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 space-y-2">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-900">
                  <Receipt className="w-4 h-4 text-emerald-700" />
                  {t(
                    lang,
                    'OFFICIAL 365-DAY VYAWASTHA SHULK RECEIPT',
                    'आधिकारिक 365-दिवसीय व्यवस्था शुल्क रसीद'
                  )}
                </span>
                <span className="font-mono-tabular text-xs font-bold text-emerald-800">
                  {receiptGenerated.receiptNo}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
                <div>
                  <div className="text-[10px] text-emerald-700 uppercase">Member</div>
                  <div className="font-bold text-slate-900">{memberId}</div>
                </div>
                <div>
                  <div className="text-[10px] text-emerald-700 uppercase">Amount Paid</div>
                  <div className="font-mono-tabular font-extrabold text-slate-900">
                    ₹{receiptGenerated.amount}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-emerald-700 uppercase">Valid From</div>
                  <div className="font-mono-tabular font-bold text-slate-900">
                    {receiptGenerated.validFrom}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-emerald-700 uppercase">Valid Until</div>
                  <div className="font-mono-tabular font-bold text-emerald-900">
                    {receiptGenerated.validUntil}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right 5 Cols: Official Trust Bank Credentials & Dynamic BharatQR */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Shield className="w-5 h-5 text-blue-800" />
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                {t(
                  lang,
                  'Official Trust Bank Account & QR',
                  'न्यास का आधिकारिक बैंक खाता एवं BharatQR'
                )}
              </h3>
              <p className="text-xs text-slate-500">{TRUST_BANK.registrationNo}</p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">{t(lang, 'Account Name:', 'खाता नाम:')}</span>
              <span className="font-bold text-slate-900 text-right">
                {TRUST_BANK.accountName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{t(lang, 'Bank & Branch:', 'बैंक व शाखा:')}</span>
              <span className="font-bold text-slate-900 text-right">
                {TRUST_BANK.bankName} ({TRUST_BANK.branch})
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              <div>
                <div className="text-[10px] uppercase text-slate-400">
                  {t(lang, 'Trust Account Number', 'न्यास खाता संख्या')}
                </div>
                <div className="font-mono-tabular font-extrabold text-sm text-slate-900">
                  {TRUST_BANK.accountNumber}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(TRUST_BANK.accountNumber, 'trust-acc')}
                className="px-2.5 py-1 rounded bg-white border border-slate-200 text-blue-800 font-bold flex items-center gap-1 cursor-pointer"
              >
                {copiedField === 'trust-acc' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t(lang, 'Copied', 'कॉपी')}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{t(lang, 'Copy', 'कॉपी')}</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              <div>
                <div className="text-[10px] uppercase text-slate-400">IFSC Code</div>
                <div className="font-mono-tabular font-bold text-slate-900">
                  {TRUST_BANK.ifsc}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(TRUST_BANK.ifsc, 'trust-ifsc')}
                className="px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-700 font-semibold flex items-center gap-1 cursor-pointer"
              >
                {copiedField === 'trust-ifsc' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t(lang, 'Copied', 'कॉपी')}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>IFSC</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <BharatQrWidget
            upiId={TRUST_BANK.upiId}
            payeeName={TRUST_BANK.accountName}
            amount={selectedTier}
            transactionNote={`Vyawastha Shulk ${memberId}`}
          />

          <div className="flex items-center gap-2 text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg p-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>
              {t(
                lang,
                `Tax Exemption Available: ${TRUST_BANK.taxExemption80G}`,
                `आयकर छूट उपलब्ध: ${TRUST_BANK.taxExemption80G}`
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
