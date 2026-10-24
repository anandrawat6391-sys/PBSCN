import React, { useState } from 'react';
import {
  BellRing,
  Users,
  ShieldCheck,
  GraduationCap,
  Scale,
  UserPlus,
  X,
  Menu,
  CheckCircle2,
  Globe,
  PhoneCall,
  Sparkles,
} from 'lucide-react';
import {
  INITIAL_SAHYOG_ALERTS,
  INITIAL_MEMBERS,
  INITIAL_RECEIPTS,
  UP_75_DISTRICTS,
} from './data/pbscnData';
import {
  SahyogAlert,
  MemberRecord,
  ContributionReceipt,
  CadreCode,
} from './utils/pbscnRules';
import { DhammaChakraIcon } from './components/DhammaChakraIcon';
import { HeroSection } from './components/HeroSection';
import { SahyogAlertSection } from './components/SahyogAlertSection';
import { MemberDirectorySection } from './components/MemberDirectorySection';
import { TrustFundSection } from './components/TrustFundSection';
import { WelfareSchemesSection } from './components/WelfareSchemesSection';
import { ConstitutionSection } from './components/ConstitutionSection';
import PbscnTearFooter from './components/pbscn-tear-footer';
import { LangMode, t } from './utils/i18n';

type ActiveTab =
  | 'sahyog_alert'
  | 'user_list'
  | 'vyawasthashulk'
  | 'kanyadan_education'
  | 'niyamawali';

export default function App() {
  const [lang, setLang] = useState<LangMode>('en');
  const [activeTab, setActiveTab] = useState<ActiveTab>('sahyog_alert');
  const [directoryCadreFilter, setDirectoryCadreFilter] = useState<'ALL' | CadreCode>('ALL');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Stateful Live Data
  const [alerts, setAlerts] = useState<SahyogAlert[]>(INITIAL_SAHYOG_ALERTS);
  const [members, setMembers] = useState<MemberRecord[]>(INITIAL_MEMBERS);
  const [receipts, setReceipts] = useState<ContributionReceipt[]>(INITIAL_RECEIPTS);

  // New Member Registration Modal State
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [regName, setRegName] = useState('');
  const [regCadre, setRegCadre] = useState<CadreCode>('A');
  const [regDesignation, setRegDesignation] = useState('');
  const [regDistrict, setRegDistrict] = useState('Lucknow');
  const [regAge, setRegAge] = useState(32);
  const [regNomineeName, setRegNomineeName] = useState('');
  const [regNomineeRelation, setRegNomineeRelation] = useState<
    'SPOUSE' | 'CHILD' | 'PARENT' | 'SIBLING'
  >('SPOUSE');
  const [regBankName, setRegBankName] = useState('State Bank of India');
  const [regAccountNo, setRegAccountNo] = useState('34910283741');
  const [regIfsc, setRegIfsc] = useState('SBIN0000125');
  const [regError, setRegError] = useState<string | null>(null);
  const [regSuccessId, setRegSuccessId] = useState<string | null>(null);

  const handleUploadReceipt = (newReceipt: ContributionReceipt) => {
    setReceipts((prev) => [newReceipt, ...prev]);
    setAlerts((prevAlerts) =>
      prevAlerts.map((alert) =>
        alert.alert_number === newReceipt.alert_number
          ? {
              ...alert,
              cases: alert.cases.map((c) =>
                c.case_id === newReceipt.case_id
                  ? {
                      ...c,
                      current_raised: c.current_raised + newReceipt.amount_paid,
                      contributors_count: c.contributors_count + 1,
                    }
                  : c
              ),
            }
          : alert
      )
    );
  };

  const handleNavigateDirectory = (cadre?: 'ALL' | CadreCode) => {
    setDirectoryCadreFilter(cadre || 'ALL');
    setActiveTab('user_list');
    const el = document.getElementById('main-modules-workspace');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleRegisterMember = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (!regName.trim() || !regNomineeName.trim() || !regDesignation.trim()) {
      setRegError(
        t(
          lang,
          'Please complete all required fields for the member and legal nominee.',
          'कृपया सदस्य का नाम, पदनाम और वैध नॉमिनी का संपूर्ण विवरण दर्ज करें।'
        )
      );
      return;
    }

    if (regAge < 18 || regAge > 60) {
      setRegError(
        t(
          lang,
          'Article 04 of Constitution: New registration is open exclusively for ages 18 to 60.',
          'संविधान के अनुच्छेद 04 के अनुसार नया पंजीकरण केवल 18 से 60 वर्ष की आयु तक मान्य है।'
        )
      );
      return;
    }

    const generatedId = `PB-2026-0${Math.floor(6000 + Math.random() * 3900)}`;
    const birthYear = 2026 - regAge;
    const newMember: MemberRecord = {
      member_id: generatedId,
      full_name: regName.trim(),
      cadre: regCadre,
      designation: regDesignation.trim(),
      dob: `${birthYear}-05-14`,
      phone: '9415088910',
      email: 'member@pbscn.org',
      district: regDistrict,
      state: 'Uttar Pradesh',
      doj: '2026-10-24',
      status: 'LOCK_IN',
      appeals_total: 1,
      appeals_participated: 1,
      vyawastha_shulk_valid_until: '2027-10-23',
      nominee: {
        name: regNomineeName.trim(),
        relation: regNomineeRelation,
        bank_name: regBankName,
        account_number: regAccountNo,
        ifsc_code: regIfsc,
        upi_id: `${regAccountNo}@sbi`,
      },
    };

    setMembers((prev) => [newMember, ...prev]);
    setRegSuccessId(generatedId);
  };

  const navItems: {
    id: ActiveTab;
    labelEn: string;
    labelHi: string;
    badge?: string;
    icon: React.FC<{ className?: string }>;
  }[] = [
    {
      id: 'sahyog_alert',
      labelEn: 'Active Sahyog Alert',
      labelHi: 'सक्रिय सहयोग अलर्ट',
      badge: '03',
      icon: BellRing,
    },
    {
      id: 'user_list',
      labelEn: 'Member Directory',
      labelHi: 'सदस्य डायरेक्टरी',
      icon: Users,
    },
    {
      id: 'vyawasthashulk',
      labelEn: 'Annual Trust Fund',
      labelHi: 'वार्षिक व्यवस्था शुल्क',
      icon: ShieldCheck,
    },
    {
      id: 'kanyadan_education',
      labelEn: 'Welfare & Fellowship',
      labelHi: 'कल्याण एवं फेलोशिप',
      icon: GraduationCap,
    },
    {
      id: 'niyamawali',
      labelEn: '22-Rule Constitution',
      labelHi: '22-सूत्रीय नियमावली',
      icon: Scale,
    },
  ];

  return (
    <div className="min-h-screen bg-[#070B19] text-[#F8FAFC] flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Top Sovereign Announcement Strip */}
      <div className="bg-[#050814] border-b border-blue-900/30 px-4 sm:px-6 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-400">
          <div className="flex items-center gap-2 text-[11px] font-semibold text-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
            <span>
              {t(
                lang,
                'Regd. Under Indian Trusts Act 1882 (UP/LCK/2023) · Zero Intermediary Commission',
                'भारतीय न्यास अधिनियम 1882 के अंतर्गत पंजीकृत · 100% सीधा बैंक ट्रांसफर'
              )}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-slate-300">
              <PhoneCall className="w-3.5 h-3.5 text-blue-400" />
              <span>{t(lang, 'Helpline:', 'हेल्पलाइन:')}</span>
              <strong className="text-white font-mono-tabular">1800-180-5656</strong>
            </span>

            {/* Language Switcher Toggle */}
            <div
              className="inline-flex items-center rounded-full border border-blue-900/60 bg-slate-900 p-0.5"
              role="group"
              aria-label="Language Selector"
            >
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-3 py-0.5 rounded-full text-[11px] font-extrabold transition-all cursor-pointer ${
                  lang === 'en'
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLang('hi')}
                className={`px-3 py-0.5 rounded-full text-[11px] font-extrabold transition-all cursor-pointer ${
                  lang === 'hi'
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                हिन्दी
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Sticky Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#070B19]/95 backdrop-blur-md border-b border-blue-900/40 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand Identity */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer"
              aria-label="Toggle Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0 shadow-lg shadow-amber-400/5">
                <DhammaChakraIcon size={24} className="animate-dhamma-spin" />
              </div>
              <div>
                <div className="text-sm font-extrabold text-white tracking-tight leading-snug">
                  {t(
                    lang,
                    'Prabuddha Bharat Social Care Network',
                    'प्रबुद्ध भारत स्वाभिमान न्यास'
                  )}
                </div>
                <div className="text-[11px] text-amber-300/90 font-medium">
                  {t(
                    lang,
                    'Pay Back to Society · Educate, Agitate, Organise',
                    'Pay Back to Society · शिक्षित बनो, संगठित रहो, संघर्ष करो'
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Modules */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/80 p-1 rounded-2xl border border-slate-800">
            {navItems.map((item) => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    const el = document.getElementById('main-modules-workspace');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md font-extrabold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <IconComp className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                  <span>{lang === 'en' ? item.labelEn : item.labelHi}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono-tabular font-extrabold bg-amber-400 text-slate-950">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* CTA & Join Network Action */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setRegSuccessId(null);
                setIsRegisterModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{t(lang, 'Join Network', 'सदस्य बनें')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] bg-[#0A1021] h-full flex flex-col justify-between z-10 border-r border-slate-800 shadow-2xl">
            <div>
              <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <DhammaChakraIcon size={22} className="text-amber-400" />
                  <div>
                    <div className="text-xs font-extrabold text-white">PBSCN Network</div>
                    <div className="text-[10px] text-amber-300">
                      {t(lang, 'Social Care Network', 'प्रबुद्ध भारत स्वाभिमान')}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3 space-y-1">
                {navItems.map((item) => {
                  const IconComp = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileDrawerOpen(false);
                        const el = document.getElementById('main-modules-workspace');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-300 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <IconComp className="w-4 h-4 text-amber-300" />
                        <span>{lang === 'en' ? item.labelEn : item.labelHi}</span>
                      </div>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono-tabular font-extrabold bg-amber-400 text-slate-950">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 text-xs text-slate-400">
              PBSCN · 100% Direct P2P Solidarity
            </div>
          </div>
        </div>
      )}

      {/* HERO SECTION: Murmuration Starlings Assembling into "JAI BHIM" */}
      <HeroSection
        lang={lang}
        onOpenRegisterModal={() => {
          setRegSuccessId(null);
          setIsRegisterModalOpen(true);
        }}
        onExploreCases={() => {
          setActiveTab('sahyog_alert');
          const el = document.getElementById('main-modules-workspace');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Main Workspace Body */}
      <main id="main-modules-workspace" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* Module Sub-Header & Tab Navigator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-8">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
              {t(lang, 'Mutual Aid Module', 'आपसी सहयोग मॉड्यूल')}
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
              {lang === 'en'
                ? navItems.find((n) => n.id === activeTab)?.labelEn
                : navItems.find((n) => n.id === activeTab)?.labelHi}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lang === 'en' ? item.labelEn : item.labelHi}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Modules */}
        {activeTab === 'sahyog_alert' && (
          <SahyogAlertSection
            alerts={alerts}
            receipts={receipts}
            onUploadReceipt={handleUploadReceipt}
            onNavigateDirectory={handleNavigateDirectory}
            onOpenJoinModal={() => {
              setRegSuccessId(null);
              setIsRegisterModalOpen(true);
            }}
            lang={lang}
          />
        )}

        {activeTab === 'user_list' && (
          <MemberDirectorySection
            members={members}
            initialCadreFilter={directoryCadreFilter}
            onOpenRegisterModal={() => {
              setRegSuccessId(null);
              setIsRegisterModalOpen(true);
            }}
            lang={lang}
          />
        )}

        {activeTab === 'vyawasthashulk' && <TrustFundSection lang={lang} />}

        {activeTab === 'kanyadan_education' && (
          <WelfareSchemesSection lang={lang} />
        )}

        {activeTab === 'niyamawali' && <ConstitutionSection lang={lang} />}

        {/* Interactive Pushpin Tear Footer */}
        <PbscnTearFooter lang={lang} />
      </main>

      {/* New Member Registration Modal */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B1120] border border-blue-900/50 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl text-white">
            <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <DhammaChakraIcon size={22} className="text-amber-400" />
                <div>
                  <h3 className="text-sm font-extrabold text-white">
                    {t(
                      lang,
                      'New Member Registration (Ages 18–60)',
                      'नया सदस्य संवैधानिक पंजीकरण (आयु 18–60 वर्ष)'
                    )}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {t(
                      lang,
                      'Generates instant PBSCN Member ID and public passbook',
                      'तुरंत आपकी PBSCN सदस्य आईडी व डिजिटल पासबुक जारी करता है'
                    )}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsRegisterModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {regSuccessId ? (
              <div className="p-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase text-emerald-400">
                    {t(lang, 'Registration Successful', 'पंजीकरण सफल रहा')}
                  </div>
                  <h4 className="text-lg font-extrabold text-white mt-1">
                    {regName} ({regSuccessId})
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">
                    {t(
                      lang,
                      'Your profile has been enrolled under Cadre ' + regCadre + '.',
                      'आपका प्रोफाइल संवर्ग ' + regCadre + ' में जोड़ दिया गया है।'
                    )}
                  </p>
                </div>
                <div className="flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegisterModalOpen(false);
                      handleNavigateDirectory(regCadre);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-amber-400 text-slate-950 text-xs font-extrabold cursor-pointer hover:bg-amber-300 transition-colors shadow-md"
                  >
                    {t(
                      lang,
                      'View in Member Directory →',
                      'सदस्य डायरेक्टरी में देखें →'
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleRegisterMember} className="p-5 space-y-3.5 text-xs">
                {regError && (
                  <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200">
                    {regError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">
                      {t(lang, 'Full Name *', 'पूरा नाम *')}
                    </label>
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Dr. Siddharth Gautam"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">
                      {t(lang, 'Select Cadre *', 'स्वाभिमान संवर्ग चुनें *')}
                    </label>
                    <select
                      value={regCadre}
                      onChange={(e) => setRegCadre(e.target.value as CadreCode)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 font-bold text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option value="A">{t(lang, 'Cadre A (Govt / PSU Staff)', 'संवर्ग A (सरकारी व संविदा कर्मचारी)')}</option>
                      <option value="B">{t(lang, 'Cadre B (Private / IT Staff)', 'संवर्ग B (निजी क्षेत्र व आईटी)')}</option>
                      <option value="C">{t(lang, 'Cadre C (Advocates & Doctors)', 'संवर्ग C (वकील, डॉक्टर व प्रोफेशनल्स)')}</option>
                      <option value="D">{t(lang, 'Cadre D (Farmers & Youth)', 'संवर्ग D (किसान, दुकानदार व युवा)')}</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">
                      {t(lang, 'Occupation *', 'पद / व्यवसाय *')}
                    </label>
                    <input
                      type="text"
                      value={regDesignation}
                      onChange={(e) => setRegDesignation(e.target.value)}
                      placeholder="e.g. Senior Medical Officer"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">
                      {t(lang, 'District *', 'जिला *')}
                    </label>
                    <select
                      value={regDistrict}
                      onChange={(e) => setRegDistrict(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                    >
                      {UP_75_DISTRICTS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">
                      {t(lang, 'Age (18–60) *', 'आयु (18–60) *')}
                    </label>
                    <input
                      type="number"
                      min={18}
                      max={60}
                      value={regAge}
                      onChange={(e) => setRegAge(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 font-mono-tabular font-bold text-amber-300 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">
                      {t(lang, 'Nominee Name *', 'वैध नॉमिनी का नाम *')}
                    </label>
                    <input
                      type="text"
                      value={regNomineeName}
                      onChange={(e) => setRegNomineeName(e.target.value)}
                      placeholder="e.g. Smt. Vandana Gautam"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">
                      {t(lang, 'Nominee Relation', 'नॉमिनी संबंध')}
                    </label>
                    <select
                      value={regNomineeRelation}
                      onChange={(e) =>
                        setRegNomineeRelation(
                          e.target.value as 'SPOUSE' | 'CHILD' | 'PARENT' | 'SIBLING'
                        )
                      }
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 font-bold text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option value="SPOUSE">{t(lang, 'Spouse', 'पति / पत्नी')}</option>
                      <option value="CHILD">{t(lang, 'Child', 'पुत्र / पुत्री')}</option>
                      <option value="PARENT">{t(lang, 'Parent', 'माता / पिता')}</option>
                      <option value="SIBLING">{t(lang, 'Sibling', 'भाई / बहन')}</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">
                      {t(lang, 'Nominee Bank', 'नॉमिनी बैंक')}
                    </label>
                    <input
                      type="text"
                      value={regBankName}
                      onChange={(e) => setRegBankName(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">
                      {t(lang, 'Account Number', 'खाता संख्या')}
                    </label>
                    <input
                      type="text"
                      value={regAccountNo}
                      onChange={(e) => setRegAccountNo(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 font-mono-tabular font-bold text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">
                      IFSC
                    </label>
                    <input
                      type="text"
                      value={regIfsc}
                      onChange={(e) => setRegIfsc(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 font-mono-tabular font-bold text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsRegisterModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    {t(lang, 'Cancel', 'रद्द करें')}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold transition-colors cursor-pointer shadow-md"
                  >
                    {t(lang, 'Complete Registration', 'पंजीकरण पूरा करें')}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
