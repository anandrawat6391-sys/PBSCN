"use client";

import React, { useState } from "react";
import MurmurationWordmark, {
  MurmurationPreset,
} from "./ui/murmuration-wordmark";
import { DhammaChakraIcon } from "./DhammaChakraIcon";
import { Sparkles, MousePointer, RefreshCw } from "lucide-react";
import { LangMode, t } from "../utils/i18n";

export default function MurmurationDemo({ lang = "en" }: { lang?: LangMode }) {
  const [currentWord, setCurrentWord] = useState("JAI BHIM");
  const [preset, setPreset] = useState<MurmurationPreset>("dusk");
  const [birdsCount, setBirdsCount] = useState(4200);

  const presets: { id: MurmurationPreset; label: string }[] = [
    { id: "dusk", label: "Dusk / गोधूलि" },
    { id: "ambedkarite", label: "Ambedkarite Deep Blue" },
    { id: "night", label: "Night / नील गगन" },
    { id: "dawn", label: "Dawn / प्रभात" },
  ];

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative">
      {/* Top Banner Control Bar */}
      <div className="bg-slate-950/80 backdrop-blur-md px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-amber-400 font-extrabold tracking-wide">
          <DhammaChakraIcon size={18} className="text-amber-400 animate-spin-slow" />
          <span className="uppercase font-mono-tabular">
            {t(
              lang,
              "Sovereign Flock Simulation · Murmuration Wordmark",
              "सामूहिक संप्रभुता सिमुलेशन · स्टारलिंग मर्म्युरेशन"
            )}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Preset Buttons */}
          <div className="inline-flex rounded-lg border border-slate-700 bg-slate-800 p-0.5">
            {presets.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPreset(p.id)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                  preset === p.id
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Quick Word Toggles */}
          <div className="inline-flex rounded-lg border border-slate-700 bg-slate-800 p-0.5">
            {["JAI BHIM", "PRABUDDHA", "EQUALITY", "EDUCATE"].map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => setCurrentWord(w)}
                className={`px-2 py-1 rounded-md text-[11px] font-mono-tabular font-bold transition-all cursor-pointer ${
                  currentWord === w
                    ? "bg-amber-400 text-slate-950 font-black shadow-xs"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {w}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Murmuration Canvas Container */}
      <div className="relative w-full">
        <MurmurationWordmark
          word={currentWord}
          birds={birdsCount}
          preset={preset}
          flyFor={5}
          holdFor={3.8}
          height="420px"
          interactive={true}
          reeds={true}
        >
          {/* Overlay elements over the flying flock */}
          <div className="absolute top-4 left-4 pointer-events-none select-none">
            <div className="inline-flex items-center gap-2 bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-amber-400/30 text-[11px] text-amber-200 shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>
                {t(
                  lang,
                  `Flock of 4,200 starlings gathers into "${currentWord}"`,
                  `4,200 पक्षियों का झुंड संगठित होकर रचता है: "${currentWord}"`
                )}
              </span>
            </div>
          </div>

          <div className="absolute bottom-4 right-4 pointer-events-none select-none hidden sm:block">
            <div className="inline-flex items-center gap-1.5 bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700 text-[11px] text-slate-300 shadow-md">
              <MousePointer className="w-3.5 h-3.5 text-sky-400" />
              <span>
                {t(
                  lang,
                  "Move mouse/touch over canvas — pointer acts as a hawk!",
                  "कैनवास पर कर्सर या उंगली घुमाएं — कर्सर से परिंदे अलग होते हैं!"
                )}
              </span>
            </div>
          </div>
        </MurmurationWordmark>
      </div>

      {/* Bottom Citation Footnote */}
      <div className="bg-slate-950/90 px-4 py-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>
            {t(
              lang,
              'Symbol of Solidarity: "Alone we are scattered; united we form the invincible truth."',
              'एकता का प्रतीक: "अकेले हम बिखरे हैं; संगठित होकर हम अजेय शक्ति बनते हैं।"'
            )}
          </span>
        </div>
        <div className="font-mono-tabular text-slate-500">
          60 FPS Pure 2D Batched Vectors · Zero External Assets
        </div>
      </div>
    </div>
  );
}
