"use client";
import React, { useState } from "react";
import {
  DraggableCardBody,
  DraggableCardContainer,
} from "@/src/components/ui/draggable-card";
import { RotateCcw, Move } from "lucide-react";
import { LangMode, t } from "../utils/i18n";

interface SolidarityCardItem {
  id: string;
  titleEn: string;
  titleHi: string;
  subtitleEn: string;
  subtitleHi: string;
  metric: string;
  accentColor: string;
  bgGradient: string;
  className: string;
  emblemType: "chakra" | "stupa" | "shield" | "scholar" | "kanyadan";
}

function CardArtworkSvg({
  type,
  accent,
  metric,
}: {
  type: SolidarityCardItem["emblemType"];
  accent: string;
  metric: string;
}) {
  return (
    <svg
      viewBox="0 0 260 200"
      className="pointer-events-none relative z-10 h-48 w-full rounded-xl border border-slate-200/80 shadow-xs"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`bg-${type}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0F172A" />
          <stop offset="100%" stopColor={accent} />
        </linearGradient>
      </defs>
      <rect width="260" height="200" rx="12" fill={`url(#bg-${type})`} />
      <circle
        cx="130"
        cy="88"
        r="54"
        fill="none"
        stroke="#FBBF24"
        strokeWidth="1.5"
        strokeDasharray="4 3"
        strokeOpacity="0.6"
      />
      {type === "chakra" && (
        <g transform="translate(130, 88)">
          <circle r="36" fill="none" stroke="#FBBF24" strokeWidth="3" />
          {Array.from({ length: 24 }, (_, i) => i * 15).map((deg) => (
            <line
              key={deg}
              x1="0"
              y1="0"
              x2="0"
              y2="-34"
              stroke="#FBBF24"
              strokeWidth="1.5"
              transform={`rotate(${deg})`}
            />
          ))}
          <circle r="7" fill="#FBBF24" />
        </g>
      )}
      {type === "stupa" && (
        <g>
          <path
            d="M82 122 C82 74, 178 74, 178 122 Z"
            fill="#1E40AF"
            stroke="#FBBF24"
            strokeWidth="2.5"
          />
          <rect
            x="116"
            y="60"
            width="28"
            height="12"
            rx="2"
            fill="#FBBF24"
          />
          <line
            x1="130"
            y1="40"
            x2="130"
            y2="60"
            stroke="#FBBF24"
            strokeWidth="3"
          />
          <rect
            x="70"
            y="122"
            width="120"
            height="10"
            rx="3"
            fill="#93C5FD"
          />
        </g>
      )}
      {type === "shield" && (
        <g>
          <path
            d="M130 44 L172 62 V94 C172 120 152 138 130 146 C108 138 88 120 88 94 V62 L130 44 Z"
            fill="#1E3A8A"
            stroke="#FBBF24"
            strokeWidth="2.5"
          />
          <path
            d="M114 94 L125 105 L148 80"
            fill="none"
            stroke="#34D399"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      )}
      {type === "scholar" && (
        <g>
          <polygon
            points="130,50 182,74 130,98 78,74"
            fill="#1D4ED8"
            stroke="#FBBF24"
            strokeWidth="2.5"
          />
          <path
            d="M98 86 V114 C98 124 162 124 162 114 V86"
            fill="none"
            stroke="#93C5FD"
            strokeWidth="2.5"
          />
          <line
            x1="176"
            y1="76"
            x2="176"
            y2="112"
            stroke="#FBBF24"
            strokeWidth="2.5"
          />
        </g>
      )}
      {type === "kanyadan" && (
        <g>
          <circle
            cx="114"
            cy="88"
            r="24"
            fill="none"
            stroke="#FBBF24"
            strokeWidth="3"
          />
          <circle
            cx="146"
            cy="88"
            r="24"
            fill="none"
            stroke="#F472B6"
            strokeWidth="3"
          />
        </g>
      )}
      <rect
        x="18"
        y="152"
        width="224"
        height="32"
        rx="6"
        fill="#0F172A"
        fillOpacity="0.82"
        stroke="#FFFFFF"
        strokeOpacity="0.15"
      />
      <text
        x="130"
        y="173"
        textAnchor="middle"
        fill="#FBBF24"
        fontSize="13"
        fontWeight="800"
        fontFamily="JetBrains Mono, Plus Jakarta Sans, sans-serif"
      >
        {metric}
      </text>
    </svg>
  );
}

export default function DraggableCardDemo({
  lang = "en",
}: {
  lang?: LangMode;
}) {
  const [resetKey, setResetKey] = useState(0);

  const items: SolidarityCardItem[] = [
    {
      id: "card-1",
      titleEn: "100% Direct P2P Sahyog",
      titleHi: "100% सीधा बैंक-टू-बैंक सहयोग",
      subtitleEn: "Zero Middleman · Direct to Nominee SBI/BOB A/C",
      subtitleHi: "बिना किसी बिचौलिए के सीधे नॉमिनी खाते में ट्रांसफर",
      metric: "₹35–₹50 → ₹35L+ Corpus",
      accentColor: "#1E3A8A",
      bgGradient: "from-blue-950 to-indigo-900",
      className: "absolute top-8 left-[8%] sm:left-[14%] rotate-[-6deg]",
      emblemType: "shield",
    },
    {
      id: "card-2",
      titleEn: "Savitribai Phule Kanyadan",
      titleHi: "सावित्रीबाई फुले कन्यादान सम्मान",
      subtitleEn: "Dignified Marriage Grant for Valid Members' Daughters",
      subtitleHi: "वैध सदस्यों की बेटियों के विवाह हेतु सम्मानजनक अनुदान",
      metric: "₹2,00,000 – ₹5,00,000",
      accentColor: "#831843",
      bgGradient: "from-rose-950 to-slate-900",
      className: "absolute top-20 left-[22%] sm:left-[28%] rotate-[5deg]",
      emblemType: "kanyadan",
    },
    {
      id: "card-3",
      titleEn: "Babasaheb UPSC/NEET Fellowship",
      titleHi: "बाबासाहेब उच्च शिक्षा फेलोशिप",
      subtitleEn: "Free Officer Mentorship + Coaching Grant",
      subtitleHi: "IAS/IPS व डॉक्टरों द्वारा निःशुल्क मार्गदर्शन व अनुदान",
      metric: "705+ Students Mentored",
      accentColor: "#1E40AF",
      bgGradient: "from-indigo-950 to-blue-900",
      className: "absolute top-6 left-[36%] sm:left-[44%] rotate-[-4deg]",
      emblemType: "scholar",
    },
    {
      id: "card-4",
      titleEn: "5-Member Physical Audit",
      titleHi: "5-सदस्यीय जिला भौतिक सत्यापन",
      subtitleEn: "On-Ground Verification Across 75 UP Districts",
      subtitleHi: "75 जिलों में घर जाकर 48 घंटे के भीतर भौतिक सत्यापन",
      metric: "75 District Committees",
      accentColor: "#065F46",
      bgGradient: "from-emerald-950 to-slate-900",
      className: "absolute top-24 left-[18%] sm:left-[52%] rotate-[7deg]",
      emblemType: "stupa",
    },
    {
      id: "card-5",
      titleEn: "Pay Back to Society Charter",
      titleHi: "प्रबुद्ध भारत स्वाभिमान मिशन",
      subtitleEn: "Educate · Agitate · Organise — 62,410 Strong",
      subtitleHi: "हम सबका, हम सबके लिए, हम सबके द्वारा — 62,410 सदस्य",
      metric: "₹28.45 Cr Delivered",
      accentColor: "#312E81",
      bgGradient: "from-slate-950 to-indigo-950",
      className: "absolute top-12 left-[15%] sm:left-[33%] rotate-[-2deg]",
      emblemType: "chakra",
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
          <Move className="w-4 h-4 text-blue-700" />
          <span>
            {t(
              lang,
              "Interactive 3D Physics Deck — Drag & Toss Cards to Explore Pillars",
              "इंटरएक्टिव 3D कार्ड्स — कार्ड्स को माउस/उंगली से पकड़कर इधर-उधर ड्रैग करें"
            )}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setResetKey((prev) => prev + 1)}
          className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t(lang, "Reset Deck", "कार्ड रीसेट करें")}</span>
        </button>
      </div>

      <DraggableCardContainer
        key={resetKey}
        className="relative flex h-[430px] w-full items-center justify-center overflow-clip rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-blue-50/50 shadow-inner"
      >
        <div className="pointer-events-none select-none text-center px-6 max-w-md">
          <p className="text-xs font-mono-tabular font-bold uppercase tracking-widest text-blue-700 mb-1">
            प्रबुद्ध भारत स्वाभिमान न्यास · PBSCN
          </p>
          <p className="text-xl sm:text-2xl font-black text-slate-300 leading-snug">
            {t(
              lang,
              '"Of Us All, For Us All, By Us All" — 100% Direct Peer-to-Peer Solidarity',
              '"हम सबका, हम सबके लिए, हम सबके द्वारा" — 100% सीधा आपसी भाईचारा'
            )}
          </p>
        </div>

        {items.map((item) => (
          <DraggableCardBody
            key={item.id}
            className={`${item.className} min-h-72 w-72 sm:w-76 bg-white dark:bg-white border border-slate-200/90 p-4 rounded-2xl shadow-xl cursor-grab active:cursor-grabbing`}
          >
            <CardArtworkSvg
              type={item.emblemType}
              accent={item.accentColor}
              metric={item.metric}
            />
            <h3 className="mt-3 text-center text-base font-extrabold text-slate-900">
              {lang === "en" ? item.titleEn : item.titleHi}
            </h3>
            <p className="mt-1 text-center text-xs text-slate-600 leading-relaxed">
              {lang === "en" ? item.subtitleEn : item.subtitleHi}
            </p>
          </DraggableCardBody>
        ))}
      </DraggableCardContainer>
    </div>
  );
}
