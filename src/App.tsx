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
  const [directoryCadreFilter, setDirectoryCadreFilter] = useState<
    'ALL' | CadreCode
  >('ALL');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Stateful Live Data
  const [alerts, setAlerts] = useState<SahyogAlert[]>(INITIAL_SAHYOG_ALERTS);
  const [members, setMembers] = useState<MemberRecord[]>(INITIAL_MEMBERS);
  const [receipts, setReceipts] =
    useState<ContributionReceipt[]>(INITIAL_RECEIPTS);

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegisterMember = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (!regName.trim() || !regNomineeName.trim() || !regDesignation.trim()) {
      setRegError(
        t(
          lang,
          'Please complete all required member and legal nominee fields.',
          'कृपया सदस्य का नाम, पदनाम और कानूनी नॉमिनी का विवरण पूरा भरें।'
        )
      );
      return;
    }

    if (regAge < 18 || regAge > 60) {
      setRegError(
        t(
          lang,
          'Constitutional Article 04: New registration is open only for ages 18 to 60.',
          'संवैधानिक अनुच्छेद 04 के अनुसार नया पंजीकरण केवल 18 से 60 वर्ष की आयु के लिए खुला है।'
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
      doj: '2026-10-23',
      status: 'LOCK_IN',
      appeals_total: 1,
      appeals_participated: 1,
      vyawastha_shulk_valid_until: '2027-10-22',
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
    subEn: string;
    subHi: string;
    badge?: string;
    icon: React.FC<{ className?: string }>;
  }[] = [
    {
      id: 'sahyog_alert',
      labelEn: 'Active Sahyog Alert',
      labelHi: 'सक्रिय सहयोग अलर्ट',
      subEn: '3 Bereavement Cases & UTR',
      subHi: '3 दिवंगत केस व UTR अपलोड',
      badge: '03',
      icon: BellRing,
    },
    {
      id: 'user_list',
      labelEn: 'Member Directory',
      labelHi: 'सदस्य डायरेक्टरी (user_list)',
      subEn: '62,410 Verified Passbooks',
      subHi: '62,410 सत्यापित डिजिटल कार्ड',
      icon: Users,
    },
    {
      id: 'vyawasthashulk',
      labelEn: 'Annual Trust Fund',
      labelHi: 'वार्षिक व्यवस्था शुल्क',
      subEn: '₹51 / ₹101 / ₹500 Portal Fee',
      subHi: '₹51 / ₹101 / ₹500 वार्षिक शुल्क',
      icon: ShieldCheck,
    },
    {
      id: 'kanyadan_education',
      labelEn: 'Kanyadan & Fellowship',
      labelHi: 'कन्यादान व शिक्षा फेलोशिप',
      subEn: 'Phule & Babasaheb Grants',
      subHi: 'फुले कन्यादान व कोचिंग अनुदान',
      icon: GraduationCap,
    },
    {
      id: 'niyamawali',
      labelEn: '22-Rule Constitution',
      labelHi: '22-सूत्रीय संविधान (नियमावली)',
      subEn: '90% Rule & 18M Lock-in',
      subHi: '90% सहयोग व 18-माह लॉक-इन',
      icon: Scale,
    },
  ];

  const currentNav = navItems.find((n) => n.id === activeTab) || navItems[0];

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-[#0F172A]">
      {/* Desktop Left Sidebar Workspace Rail */}
      <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 bg-white border-r border-slate-200 z-30 justify-between">
        <div>
          {/* Brand Identity Lockup */}
          <div className="p-4 border-b border-slate-200 bg-slate-950 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400/15 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0">
                <DhammaChakraIcon size={24} />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-mono-tabular font-bold uppercase tracking-widest text-amber-300">
                  PBSCN · REGD. 1882
                </div>
                <div className="text-sm font-extrabold leading-tight truncate">
                  प्रबुद्ध भारत स्वाभिमान न्यास
                </div>
                <div className="text-[11px] text-slate-300 truncate">
                  Prabuddha Bharat Social Care
                </div>
              </div>
            </div>
          </div>

          {/* Language Switcher in Sidebar */}
          <div className="px-4 pt-3.5 pb-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
              <Globe className="w-3 h-3 text-blue-700" />
              <span>Select Platform Language / भाषा</span>
            </div>
            <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`py-1.5 px-2 rounded-md text-xs font-extrabold transition-all cursor-pointer ${
                  lang === 'en'
                    ? 'bg-blue-800 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                EN · English
              </button>
              <button
                type="button"
                onClick={() => setLang('hi')}
                className={`py-1.5 px-2 rounded-md text-xs font-extrabold transition-all cursor-pointer ${
                  lang === 'hi'
                    ? 'bg-blue-800 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                HI · बोलचाल
              </button>
            </div>
          </div>

          {/* Navigation Modules */}
          <nav className="px-3 py-2 space-y-1">
            <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {t(lang, 'Core Mutual Aid Modules', 'मुख्य आपसी सहयोग मॉड्यूल')}
            </div>
            {navItems.map((item) => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-800 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <IconComp
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-amber-300' : 'text-blue-800'
                      }`}
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-extrabold truncate">
                        {lang === 'en' ? item.labelEn : item.labelHi}
                      </div>
                      <div
                        className={`text-[10px] truncate ${
                          isActive ? 'text-blue-100' : 'text-slate-500'
                        }`}
                      >
                        {lang === 'en' ? item.subEn : item.subHi}
                      </div>
                    </div>
                  </div>
                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono-tabular font-extrabold ${
                        isActive
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: Constitutional Seal & Helpline */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/70 space-y-3">
          <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-blue-800">
              {t(lang, 'Zero-Commission Pledge', '100% सीधा सहयोग संकल्प')}
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              {t(
                lang,
                'Every ₹35–₹50 Sahyog goes directly into the deceased member’s nominee bank account.',
                'प्रत्येक ₹35–₹50 का सहयोग बिना किसी कटौती के सीधे दिवंगत सदस्य के नॉमिनी के बैंक खाते में जाता है।'
              )}
            </p>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-600 px-1">
            <span className="flex items-center gap-1.5 font-semibold">
              <PhoneCall className="w-3.5 h-3.5 text-blue-800" />
              {t(lang, '24×7 Audit Desk:', 'हेल्पलाइन:')}
            </span>
            <span className="font-mono-tabular font-bold text-slate-900">
              1800-180-5656
            </span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        {/* Clean Sticky Top Command Header */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-xs border-b border-slate-200 px-4 sm:px-6 py-2.5">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            {/* Left: Mobile Menu Button + Current Module Breadcrumb */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(true)}
                className="lg:hidden p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer"
                aria-label="Open Navigation"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="min-w-0">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-extrabold text-slate-900 truncate">
                    {lang === 'en' ? currentNav.labelEn : currentNav.labelHi}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="hidden sm:inline text-slate-500 truncate">
                    {t(
                      lang,
                      '"Of Us All, For Us All, By Us All"',
                      '"हम सबका, हम सबके लिए, हम सबके द्वारा"'
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Prominent Language Switcher + Join Network Button */}
            <div className="flex items-center gap-2.5 shrink-0">
              <div
                className="inline-flex items-center rounded-lg border border-slate-300 bg-slate-100 p-0.5"
                role="group"
                aria-label="Language Switcher"
              >
                <button
                  type="button"
                  onClick={() => setLang('en')}
                  className={`px-2.5 py-1 rounded-md text-xs font-extrabold transition-colors cursor-pointer ${
                    lang === 'en'
                      ? 'bg-blue-800 text-white shadow-2xs'
                      : 'text-slate-700 hover:text-slate-950'
                  }`}
                >
                  English (EN)
                </button>
                <button
                  type="button"
                  onClick={() => setLang('hi')}
                  className={`px-2.5 py-1 rounded-md text-xs font-extrabold transition-colors cursor-pointer ${
                    lang === 'hi'
                      ? 'bg-blue-800 text-white shadow-2xs'
                      : 'text-slate-700 hover:text-slate-950'
                  }`}
                >
                  बोलचाल (HI)
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setRegSuccessId(null);
                  setIsRegisterModalOpen(true);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-blue-800 hover:bg-blue-900 text-white text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {t(lang, 'Join Network', 'सदस्य बनें')}
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* Mobile Drawer */}
        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-slate-950/60"
              onClick={() => setMobileDrawerOpen(false)}
            />
            <div className="relative w-72 max-w-[85vw] bg-white h-full flex flex-col justify-between z-10 shadow-xl">
              <div>
                <div className="p-4 bg-slate-950 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <DhammaChakraIcon size={22} className="text-amber-400" />
                    <div>
                      <div className="text-xs font-extrabold">PBSCN Network</div>
                      <div className="text-[10px] text-amber-300">
                        प्रबुद्ध भारत स्वाभिमान न्यास
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="p-1 text-slate-300 hover:text-white"
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
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left ${
                          isActive
                            ? 'bg-blue-800 text-white'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <IconComp className="w-4 h-4 shrink-0" />
                          <div>
                            <div className="text-xs font-extrabold">
                              {lang === 'en' ? item.labelEn : item.labelHi}
                            </div>
                            <div
                              className={`text-[10px] ${
                                isActive ? 'text-blue-100' : 'text-slate-500'
                              }`}
                            >
                              {lang === 'en' ? item.subEn : item.subHi}
                            </div>
                          </div>
                        </div>
                        {item.badge && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono-tabular font-bold bg-amber-400 text-slate-950">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-4 border-t border-slate-200 text-xs text-slate-500">
                PBSCN · 100% Direct Peer-to-Peer Solidarity
              </div>
            </div>
          </div>
        )}

        {/* Primary Workspace Body */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-5">
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

          {/* Pushpin Tear Poster Footer */}
          <PbscnTearFooter lang={lang} />
        </main>

        {/* Institutional Footer */}
        <footer className="bg-white border-t border-slate-200 px-4 sm:px-6 py-4 mt-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <DhammaChakraIcon size={16} className="text-blue-800" />
              <span className="font-bold text-slate-800">
                प्रबुद्ध भारत स्वाभिमान न्यास (PBSCN)
              </span>
              <span>·</span>
              <span>
                {t(
                  lang,
                  'Pay Back to Society · Educate, Agitate, Organise',
                  'Pay Back to Society · शिक्षित बनो, संगठित रहो, संघर्ष करो'
                )}
              </span>
            </div>
            <div className="font-mono-tabular">
              Regd. UP/LCK/TRUST/2023-08914 · 100% Direct P2P Mutual Aid
            </div>
          </div>
        </footer>
      </div>

      {/* New Member Registration Modal */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full overflow-hidden shadow-xl">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <DhammaChakraIcon size={22} className="text-amber-400" />
                <div>
                  <h3 className="text-sm font-extrabold">
                    {t(
                      lang,
                      'New Member Constitutional Registration (Ages 18–60)',
                      'नया सदस्य संवैधानिक पंजीकरण (आयु 18–60 वर्ष)'
                    )}
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    {t(
                      lang,
                      'Generates an instant PBSCN Member ID in the Public Directory',
                      'तुरंत आपकी PBSCN Member ID और डिजिटल पासबुक जारी करता है'
                    )}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsRegisterModalOpen(false)}
                className="p-1 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {regSuccessId ? (
              <div className="p-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase text-emerald-700">
                    {t(lang, 'Registration Successful', 'पंजीकरण सफल रहा')}
                  </div>
                  <h4 className="text-lg font-extrabold text-slate-900 mt-1">
                    {regName} ({regSuccessId})
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    {t(
                      lang,
                      'Your profile has been added to the Live Member Directory under Cadre ' +
                        regCadre +
                        '.',
                      'आपका प्रोफ़ाइल लाइव सदस्य डायरेक्टरी में संवर्ग ' +
                        regCadre +
                        ' के अंतर्गत जोड़ दिया गया है।'
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
                    className="px-4 py-2 rounded-lg bg-blue-800 text-white text-xs font-extrabold cursor-pointer"
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
              <form
                onSubmit={handleRegisterMember}
                className="p-5 space-y-3.5 text-xs"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {t(lang, 'Full Name *', 'पूरा नाम *')}
                    </label>
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Dr. Siddharth Gautam"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {t(
                        lang,
                        'Select Swabhiman Cadre *',
                        'स्वाभिमान संवर्ग चुनें *'
                      )}
                    </label>
                    <select
                      value={regCadre}
                      onChange={(e) =>
                        setRegCadre(e.target.value as CadreCode)
                      }
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-bold text-slate-900"
                    >
                      <option value="A">Cadre A (Govt / PSU)</option>
                      <option value="B">Cadre B (Private / Tech)</option>
                      <option value="C">Cadre C (Professionals)</option>
                      <option value="D">Cadre D (Grassroots / Youth)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {t(lang, 'Designation / Occupation *', 'पद / व्यवसाय *')}
                    </label>
                    <input
                      type="text"
                      value={regDesignation}
                      onChange={(e) => setRegDesignation(e.target.value)}
                      placeholder="e.g. Senior Engineer"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {t(lang, 'District *', 'जिला *')}
                    </label>
                    <select
                      value={regDistrict}
                      onChange={(e) => setRegDistrict(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900"
                    >
                      {UP_75_DISTRICTS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {t(lang, 'Age (18–60) *', 'आयु (18–60) *')}
                    </label>
                    <input
                      type="number"
                      min={18}
                      max={60}
                      value={regAge}
                      onChange={(e) => setRegAge(Number(e.target.value))}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono-tabular font-bold text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {t(lang, 'Legal Nominee Name *', 'वैध नॉमिनी का नाम *')}
                    </label>
                    <input
                      type="text"
                      value={regNomineeName}
                      onChange={(e) => setRegNomineeName(e.target.value)}
                      placeholder="e.g. Smt. Vandana Gautam"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {t(lang, 'Nominee Relationship', 'नॉमिनी से संबंध')}
                    </label>
                    <select
                      value={regNomineeRelation}
                      onChange={(e) =>
                        setRegNomineeRelation(
                          e.target.value as
                            | 'SPOUSE'
                            | 'CHILD'
                            | 'PARENT'
                            | 'SIBLING'
                        )
                      }
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-bold text-slate-900"
                    >
                      <option value="SPOUSE">SPOUSE</option>
                      <option value="CHILD">CHILD</option>
                      <option value="PARENT">PARENT</option>
                      <option value="SIBLING">SIBLING</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {t(lang, 'Nominee Bank', 'नॉमिनी बैंक')}
                    </label>
                    <input
                      type="text"
                      value={regBankName}
                      onChange={(e) => setRegBankName(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {t(lang, 'Account No.', 'खाता संख्या')}
                    </label>
                    <input
                      type="text"
                      value={regAccountNo}
                      onChange={(e) => setRegAccountNo(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono-tabular font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      IFSC Code
                    </label>
                    <input
                      type="text"
                      value={regIfsc}
                      onChange={(e) => setRegIfsc(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono-tabular font-bold text-slate-900"
                    />
                  </div>
                </div>

                {regError && (
                  <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 font-semibold">
                    {regError}
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsRegisterModalOpen(false)}
                    className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-bold cursor-pointer"
                  >
                    {t(lang, 'Cancel', 'रद्द करें')}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-blue-800 hover:bg-blue-900 text-white font-extrabold cursor-pointer"
                  >
                    {t(
                      lang,
                      'Complete Constitutional Registration',
                      'सदस्यता पंजीकृत करें'
                    )}
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
