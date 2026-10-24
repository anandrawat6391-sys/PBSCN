"use client";
import React from "react";
import { CardStack, Card } from "./ui/card-stack";
import { cn } from "@/lib/utils";
import { LangMode, t } from "../utils/i18n";

export const Highlight = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <span
      className={cn(
        "font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-sm",
        className
      )}
    >
      {children}
    </span>
  );
};

export function CardStackDemo({ lang = "en" }: { lang?: LangMode }) {
  const cards: Card[] = [
    {
      id: 0,
      name:
        lang === "en"
          ? "Smt. Devender Singh (Nominee · Case PB-CASE-01)"
          : "देवेन्द्र सिंह (नॉमिनी · केस PB-CASE-01 बुलंदशहर)",
      designation:
        lang === "en"
          ? "Family of Late Dr. Surendra Kumar Gautam · Cadre A"
          : "दिवंगत डॉ. सुरेन्द्र कुमार गौतम का परिवार · संवर्ग A",
      content:
        lang === "en" ? (
          <p>
            When Dr. Surendra passed away on duty, our family was in shock. Within
            days, <Highlight>62,410 brothers and sisters</Highlight> transferred
            ₹35 directly into my SBI account, raising{" "}
            <Highlight>₹21,84,350 with zero cut</Highlight>. Babasaheb’s vision of
            Pay Back to Society saved our children’s education.
          </p>
        ) : (
          <p>
            डॉ. सुरेन्द्र के आकस्मिक निधन के बाद परिवार टूट गया था। लेकिन कुछ ही
            दिनों में <Highlight>62,410 भाइयों और बहनों</Highlight> ने सीधे मेरे
            SBI खाते में ₹35 भेजे, जिससे{" "}
            <Highlight>बिना किसी कटौती के ₹21,84,350</Highlight> की सीधी मदद
            मिली।
          </p>
        ),
    },
    {
      id: 1,
      name:
        lang === "en"
          ? "IAS (Retd.) R.P. Siddharth"
          : "IAS (सेवानिवृत्त) आर.पी. सिद्धार्थ",
      designation:
        lang === "en"
          ? "Chief Mentor · Babasaheb UPSC & PSC Fellowship (Cadre A)"
          : "मुख्य मेंटर · बाबासाहेब UPSC एवं PSC फेलोशिप (संवर्ग A)",
      content:
        lang === "en" ? (
          <p>
            Commercial insurance companies profit off fear. PBSCN is{" "}
            <Highlight>100% Direct Peer-to-Peer Solidarity</Highlight>. Along with
            bereavement security, our Sunday mentorship board has guided{" "}
            <Highlight>142+ community students</Highlight> into Civil Services and
            IIT/AIIMS.
          </p>
        ) : (
          <p>
            प्राइवेट बीमा कंपनियां मुनाफ़ा कमाती हैं, लेकिन PBSCN{" "}
            <Highlight>100% सीधा आपसी भाईचारा</Highlight> है। परिवार सुरक्षा के
            साथ-साथ हमारे मेंटरशिप बोर्ड ने{" "}
            <Highlight>142+ मेधावी छात्रों</Highlight> को सिविल सेवा के लिए तैयार
            किया है।
          </p>
        ),
    },
    {
      id: 2,
      name:
        lang === "en"
          ? "Adv. Priyanka Bauddh (LLM)"
          : "एडवोकेट प्रियंका बौद्ध (हाई कोर्ट, प्रयागराज)",
      designation:
        lang === "en"
          ? "5-Member Physical Verification & Legal Audit Cell · Cadre C"
          : "5-सदस्यीय भौतिक सत्यापन एवं विधिक ऑडिट सेल · संवर्ग C",
      content:
        lang === "en" ? (
          <p>
            Every active bereavement appeal undergoes{" "}
            <Highlight>on-ground 48-hour verification</Highlight> by our 5-member
            district committee. Both the{" "}
            <Highlight>18-Month Lock-in</Highlight> and{" "}
            <Highlight>90% Participation Rule</Highlight> are enforced
            transparently on the public ledger.
          </p>
        ) : (
          <p>
            हर दिवंगत केस में हमारी 5-सदस्यीय जिला कमेटी{" "}
            <Highlight>48 घंटे में घर जाकर भौतिक सत्यापन</Highlight> करती है।{" "}
            <Highlight>18-माह लॉक-इन</Highlight> और{" "}
            <Highlight>90% सहयोग नियम</Highlight> से नेटवर्क अटूट रहता है।
          </p>
        ),
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center w-full py-6">
      <CardStack items={cards} />
      <p className="mt-4 text-[11px] font-medium text-slate-500">
        {t(
          lang,
          "Auto-rotates every 5 seconds · Click any card to flip immediately",
          "हर 5 सेकंड में अपने-आप बदलता है · तुरंत अगला कार्ड देखने के लिए कार्ड पर क्लिक करें"
        )}
      </p>
    </div>
  );
}
