export type CadreCode = 'A' | 'B' | 'C' | 'D';
export type MemberStatus = 'VALID' | 'LOCK_IN' | 'SUSPENDED';
export type NomineeRelation = 'SPOUSE' | 'CHILD' | 'PARENT' | 'SIBLING';
export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface NomineeDetails {
  name: string;
  relation: NomineeRelation;
  bank_name: string;
  account_number: string;
  ifsc_code: string;
  upi_id: string;
}

export interface MemberRecord {
  member_id: string;
  full_name: string;
  cadre: CadreCode;
  designation: string;
  dob: string;
  phone: string;
  email: string;
  district: string;
  state: string;
  doj: string;
  status: MemberStatus;
  appeals_total: number;
  appeals_participated: number;
  vyawastha_shulk_valid_until: string;
  nominee: NomineeDetails;
}

export interface BankAccountOption {
  bank: string;
  branch: string;
  holder: string;
  ac: string;
  ifsc: string;
  upi_id: string;
}

export interface BereavementCase {
  case_id: string;
  deceased_member_id: string;
  deceased_name: string;
  cadre: CadreCode;
  designation: string;
  district: string;
  state: string;
  doj: string;
  dod: string;
  cause_of_demise: string;
  nominee_name: string;
  nominee_relation: NomineeRelation;
  audit_committee_lead: string;
  verified_date: string;
  current_raised: number;
  target_estimate: number;
  contributors_count: number;
  portrait_id: 'surendra' | 'ramprakash' | 'anita';
  accounts: BankAccountOption[];
}

export interface SahyogAlert {
  alert_number: number;
  title: string;
  start_date: string;
  end_date: string;
  amount_per_case: number;
  cases: BereavementCase[];
  total_participants: number;
  status: 'ACTIVE' | 'COMPLETED';
}

export interface ContributionReceipt {
  receipt_id: string;
  member_id: string;
  member_name: string;
  alert_number: number;
  case_id: string;
  amount_paid: number;
  utr_number: string;
  screenshot_url: string;
  submitted_at: string;
  verification_status: VerificationStatus;
}

/**
 * Generates a standardized BharatQR / UPI payment URI
 */
export function buildUpiPaymentUri(params: {
  upiId: string;
  payeeName: string;
  amount: number;
  transactionNote: string;
}): string {
  const cleanUpi = params.upiId.trim();
  const cleanName = encodeURIComponent(params.payeeName.trim());
  const cleanNote = encodeURIComponent(params.transactionNote.trim());
  const formattedAmount = Math.max(1, Math.round(params.amount)).toFixed(2);
  return `upi://pay?pa=${cleanUpi}&pn=${cleanName}&am=${formattedAmount}&cu=INR&tn=${cleanNote}`;
}

/**
 * Generates a deterministic 21x21 QR-like matrix for visual BharatQR rendering
 * with standard finder patterns in the three corners.
 */
export function generateDeterministicQrMatrix(seed: string): boolean[][] {
  const size = 21;
  const grid: boolean[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => false)
  );

  const placeFinderPattern = (rowOffset: number, colOffset: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const isBorder = r === 0 || r === 6 || c === 0 || c === 6;
        const isInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        grid[rowOffset + r][colOffset + c] = isBorder || isInner;
      }
    }
  };

  placeFinderPattern(0, 0);
  placeFinderPattern(0, size - 7);
  placeFinderPattern(size - 7, 0);

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    grid[6][i] = i % 2 === 0;
    grid[i][6] = i % 2 === 0;
  }

  // Deterministic hash stream from seed
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const inTopLeft = r < 8 && c < 8;
      const inTopRight = r < 8 && c >= size - 8;
      const inBottomLeft = r >= size - 8 && c < 8;
      const onTiming = r === 6 || c === 6;
      if (inTopLeft || inTopRight || inBottomLeft || onTiming) {
        continue;
      }
      hash ^= (r * 31 + c * 17) & 0xff;
      hash = Math.imul(hash, 16777619);
      grid[r][c] = (Math.abs(hash) % 10) < 5;
    }
  }

  return grid;
}

/**
 * Calculates participation percentage for a member (90% participation rule).
 * New members with 0 appeals so far have 100% baseline compliance.
 */
export function calculateParticipationRate(
  appealsParticipated: number,
  appealsTotal: number
): number {
  if (appealsTotal <= 0) return 100;
  const clamped = Math.max(0, Math.min(appealsParticipated, appealsTotal));
  return Math.round((clamped / appealsTotal) * 1000) / 10;
}

/**
 * Evaluates the 90% Participation Rule (with 10% grace allowance).
 */
export function meetsParticipationRule(
  appealsParticipated: number,
  appealsTotal: number
): boolean {
  return calculateParticipationRate(appealsParticipated, appealsTotal) >= 90;
}

/**
 * Evaluates age eligibility under the PBSCN Constitution:
 * Registration open to individuals aged 18 to 60; coverage active up to 62.
 */
export function evaluateAgeEligibility(
  dobIso: string,
  referenceDateIso = '2026-10-23'
): {
  ageYears: number;
  canRegister: boolean;
  isCoverageActive: boolean;
  reasonHi: string;
} {
  const dob = new Date(dobIso);
  const ref = new Date(referenceDateIso);
  if (Number.isNaN(dob.getTime()) || Number.isNaN(ref.getTime())) {
    return {
      ageYears: 0,
      canRegister: false,
      isCoverageActive: false,
      reasonHi: 'अमान्य जन्मतिथि प्रारूप',
    };
  }

  let age = ref.getUTCFullYear() - dob.getUTCFullYear();
  const monthDiff = ref.getUTCMonth() - dob.getUTCMonth();
  if (monthDiff < 0 || (monthDiff === 0 && ref.getUTCDate() < dob.getUTCDate())) {
    age--;
  }

  const canRegister = age >= 18 && age <= 60;
  const isCoverageActive = age >= 18 && age <= 62;

  let reasonHi = 'बिल्कुल सही! आप नया रजिस्ट्रेशन और परिवार सुरक्षा कवर दोनों के लिए पूरी तरह एलिजिबल हैं (18–60 साल)।';
  if (age < 18) {
    reasonHi = 'कम से कम 18 साल की उम्र होना ज़रूरी है।';
  } else if (age > 60 && age <= 62) {
    reasonHi = '60 साल के बाद नया रजिस्ट्रेशन बंद है, लेकिन पुराने मेंबर्स का सुरक्षा कवर 62 साल की उम्र तक चालू रहता है।';
  } else if (age > 62) {
    reasonHi = 'नियम नंबर 4 के मुताबिक 62 साल की उम्र पूरी होने पर सुरक्षा कवर ख़त्म हो जाता है।';
  }

  return { ageYears: age, canRegister, isCoverageActive, reasonHi };
}

/**
 * Calculates whether a member has completed the mandatory 18-month lock-in period
 * and returns days/months completed.
 */
export function evaluateLockInPeriod(
  dojIso: string,
  referenceDateIso = '2026-10-23',
  requiredMonths = 18
): {
  monthsCompleted: number;
  isLockInComplete: boolean;
  remainingMonths: number;
  maturityDateIso: string;
} {
  const doj = new Date(dojIso);
  const ref = new Date(referenceDateIso);
  if (Number.isNaN(doj.getTime()) || Number.isNaN(ref.getTime())) {
    return {
      monthsCompleted: 0,
      isLockInComplete: false,
      remainingMonths: requiredMonths,
      maturityDateIso: '',
    };
  }

  const totalMonths =
    (ref.getUTCFullYear() - doj.getUTCFullYear()) * 12 +
    (ref.getUTCMonth() - doj.getUTCMonth()) -
    (ref.getUTCDate() < doj.getUTCDate() ? 1 : 0);

  const monthsCompleted = Math.max(0, totalMonths);
  const isLockInComplete = monthsCompleted >= requiredMonths;
  const remainingMonths = Math.max(0, requiredMonths - monthsCompleted);

  const maturity = new Date(Date.UTC(doj.getUTCFullYear(), doj.getUTCMonth() + requiredMonths, doj.getUTCDate()));
  const maturityDateIso = maturity.toISOString().slice(0, 10);

  return {
    monthsCompleted,
    isLockInComplete,
    remainingMonths,
    maturityDateIso,
  };
}

/**
 * Evaluates eligibility for Rashtramata Savitribai Phule Kanyadan Scheme:
 * 1) At least 12 months (1 year) active membership
 * 2) >= 90% participation in previous bereavement appeals
 * 3) Application submitted at least 90 days (3 months) prior to wedding date
 */
export function evaluateKanyadanEligibility(params: {
  membershipMonths: number;
  participationRate: number;
  daysBeforeMarriage: number;
  vyawasthaShulkActive: boolean;
}): {
  eligible: boolean;
  estimatedGrantInr: number;
  reasons: string[];
} {
  const reasons: string[] = [];

  if (params.membershipMonths < 12) {
    reasons.push(`मेंबरशिप को कम से कम 1 साल (12 महीने) पूरा होना चाहिए (अभी: ${params.membershipMonths} महीने)।`);
  }
  if (params.participationRate < 90) {
    reasons.push(`पिछले मदद अलर्ट्स में कम से कम 90% साथ देना ज़रूरी है (अभी: ${params.participationRate.toFixed(1)}%)।`);
  }
  if (params.daysBeforeMarriage < 90) {
    reasons.push(`शादी की तारीख़ से कम से कम 90 दिन (3 महीने) पहले फॉर्म भरना ज़रूरी है (अभी: ${params.daysBeforeMarriage} दिन पहले)।`);
  }
  if (!params.vyawasthaShulkActive) {
    reasons.push('सालाना ट्रस्ट फीस (Annual Trust Fee) रिन्यू होनी चाहिए।');
  }

  const eligible = reasons.length === 0;
  // Scale grant between ₹2,00,000 and ₹5,00,000 based on seniority and participation
  let estimatedGrantInr = 0;
  if (eligible) {
    const seniorityBonus = Math.min(3, Math.floor(params.membershipMonths / 12)) * 75000;
    const fullComplianceBonus = params.participationRate >= 98 ? 75000 : 0;
    estimatedGrantInr = Math.min(500000, 200000 + seniorityBonus + fullComplianceBonus);
  }

  return { eligible, estimatedGrantInr, reasons };
}

/**
 * Filters the public member directory by search query, cadre, district, and status.
 */
export function filterMembers(
  members: MemberRecord[],
  filters: {
    query: string;
    cadre: 'ALL' | CadreCode;
    district: string;
    status: 'ALL' | MemberStatus;
  }
): MemberRecord[] {
  const q = filters.query.trim().toLowerCase();

  return members.filter((m) => {
    if (filters.cadre !== 'ALL' && m.cadre !== filters.cadre) {
      return false;
    }
    if (filters.district !== 'ALL' && m.district.toLowerCase() !== filters.district.toLowerCase()) {
      return false;
    }
    if (filters.status !== 'ALL' && m.status !== filters.status) {
      return false;
    }
    if (q.length > 0) {
      const matchesName = m.full_name.toLowerCase().includes(q);
      const matchesId = m.member_id.toLowerCase().includes(q);
      const matchesPhone = m.phone.toLowerCase().includes(q);
      const matchesDistrict = m.district.toLowerCase().includes(q);
      const matchesNominee = m.nominee.name.toLowerCase().includes(q);
      return matchesName || matchesId || matchesPhone || matchesDistrict || matchesNominee;
    }
    return true;
  });
}

/**
 * Validates UTR / UPI Transaction ID format (minimum 8 alphanumeric characters)
 */
export function isValidUtrNumber(utr: string): boolean {
  const cleaned = utr.trim();
  return /^[A-Za-z0-9-]{8,28}$/.test(cleaned);
}

export function formatINR(amount: number): string {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

