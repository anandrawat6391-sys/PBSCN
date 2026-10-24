import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildUpiPaymentUri,
  calculateParticipationRate,
  meetsParticipationRule,
  evaluateAgeEligibility,
  evaluateLockInPeriod,
  evaluateKanyadanEligibility,
  filterMembers,
  isValidUtrNumber,
  generateDeterministicQrMatrix,
  type MemberRecord,
} from './pbscnRules';

test('buildUpiPaymentUri constructs standard BharatQR UPI link with ₹35 contribution', () => {
  const uri = buildUpiPaymentUri({
    upiId: '34628180589@sbi',
    payeeName: 'Devender Singh',
    amount: 35,
    transactionNote: 'PBSCN Alert 09 PB-CASE-01',
  });
  assert.equal(
    uri,
    'upi://pay?pa=34628180589@sbi&pn=Devender%20Singh&am=35.00&cu=INR&tn=PBSCN%20Alert%2009%20PB-CASE-01'
  );
});

test('calculateParticipationRate and meetsParticipationRule enforce 90% threshold (10% grace)', () => {
  assert.equal(calculateParticipationRate(9, 10), 90);
  assert.equal(meetsParticipationRule(9, 10), true);
  assert.equal(calculateParticipationRate(8, 10), 80);
  assert.equal(meetsParticipationRule(8, 10), false);
  assert.equal(meetsParticipationRule(0, 0), true);
});

test('evaluateAgeEligibility enforces 18-60 registration and 62 coverage cap', () => {
  const validMember = evaluateAgeEligibility('1982-04-12', '2026-10-23');
  assert.equal(validMember.ageYears, 44);
  assert.equal(validMember.canRegister, true);
  assert.equal(validMember.isCoverageActive, true);

  const seniorActive = evaluateAgeEligibility('1965-05-01', '2026-10-23');
  assert.equal(seniorActive.ageYears, 61);
  assert.equal(seniorActive.canRegister, false);
  assert.equal(seniorActive.isCoverageActive, true);

  const underage = evaluateAgeEligibility('2012-01-01', '2026-10-23');
  assert.equal(underage.canRegister, false);
  assert.equal(underage.isCoverageActive, false);
});

test('evaluateLockInPeriod enforces 18-month mandatory lock-in', () => {
  const lockedIn = evaluateLockInPeriod('2025-08-10', '2026-10-23', 18);
  assert.equal(lockedIn.monthsCompleted, 14);
  assert.equal(lockedIn.isLockInComplete, false);
  assert.equal(lockedIn.remainingMonths, 4);

  const mature = evaluateLockInPeriod('2024-03-01', '2026-10-23', 18);
  assert.equal(mature.isLockInComplete, true);
  assert.equal(mature.remainingMonths, 0);
});

test('evaluateKanyadanEligibility validates 1-year seniority, 90% participation, and 90-day notice', () => {
  const eligibleResult = evaluateKanyadanEligibility({
    membershipMonths: 24,
    participationRate: 98.5,
    daysBeforeMarriage: 110,
    vyawasthaShulkActive: true,
  });
  assert.equal(eligibleResult.eligible, true);
  assert.equal(eligibleResult.estimatedGrantInr >= 200000, true);
  assert.equal(eligibleResult.reasons.length, 0);

  const ineligibleResult = evaluateKanyadanEligibility({
    membershipMonths: 8,
    participationRate: 85,
    daysBeforeMarriage: 45,
    vyawasthaShulkActive: true,
  });
  assert.equal(ineligibleResult.eligible, false);
  assert.equal(ineligibleResult.reasons.length, 3);
});

test('filterMembers filters accurately by query, cadre, district, and status', () => {
  const sampleMembers: MemberRecord[] = [
    {
      member_id: 'PB-2025-05709',
      full_name: 'Dr. Surendra Kumar Gautam',
      cadre: 'A',
      designation: 'Senior Medical Officer',
      dob: '1982-04-12',
      phone: '9876543210',
      email: 'surendra@example.com',
      district: 'Bulandshahr',
      state: 'Uttar Pradesh',
      doj: '2025-05-04',
      status: 'VALID',
      appeals_total: 20,
      appeals_participated: 20,
      vyawastha_shulk_valid_until: '2027-05-03',
      nominee: {
        name: 'Devender Singh',
        relation: 'SPOUSE',
        bank_name: 'State Bank of India',
        account_number: '34628180589',
        ifsc_code: 'SBIN0000669',
        upi_id: '34628180589@sbi',
      },
    },
    {
      member_id: 'PB-2026-08112',
      full_name: 'Er. Siddharth Bauddh',
      cadre: 'B',
      designation: 'Principal Software Architect',
      dob: '1993-09-18',
      phone: '9412345678',
      email: 'siddharth@example.com',
      district: 'Lucknow',
      state: 'Uttar Pradesh',
      doj: '2026-02-14',
      status: 'LOCK_IN',
      appeals_total: 5,
      appeals_participated: 5,
      vyawastha_shulk_valid_until: '2027-02-13',
      nominee: {
        name: 'Sujata Bauddh',
        relation: 'SPOUSE',
        bank_name: 'Bank of Baroda',
        account_number: '482100991234',
        ifsc_code: 'BARB0LUCKNX',
        upi_id: '482100991234@barodampay',
      },
    },
  ];

  assert.equal(
    filterMembers(sampleMembers, { query: '05709', cadre: 'ALL', district: 'ALL', status: 'ALL' }).length,
    1
  );
  assert.equal(
    filterMembers(sampleMembers, { query: '', cadre: 'B', district: 'Lucknow', status: 'LOCK_IN' }).length,
    1
  );
  assert.equal(
    filterMembers(sampleMembers, { query: '', cadre: 'C', district: 'ALL', status: 'ALL' }).length,
    0
  );
});

test('isValidUtrNumber and generateDeterministicQrMatrix work reliably', () => {
  assert.equal(isValidUtrNumber('UTR-202610198421'), true);
  assert.equal(isValidUtrNumber('429183746512'), true);
  assert.equal(isValidUtrNumber('123'), false);

  const matrix = generateDeterministicQrMatrix('upi://pay?pa=34628180589@sbi');
  assert.equal(matrix.length, 21);
  assert.equal(matrix[0].length, 21);
  assert.equal(matrix[0][0], true);
});
