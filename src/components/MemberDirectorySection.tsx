import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ShieldCheck,
  Clock,
  CreditCard,
  X,
  CheckCircle2,
  Building2,
  UserCheck,
  Award,
} from 'lucide-react';
import { UP_75_DISTRICTS, FOUR_CADRES } from '../data/pbscnData';
import {
  MemberRecord,
  CadreCode,
  MemberStatus,
  calculateParticipationRate,
  meetsParticipationRule,
  evaluateLockInPeriod,
  filterMembers,
} from '../utils/pbscnRules';
import { DhammaChakraIcon } from './DhammaChakraIcon';
import { LangMode, t } from '../utils/i18n';

interface MemberDirectorySectionProps {
  members: MemberRecord[];
  initialCadreFilter?: 'ALL' | CadreCode;
  onOpenRegisterModal: () => void;
  lang: LangMode;
}

export const MemberDirectorySection: React.FC<MemberDirectorySectionProps> = ({
  members,
  initialCadreFilter = 'ALL',
  onOpenRegisterModal,
  lang,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [cadreFilter, setCadreFilter] = useState<'ALL' | CadreCode>(
    initialCadreFilter
  );
  const [districtFilter, setDistrictFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | MemberStatus>('ALL');
  const [selectedMember, setSelectedMember] = useState<MemberRecord | null>(null);

  React.useEffect(() => {
    setCadreFilter(initialCadreFilter);
  }, [initialCadreFilter]);

  const filteredMembers = useMemo(() => {
    return filterMembers(members, {
      query: searchQuery,
      cadre: cadreFilter,
      district: districtFilter,
      status: statusFilter,
    });
  }, [members, searchQuery, cadreFilter, districtFilter, statusFilter]);

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-blue-800">
            {t(
              lang,
              'Public Transparency Registry (user_list)',
              'सार्वजनिक पारदर्शिता रजिस्ट्री (user_list)'
            )}
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
            {t(
              lang,
              'Live Verified Member Directory & Digital Passbook',
              'लाइव सत्यापित सदस्य डायरेक्टरी एवं डिजिटल पासबुक'
            )}
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            {t(
              lang,
              'Search by Member Name, ID (PB-202X-XXXX), or Phone across all 4 Swabhiman Cadres and 75 UP Districts.',
              'सभी 4 स्वाभिमान संवर्गों और 75 जिलों के सदस्यों को नाम, Member ID या फोन नंबर से खोजें और उनका डिजिटल कार्ड देखें।'
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenRegisterModal}
          className="px-4 py-2.5 rounded-lg bg-blue-800 hover:bg-blue-900 text-white text-xs font-extrabold uppercase tracking-wider transition-colors cursor-pointer shrink-0 shadow-xs"
        >
          {t(lang, '+ Register New Member', '+ नया सदस्य पंजीकरण करें')}
        </button>
      </div>

      {/* Multi-Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="lg:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t(
                lang,
                'Search by Name, Member ID (PB-2025-05709), or District...',
                'नाम, Member ID (PB-2025-05709) या जिले से खोजें...'
              )}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:border-blue-700 focus:outline-none"
            />
          </div>

          {/* Cadre Filter */}
          <div className="lg:col-span-2">
            <select
              value={cadreFilter}
              onChange={(e) =>
                setCadreFilter(e.target.value as 'ALL' | CadreCode)
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800"
            >
              <option value="ALL">
                {t(lang, 'All 4 Cadres (A–D)', 'सभी 4 संवर्ग (A–D)')}
              </option>
              {FOUR_CADRES.map((c) => (
                <option key={c.code} value={c.code}>
                  {t(lang, `Cadre ${c.code}`, `संवर्ग ${c.code}`)}
                </option>
              ))}
            </select>
          </div>

          {/* District Filter (75 UP Districts) */}
          <div className="lg:col-span-3">
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800"
            >
              <option value="ALL">
                {t(
                  lang,
                  `All ${UP_75_DISTRICTS.length} UP Districts & Chapters`,
                  `सभी ${UP_75_DISTRICTS.length} जिले व राज्य`
                )}
              </option>
              {UP_75_DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="lg:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as 'ALL' | MemberStatus)
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800"
            >
              <option value="ALL">
                {t(lang, 'All Statuses', 'सभी स्थितियां')}
              </option>
              <option value="VALID">
                {t(lang, 'Valid & Verified', 'वैध एवं सत्यापित')}
              </option>
              <option value="LOCK_IN">
                {t(lang, 'Under Lock-in (18M)', 'लॉक-इन अवधि (18 माह)')}
              </option>
            </select>
          </div>
        </div>

        {/* Quick Cadre Filter Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-500 font-semibold flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" />
              {t(lang, 'Quick Filter:', 'त्वरित फ़िल्टर:')}
            </span>
            {(['ALL', 'A', 'B', 'C', 'D'] as const).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setCadreFilter(code)}
                className={`px-2.5 py-1 rounded-md font-bold transition-colors cursor-pointer ${
                  cadreFilter === code
                    ? 'bg-blue-800 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {code === 'ALL'
                  ? t(lang, 'All Cadres', 'सभी संवर्ग')
                  : t(lang, `Cadre ${code}`, `संवर्ग ${code}`)}
              </button>
            ))}
          </div>

          <span className="font-mono-tabular text-slate-600 font-semibold">
            {t(
              lang,
              `Showing ${filteredMembers.length} matching records`,
              `${filteredMembers.length} सदस्य रिकॉर्ड उपलब्ध`
            )}
          </span>
        </div>
      </div>

      {/* Member Directory Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white text-[11px] font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Member ID & Name</th>
                <th className="py-3 px-3">{t(lang, 'Cadre & Role', 'संवर्ग व पद')}</th>
                <th className="py-3 px-3">{t(lang, 'District', 'जिला')}</th>
                <th className="py-3 px-3">
                  {t(lang, 'Sahyog Ratio (90% Rule)', 'सहयोग अनुपात (90% नियम)')}
                </th>
                <th className="py-3 px-3">{t(lang, 'Validity Status', 'वैधता स्थिति')}</th>
                <th className="py-3 px-4 text-right">
                  {t(lang, 'Digital Card', 'डिजिटल कार्ड')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {filteredMembers.map((member) => {
                const rate = calculateParticipationRate(
                  member.appeals_participated,
                  member.appeals_total
                );
                const passesRule = meetsParticipationRule(
                  member.appeals_participated,
                  member.appeals_total
                );
                const lockIn = evaluateLockInPeriod(member.doj);

                return (
                  <tr
                    key={member.member_id}
                    className="hover:bg-blue-50/40 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="font-mono-tabular font-bold text-blue-800">
                        {member.member_id}
                      </div>
                      <div className="font-extrabold text-slate-900 text-sm">
                        {member.full_name}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono-tabular">
                        DOJ: {member.doj} · +91 {member.phone.slice(0, 5)}XXXXX
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-mono-tabular font-bold text-[11px]">
                        {t(lang, `Cadre ${member.cadre}`, `संवर्ग ${member.cadre}`)}
                      </span>
                      <div className="text-slate-700 font-medium mt-1">
                        {lang === 'en'
                          ? member.designation.split('·')[0].trim()
                          : member.designation}
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{member.district}</div>
                      <div className="text-[11px] text-slate-500">{member.state}</div>
                    </td>

                    <td className="py-3 px-3 font-mono-tabular">
                      <div className="font-extrabold text-slate-900">
                        {rate}% ({member.appeals_participated}/{member.appeals_total})
                      </div>
                      <div className="w-28 h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1">
                        <div
                          className={`h-full rounded-full ${
                            passesRule ? 'bg-emerald-600' : 'bg-rose-600'
                          }`}
                          style={{
                            width: `${Math.min(100, rate)}%`,
                          }}
                        />
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      {member.status === 'VALID' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                          <ShieldCheck className="w-4 h-4 shrink-0" />
                          <span>
                            {t(lang, 'Valid & Verified', 'वैध एवं सत्यापित')}
                          </span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-700 font-bold">
                          <Clock className="w-4 h-4 shrink-0" />
                          <span>
                            {t(
                              lang,
                              `Lock-in (${lockIn.monthsCompleted}/18M)`,
                              `लॉक-इन (${lockIn.monthsCompleted}/18 माह)`
                            )}
                          </span>
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedMember(member)}
                        className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-800 text-blue-800 hover:text-white border border-blue-200 font-bold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>{t(lang, 'View Card', 'कार्ड देखें')}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Digital Verification Card Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full overflow-hidden shadow-xl">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-blue-900 text-white p-5 flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-300 shrink-0">
                  <DhammaChakraIcon size={26} />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-amber-300">
                    प्रबुद्ध भारत स्वाभिमान न्यास · PBSCN
                  </div>
                  <h3 className="text-base font-extrabold text-white">
                    {t(
                      lang,
                      'Member Digital Verification Passbook',
                      'सदस्य डिजिटल सत्यापन पासबुक कार्ड'
                    )}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Card Body */}
            <div className="p-5 space-y-4">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <div className="text-xs font-mono-tabular font-extrabold text-blue-800">
                    {selectedMember.member_id}
                  </div>
                  <h4 className="text-lg font-extrabold text-slate-900 mt-0.5">
                    {selectedMember.full_name}
                  </h4>
                  <p className="text-xs text-slate-600">
                    {selectedMember.designation} ·{' '}
                    {t(
                      lang,
                      `Cadre ${selectedMember.cadre}`,
                      `संवर्ग ${selectedMember.cadre}`
                    )}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-extrabold ${
                      selectedMember.status === 'VALID'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    <Award className="w-3.5 h-3.5" />
                    {selectedMember.status === 'VALID'
                      ? t(lang, 'VALID & VERIFIED', 'वैध एवं सत्यापित')
                      : t(lang, 'LOCK-IN ACTIVE', 'लॉक-इन सक्रिय')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                  <div className="text-slate-400 font-semibold uppercase text-[10px]">
                    {t(lang, 'District & State', 'जिला एवं राज्य')}
                  </div>
                  <div className="font-bold text-slate-900 mt-0.5">
                    {selectedMember.district}, {selectedMember.state}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                  <div className="text-slate-400 font-semibold uppercase text-[10px]">
                    {t(lang, 'Date of Joining (DOJ)', 'जुड़ने की तिथि (DOJ)')}
                  </div>
                  <div className="font-mono-tabular font-bold text-slate-900 mt-0.5">
                    {selectedMember.doj}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                  <div className="text-slate-400 font-semibold uppercase text-[10px] flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-blue-700" />
                    {t(lang, 'Registered Legal Nominee', 'पंजीकृत वैध नॉमिनी')}
                  </div>
                  <div className="font-bold text-slate-900 mt-0.5">
                    {selectedMember.nominee.name} ({selectedMember.nominee.relation})
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                  <div className="text-slate-400 font-semibold uppercase text-[10px] flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-blue-700" />
                    {t(lang, 'Linked Nominee Bank', 'जुड़ा हुआ बैंक खाता')}
                  </div>
                  <div className="font-mono-tabular font-bold text-slate-900 mt-0.5">
                    {selectedMember.nominee.bank_name} (
                    {selectedMember.nominee.ifsc_code})
                  </div>
                </div>
              </div>

              {/* 90% Participation Audit Bar */}
              <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/80 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">
                    {t(
                      lang,
                      '90% Mandatory Sahyog Participation Record:',
                      '90% अनिवार्य सहयोग भागीदारी रिकॉर्ड:'
                    )}
                  </span>
                  <span className="font-mono-tabular font-extrabold text-blue-900">
                    {selectedMember.appeals_participated} /{' '}
                    {selectedMember.appeals_total} Appeals
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-600">
                  <span>
                    {t(
                      lang,
                      'Annual Vyawastha Shulk Valid Until:',
                      'वार्षिक व्यवस्था शुल्क वैधता:'
                    )}
                  </span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1 font-mono-tabular">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {selectedMember.vyawastha_shulk_valid_until}
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedMember(null)}
                  className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-bold cursor-pointer"
                >
                  {t(lang, 'Close Passbook Card', 'पासबुक बंद करें')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
