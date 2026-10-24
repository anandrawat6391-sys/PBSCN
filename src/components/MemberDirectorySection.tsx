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
  const [cadreFilter, setCadreFilter] = useState<'ALL' | CadreCode>(initialCadreFilter);
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
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
            {t(
              lang,
              'Public Transparency Registry',
              'सार्वजनिक पारदर्शिता सदस्यता सूची'
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            {t(
              lang,
              'Verified Member Directory & Digital Passbook',
              'सत्यापित सदस्य डायरेक्टरी एवं डिजिटल पासबुक'
            )}
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            {t(
              lang,
              'Search across all 4 Swabhiman Cadres and 75 Uttar Pradesh districts. View verified contribution passbooks and legal nominee designations.',
              'सभी 4 स्वाभिमान संवर्गों और 75 जिलों के सदस्यों को नाम, सदस्य आईडी या जिले से खोजें और उनका पारदर्शी डिजिटल सहयोग कार्ड देखें।'
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenRegisterModal}
          className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer shrink-0 shadow-md"
        >
          {t(lang, '+ Register New Member', '+ नया सदस्य पंजीकरण करें')}
        </button>
      </div>

      {/* Multi-Filter Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 text-xs">
          {/* Search Input */}
          <div className="lg:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t(
                lang,
                'Search by Name, Member ID (PB-2025-05709), or District...',
                'नाम, सदस्य संख्या (PB-2025-05709) या जिले से खोजें...'
              )}
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Cadre Filter */}
          <div className="lg:col-span-3">
            <select
              value={cadreFilter}
              onChange={(e) => setCadreFilter(e.target.value as 'ALL' | CadreCode)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 font-bold text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="ALL">
                {t(lang, 'All 4 Cadres (A, B, C, D)', 'सभी 4 संवर्ग (A, B, C, D)')}
              </option>
              {FOUR_CADRES.map((c) => (
                <option key={c.code} value={c.code}>
                  {t(lang, `Cadre ${c.code}`, `संवर्ग ${c.code}`)}
                </option>
              ))}
            </select>
          </div>

          {/* District Filter */}
          <div className="lg:col-span-2">
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 font-bold text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="ALL">
                {t(lang, 'All 75 Districts', 'सभी 75 जिले')}
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
              onChange={(e) => setStatusFilter(e.target.value as 'ALL' | MemberStatus)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 font-bold text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="ALL">{t(lang, 'All Statuses', 'सभी स्थितियां')}</option>
              <option value="VALID">{t(lang, 'Fully Verified', 'सत्यापित एवं वैध')}</option>
              <option value="LOCK_IN">{t(lang, 'Lock-in (18 Months)', '18-माह लॉक-इन अवधि')}</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Cadre Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 font-semibold flex items-center gap-1.5 mr-1">
              <Filter className="w-3.5 h-3.5 text-blue-400" />
              <span>{t(lang, 'Quick Cadre Filter:', 'संवर्ग फ़िल्टर:')}</span>
            </span>
            {(['ALL', 'A', 'B', 'C', 'D'] as const).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setCadreFilter(code)}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  cadreFilter === code
                    ? 'bg-blue-600 text-white shadow-sm font-extrabold'
                    : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                {code === 'ALL'
                  ? t(lang, 'All', 'सभी')
                  : t(lang, `Cadre ${code}`, `संवर्ग ${code}`)}
              </button>
            ))}
          </div>

          <span className="font-mono-tabular text-slate-400 text-xs font-semibold">
            {t(
              lang,
              `Showing ${filteredMembers.length} verified members`,
              `${filteredMembers.length} सत्यापित सदस्य उपलब्ध`
            )}
          </span>
        </div>
      </div>

      {/* Member Directory Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 text-[11px] font-bold uppercase tracking-wider border-b border-slate-800">
                <th className="py-3.5 px-5">{t(lang, 'Member ID & Name', 'सदस्य आईडी व नाम')}</th>
                <th className="py-3.5 px-4">{t(lang, 'Cadre & Role', 'संवर्ग व पद')}</th>
                <th className="py-3.5 px-4">{t(lang, 'District', 'जिला')}</th>
                <th className="py-3.5 px-4">{t(lang, 'Sahyog Compliance (90% Rule)', 'सहयोग अनुपालन (90% नियम)')}</th>
                <th className="py-3.5 px-4">{t(lang, 'Coverage Status', 'सुरक्षा स्थिति')}</th>
                <th className="py-3.5 px-5 text-right">{t(lang, 'Digital Passbook', 'डिजिटल पासबुक')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-xs">
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

                const roleText =
                  lang === 'en'
                    ? member.designation.split('·')[0].trim()
                    : (member.designation.split('·')[1] || member.designation).trim();

                return (
                  <tr
                    key={member.member_id}
                    className="hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-5">
                      <div className="font-mono-tabular font-extrabold text-amber-300">
                        {member.member_id}
                      </div>
                      <div className="font-extrabold text-white text-sm mt-0.5">
                        {member.full_name}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded bg-blue-950 border border-blue-800 text-[10px] font-bold text-blue-300 flex items-center justify-center">
                          {member.cadre}
                        </span>
                        <span className="text-slate-300">{roleText}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-300">
                      {member.district}, {lang === 'en' ? 'UP' : 'उ.प्र.'}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              passesRule ? 'bg-emerald-400' : 'bg-rose-500'
                            }`}
                            style={{ width: `${rate}%` }}
                          />
                        </div>
                        <span className="font-mono-tabular font-bold text-white text-xs">
                          {rate}%
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono-tabular mt-0.5">
                        {member.appeals_participated} / {member.appeals_total}{' '}
                        {t(lang, 'appeals done', 'सहयोग किए')}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {member.status === 'VALID' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{t(lang, 'Active Cover', 'सक्रिय सुरक्षा')}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-950/80 text-amber-300 border border-amber-500/30">
                          <Clock className="w-3.5 h-3.5" />
                          <span>
                            {t(
                              lang,
                              `Lock-in (${lockIn.remainingMonths}M left)`,
                              `लॉक-इन (${lockIn.remainingMonths} माह शेष)`
                            )}
                          </span>
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-5 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedMember(member)}
                        className="px-3 py-1.5 rounded-lg bg-blue-600/80 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                      >
                        {t(lang, 'View Card →', 'कार्ड देखें →')}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Member Digital Passbook Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B1120] border border-blue-900/60 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl text-white">
            <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <DhammaChakraIcon size={22} className="text-amber-400" />
                <div>
                  <h3 className="text-sm font-extrabold text-white">
                    {t(lang, 'Constitutional Digital Passbook', 'संवैधानिक डिजिटल पासबुक')}
                  </h3>
                  <p className="text-[11px] text-amber-300 font-mono-tabular">
                    {selectedMember.member_id}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h4 className="text-lg font-extrabold text-white">
                    {selectedMember.full_name}
                  </h4>
                  <p className="text-xs text-slate-300">
                    {lang === 'en'
                      ? selectedMember.designation.split('·')[0].trim()
                      : (selectedMember.designation.split('·')[1] || selectedMember.designation).trim()}
                  </p>
                </div>
                <span className="w-9 h-9 rounded-xl bg-blue-950 border border-blue-800 text-amber-400 font-extrabold text-sm flex items-center justify-center">
                  {selectedMember.cadre}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className="text-slate-400 block mb-0.5">{t(lang, 'District:', 'जिला:')}</span>
                  <span className="font-extrabold text-white">
                    {selectedMember.district}, {selectedMember.state}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className="text-slate-400 block mb-0.5">{t(lang, 'Enrolled Date:', 'जुड़ने की तिथि:')}</span>
                  <span className="font-mono-tabular font-extrabold text-white">
                    {selectedMember.doj}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className="text-slate-400 block mb-0.5">{t(lang, 'Nominee Name:', 'वैध नॉमिनी:')}</span>
                  <span className="font-extrabold text-amber-200">
                    {selectedMember.nominee.name} ({selectedMember.nominee.relation})
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className="text-slate-400 block mb-0.5">{t(lang, 'Nominee Bank A/C:', 'नॉमिनी बैंक खाता:')}</span>
                  <span className="font-mono-tabular font-extrabold text-white">
                    {selectedMember.nominee.account_number}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">{t(lang, 'Annual Trust Fee Valid Until:', 'वार्षिक व्यवस्था शुल्क वैधता:')}</span>
                <span className="font-mono-tabular font-extrabold text-emerald-400">
                  {selectedMember.vyawastha_shulk_valid_until}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                {t(lang, 'Close Passbook', 'पासबुक बंद करें')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
