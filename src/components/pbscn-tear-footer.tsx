"use client";

import React from "react";
import PushpinTearFooter from "./ui/pushpin-tear-footer";
import { DhammaChakraIcon } from "./DhammaChakraIcon";
import { LangMode, t } from "../utils/i18n";

export default function PbscnTearFooter({ lang = "en" }: { lang?: LangMode }) {
  return (
    <div className="w-full mt-10 rounded-2xl overflow-hidden border border-slate-200/80 shadow-xl">
      <PushpinTearFooter
        brand="PBSCN."
        name="prabuddha bharat swabhiman nyas"
        logoHref="#"
        logo={
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <DhammaChakraIcon size={22} />
            </div>
            <span className="font-extrabold text-sm tracking-tight text-white">
              {lang === "en" ? "PBSCN" : "प्रबुद्ध भारत"}
            </span>
          </div>
        }
        sheet="#1E40AF"
        paper="#0F172A"
        sheetInk="#FFFFFF"
        paperInk="#FBBF24"
        seed={42}
        email="solidarity@pbscn.org"
        newsletter={{
          label:
            lang === "en"
              ? "Constitutional Mutual Aid Ledger · Monthly Directives"
              : "संवैधानिक आपसी सहयोग पत्रिका · मासिक डायरेक्ट्री",
          placeholder:
            lang === "en" ? "Enter your email for audit digests" : "ईमेल दर्ज करें",
        }}
        status={{
          label:
            lang === "en"
              ? "62,410 Active Members · 100% Direct P2P Security"
              : "62,410 सक्रिय सदस्य · 100% सीधा बैंक ट्रांसफर",
          href: "#",
        }}
        mark="REGD. 1882 · UP/LCK"
        timeZone="Asia/Kolkata"
        timeLabel="IST"
        socials={[
          { icon: "globe", label: "Official Portal", href: "#" },
          { icon: "shield", label: "Audit Ledger", href: "#" },
          { icon: "chat", label: "Helpline 1800-180-5656", href: "#" },
        ]}
        columns={[
          {
            title: lang === "en" ? "solidarity" : "सहयोग",
            links: [
              {
                label:
                  lang === "en"
                    ? "Sahyog Alert #09 (3 Cases)"
                    : "सक्रिय सहयोग अलर्ट 09",
                href: "#",
              },
              {
                label:
                  lang === "en"
                    ? "Member Directory (user_list)"
                    : "सदस्य डायरेक्टरी",
                href: "#",
              },
              {
                label:
                  lang === "en"
                    ? "Annual Trust Fund (₹51/101)"
                    : "वार्षिक व्यवस्था शुल्क",
                href: "#",
              },
            ],
            cta: {
              label: lang === "en" ? "join network." : "सदस्य बनें.",
              href: "#",
            },
          },
          {
            title: lang === "en" ? "constitution" : "संविधान",
            links: [
              {
                label:
                  lang === "en"
                    ? "22-Rule Niyamawali"
                    : "22-सूत्रीय नियमावली",
                href: "#",
              },
              {
                label:
                  lang === "en"
                    ? "18-Month Lock-in Policy"
                    : "18-माह लॉक-इन नियम",
                href: "#",
              },
              {
                label:
                  lang === "en"
                    ? "Savitribai Phule Kanyadan"
                    : "सावित्रीबाई फुले कन्यादान",
                href: "#",
              },
            ],
            cta: {
              label: lang === "en" ? "audit desk." : "ऑडिट सेल.",
              href: "mailto:solidarity@pbscn.org",
            },
          },
        ]}
        sideLinks={[
          {
            icon: "shield",
            label: lang === "en" ? "Zero Commission" : "शून्य कमीशन",
            href: "#",
          },
          {
            icon: "doc",
            label: lang === "en" ? "Trust Deed" : "ट्रस्ट डीड",
            href: "#",
          },
        ]}
        chat={{ label: lang === "en" ? "helpline" : "सहायता" }}
        copyright="© 2026 Prabuddha Bharat Swabhiman Nyas (PBSCN)"
        credit="Pay Back to Society · Educate, Agitate, Organise"
        handle={{ label: "@pbscn.trust", href: "#" }}
      />
    </div>
  );
}
