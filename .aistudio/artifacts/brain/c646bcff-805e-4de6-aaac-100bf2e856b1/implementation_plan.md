# PBSCN Redesign: Crisp White & Deep Indigo Workspace in Everyday Bolchal Language

This plan redesigns the **प्रबुद्ध भारत स्वाभिमान न्यास (PBSCN)** platform into a clean, high-trust **Crisp Modern White & Deep Indigo** left-sidebar workspace, replacing heavy bureaucratic Hindi with warm, relatable **"Aam Bolchal ki Bhasa"** (everyday spoken Hindi, Urdu, and English terms written in Devanagari) while keeping all existing features, data models, and rules 100% intact.

## User Review & Critical Decisions

> [!IMPORTANT]
> All three core design and language preferences confirmed during clarification are locked into this blueprint while preserving every functional workflow from the original specification.

- **Confirmed Visual Theme**: **Crisp Modern White & Deep Indigo** — shifts from the dark obsidian theme to a bright, daylight-first institutional workspace (`#F8FAFC` canvas, `#FFFFFF` cards, `#1E3A8A` Deep Indigo brand structure, `#1D4ED8` interactive actions, and `#D97706` warm gold accents).
- **Confirmed Language & Tone ("Aam Bolchal ki Bhasa")**: **Devanagari script with everyday Hinglish-Urdu words** — replaces stiff Sanskritized terms (*पावती, नवीनीकरण, वैचारिक अधिष्ठान, उत्तराधिकारी*) with natural everyday phrasing (*रसीद, रिन्यूअल, बुनियादी सोच, परिवार का नॉमिनी, सीधा बैंक ट्रांसफर, बिना किसी बिचौलिए के*).
- **Confirmed Layout Architecture**: **Left Sidebar Workspace with Quick-Action Dashboard** — a dedicated `268px` left navigation rail on desktop (with a responsive mobile drawer), a clean top utility header, and a modular main workspace viewport.

---

## 1. Overview & Core Concept

- **What It Does**: Provides a 100% direct peer-to-peer mutual aid and family security workspace where 62,410+ community members across 4 Cadres (`Cadre A, B, C, D`) send micro-contributions (`₹35` to `₹50`) directly to a deceased member's family bank account, upload UTR payment receipts, verify member ID cards, renew annual operational trust fees (`₹51 / ₹101 / ₹500`), apply for Kanyadan marriage grants (`₹2L–₹5L`) and Babasaheb coaching fellowships, and check eligibility across all 22 rules.
- **Target Audience / Persona**: Working-class families, government and private employees, professionals, farmers, students, and grassroots community members across all 75 UP districts and national chapters who need an immediately understandable, zero-jargon interface.
- **Key Value**: High visual legibility in daylight conditions paired with warm, everyday language (*"इंसानियत और भाईचारे का सीधा साथ — मुसीबत के वक़्त हर परिवार के साथ हज़ारों हाथ"*) so any family member or nominee can use the platform effortlessly.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Left Sidebar Navigation & Quick-Action Strip**: Users land on the main workspace with persistent left-rail access to all 5 sections (*इमरजेंसी मदद अलर्ट*, *मेंबर लिस्ट और आईडी कार्ड*, *सालाना ट्रस्ट फीस*, *शादी व पढ़ाई मदद*, *22 नियम और शर्तें*), plus a top quick-action bar for instant UTR receipt upload or new member registration.
  2. **Emergency Sahyog Alert & Direct Transfer**: Users view verified bereavement case cards with dual bank account tabs (`खाता 1` / `खाता 2`), one-click Account/IFSC copy buttons, a scannable BharatQR code (`₹35` or `₹50`), and a side-by-side Receipt Upload & District Audit Ledger.
  3. **Live Member Directory & Digital ID Card**: Users search by name, Member ID, or phone number, filter by Cadre (`A, B, C, D`), District (75 UP districts + other states), and Status (`एक्टिव / वेरीफाइड` vs. `लॉक-इन पीरियड`), and open an official Digital ID Card modal with the 24-spoke Dhamma Chakra seal.
  4. **Annual Trust Fee, Kanyadan & Education Fellowship, and 22 Rules**: Users select `₹51 / ₹101 / ₹500` trust fee tiers with live QR updates, run the interactive Kanyadan & Lock-in calculators, and browse all 22 constitutional rules written in plain, conversational Hindustani.

- **Visual Identity & Theme**:
  - *Aesthetic Direction*: High-trust civic and institutional SaaS workspace — crisp, daylight-readable, structured with 1px slate hairlines and single-elevation cards.
  - *Color Palette & Mood*:
    - `--background`: `#F8FAFC` (Cool Alabaster Slate Canvas)
    - `--surface`: `#FFFFFF` (Pure Crisp White Cards & Sidebar)
    - `--primary`: `#1E3A8A` / `#1D4ED8` (Deep Ambedkarite Indigo & Royal Blue)
    - `--accent`: `#D97706` (Warm Dhamma Amber for highlights & seals)
    - `--text-primary`: `#0F172A` (Deep Slate Ink, >12:1 contrast)
    - `--text-secondary`: `#475569` (Muted Slate Prose)
    - `--border`: `#E2E8F0` (1px Crisp Hairline Dividers)
  - *Typography & Hierarchy*:
    - **Headings**: `Plus Jakarta Sans` + `Noto Sans Devanagari` (Bold 700, clean geometric authority).
    - **Body & Conversational Copy**: `Plus Jakarta Sans` + `Noto Sans Devanagari` (Regular 400 / Medium 500, relaxed line height for effortless Devanagari + English reading).
    - **Account Numbers, IFSC, Member IDs & Tabular Figures**: `JetBrains Mono` with `Plus Jakarta Sans` and `Noto Sans Devanagari` fallback (`tabular-nums`) so `₹` and Devanagari labels render crisply alongside monospace digits.
  - *Component Styling & Layout*:
    - Left Sidebar (`268px` fixed width on `lg+` screens) containing the brand lockup with the 24-spoke Dhamma Chakra, 5 primary workspace navigation buttons with live badge counts, the 4 Cadres quick summary, and a primary *"नया मेंबर जोड़ें (Join Network)"* CTA.
    - Main Workspace Canvas (`flex-1`) with a sticky contextual header bar (breadcrumb trail, active alert status, and quick UTR upload trigger) followed by a high-density Bento summary strip and the active module view.
- **Interactive Feedback & Motion**:
  - Instant inline confirmation on Account Number and IFSC copy actions (*"कॉपी हो गया!"*).
  - Smooth `150ms` tab transitions and modal dialogs with accessible backdrop dismissal.
  - Rotating 24-spoke Dhamma Chakra emblem (`prefers-reduced-motion` compliant).

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Everyday "Aam Bolchal" Language Transformation**
  - *Chosen Approach*: Rewrite all headings, instructions, statuses, and the 22 constitutional articles in natural spoken Hindi-Urdu-English (Hindustani in Devanagari script with familiar English words in parentheses where helpful).
  - *Why*: Working-class families and grassroots members find heavy bureaucratic words (*उत्तराधिकारी, पावती, अधिष्ठान*) intimidating; everyday words (*परिवार का नॉमिनी, पेमेंट की रसीद, बुनियादी मकसद, हक़ और ज़िम्मेदारी*) build immediate warmth and clarity.
  - *Alternatives Considered*: Roman script Hinglish was passed over because Devanagari remains the primary reading script across Uttar Pradesh districts while welcoming English/Urdu vocabulary naturally.

- **Decision 2: Left-Sidebar Workspace with Horizontal Case Cards**
  - *Chosen Approach*: Move primary navigation into a persistent left sidebar and arrange the bereavement cases, receipt upload form, and audit table into balanced 2-column and 3-column workspace panels.
  - *Why*: Eliminates vertical scrolling fatigue, keeps navigation one click away at all times, and gives financial data (Account numbers, IFSC codes, QR codes, and UTR ledgers) clean breathing room on a white daylight canvas.
  - *Alternatives Considered*: Keeping a top-only navigation bar was passed over per user preference for a left-sidebar workspace with a quick-action dashboard.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

### Architecture & Component Diagram

```
┌────────────────────────────────────────────────────────────────────────────┐
│                     PBSCN Workspace Application State                      │
│  • Active Sahyog Alerts (#09, #08)   • Live Member Directory (75 Districts)│
│  • Contribution Receipts Ledger      • Trust Fund & Welfare Applications   │
└──────────────────────────────────────┬─────────────────────────────────────┘
                                       │
         ┌─────────────────────────────┴─────────────────────────────┐
         ▼                                                           ▼
┌─────────────────────────────────┐       ┌──────────────────────────────────┐
│   Left Sidebar Navigation Rail  │       │    Main Workspace Viewport       │
│  • Brand & 24-Spoke Chakra      │       │  • Contextual Top Utility Header │
│  • 5 Core Module Switchers      │       │  • Quick-Action Metrics Ribbon   │
│  • 4 Cadres (A/B/C/D) Summary   │       │  • Active Module Canvas          │
│  • "नया मेंबर रजिस्टर करें" CTA    │       └─────────────────┬────────────────┘
└─────────────────────────────────┘                         │
                                                            ▼
         ┌──────────────────┬──────────────────┬────────────┴─────┬──────────────────┐
         ▼                  ▼                  ▼                  ▼                  ▼
┌────────────────┐ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐
│ इमरजेंसी मदद    │ │ मेंबर लिस्ट और  │ │ सालाना ट्रस्ट   │ │ शादी व पढ़ाई    │ │ 22 नियम और     │
│ अलर्ट           │ │ डिजिटल आईडी    │ │ फीस (₹51-₹500) │ │ मदद योजनाएं    │ │ शर्तें (कायदे)   │
│ • Case Cards   │ │ • Search/Filter│ │ • Tier Picker  │ │ • Kanyadan Calc│ │ • Age/Lock-in  │
│ • Dual Bank/QR │ │ • 75 Districts │ │ • Dynamic QR   │ │ • Mentors List │ │   Calculator   │
│ • UTR Upload   │ │ • ID Card Modal│ │ • 365d Receipt │ │ • Apply Form   │ │ • 22 Articles  │
└────────────────┘ └────────────────┘ └────────────────┘ └────────────────┘ └────────────────┘
```

### Data Model & State
- **MemberRecord**: Preserves `member_id` (`PB-2025-05709`), `full_name`, `cadre` (`A | B | C | D`), `dob`, `phone`, `district` (all 75 UP districts + national chapters), `doj`, `status` (`VALID | LOCK_IN | SUSPENDED`), participation counters, and `nominee` bank/UPI credentials.
- **SahyogAlert & BereavementCase**: Preserves Alert #09 (`सहयोग अलर्ट संख्या–09`) with 3 verified bereavement cases, dual bank accounts per case, `₹35` base contribution (`₹50` optional), and live raised totals.
- **ContributionReceipt**: Links `receipt_id`, `member_id`, `alert_number`, `case_id`, `amount_paid`, `utr_number`, `screenshot_url`, and `verification_status` (`PENDING | VERIFIED`).

### Interactive Component & State Mapping
- **Sidebar & Quick-Action Controls**: Clicking any of the 5 sidebar links or quick-action header buttons switches the active workspace view immediately and updates breadcrumb state.
- **Bereavement Case & BharatQR Controls**: Toggling `खाता 1` / `खाता 2` or `₹35` / `₹50` dynamically regenerates the BharatQR SVG matrix and `upi://pay` URI; clicking Copy Account/IFSC updates clipboard state and displays inline confirmation; submitting the UTR receipt form validates the Member ID and UTR format, appends the receipt to the audit table, and increments the case's raised total and contributor count.
- **Member Directory & ID Card Modal**: Typing in the search bar or changing Cadre, District, or Status dropdowns filters rows in real time; clicking *"डिजिटल आईडी कार्ड देखें"* opens the printable verification modal; submitting the New Member Registration modal validates age (18–60 years) and adds the new member (`LOCK_IN` status) to the directory.
- **Trust Fund, Welfare & Rules Calculators**: Selecting `₹51`, `₹101`, or `₹500` updates the Trust UPI QR and generates a 365-day validity receipt on form submission; modifying inputs in the Kanyadan or Lock-in/Age calculators recomputes eligibility and grant amounts live.
