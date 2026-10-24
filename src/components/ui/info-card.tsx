"use client";

import React from "react";
import { Star, MessageCircle, UserPlus, ShieldCheck, HeartHandshake } from "lucide-react";
import { cn } from "@/lib/utils";

export type ProfileCardProps = {
  name: string;
  role: string;
  status: "online" | "offline" | "away";
  avatar: string;
  tags?: string[];
  isVerified?: boolean;
  followers?: number;
  aidAmount?: string;
  district?: string;
  onAction?: () => void;
};

export function ProfileCard({
  name,
  role,
  status,
  avatar,
  tags = [],
  isVerified,
  followers,
  aidAmount,
  district,
  onAction,
}: ProfileCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-3xl bg-[#FCFAF7] border border-[#E7E2DA] p-6 w-80 shadow-[12px_12px_26px_rgba(0,0,0,0.06),-10px_-10px_24px_rgba(255,255,255,0.95)] transition-all duration-500 hover:shadow-[18px_18px_38px_rgba(0,0,0,0.1),-12px_-12px_32px_rgba(255,255,255,1)] hover:scale-105 hover:-translate-y-2">
      {/* Status indicator with pulse animation */}
      <div className="absolute right-4 top-4 z-10">
        <div className="relative">
          <div
            className={cn(
              "h-3 w-3 rounded-full border-2 border-white transition-all duration-300 group-hover:scale-125",
              status === "online"
                ? "bg-emerald-500 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.6)]"
                : status === "away"
                  ? "bg-amber-500"
                  : "bg-stone-400"
            )}
          />
          {status === "online" && (
            <div className="absolute inset-0 h-3 w-3 rounded-full bg-emerald-500 animate-ping opacity-30" />
          )}
        </div>
      </div>

      {/* Verified badge with bounce animation */}
      {isVerified && (
        <div className="absolute right-4 top-10 z-10">
          <div className="rounded-full bg-amber-500 p-1 shadow-[2px_2px_4px_rgba(0,0,0,0.1)] transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 group-hover:shadow-[0_0_15px_rgba(245,158,11,0.5)]">
            <Star className="h-3 w-3 fill-white text-white" />
          </div>
        </div>
      )}

      {/* Profile Photo / Avatar with soft clay inset depth */}
      <div className="mb-4 flex justify-center relative z-10">
        <div className="relative group-hover:scale-105 transition-transform duration-500">
          <div className="h-28 w-28 overflow-hidden rounded-full bg-[#F5F1E8] p-1.5 shadow-[inset_4px_4px_10px_rgba(0,0,0,0.08),inset_-4px_-4px_10px_rgba(255,255,255,0.9)] transition-all duration-500 group-hover:shadow-[inset_6px_6px_14px_rgba(0,0,0,0.12),inset_-6px_-6px_14px_rgba(255,255,255,1)]">
            <img
              src={avatar}
              alt={name}
              className="h-full w-full rounded-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          {/* Glowing ring on hover */}
          <div className="absolute inset-0 rounded-full border-2 border-amber-400 opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse" />
        </div>
      </div>

      {/* Profile Info with slide-up animation */}
      <div className="text-center relative z-10 transition-transform duration-300 group-hover:-translate-y-1">
        <h3 className="text-lg font-extrabold text-stone-900 transition-colors duration-300 group-hover:text-amber-800">
          {name}
        </h3>
        <p className="mt-1 text-xs font-semibold text-stone-600 transition-colors duration-300">
          {role}
        </p>

        {district && (
          <p className="mt-0.5 text-[11px] font-medium text-stone-500 font-mono-tabular">
            {district}
          </p>
        )}

        {aidAmount && (
          <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-mono-tabular font-extrabold shadow-2xs">
            <HeartHandshake className="w-3.5 h-3.5 text-amber-600" />
            <span>{aidAmount}</span>
          </div>
        )}

        {followers && (
          <p className="mt-2 text-xs text-stone-500 transition-all duration-300 group-hover:text-amber-700 group-hover:font-medium">
            {followers.toLocaleString()} members supported
          </p>
        )}
      </div>

      {/* Tags with bounce animation */}
      {tags.length > 0 && (
        <div className="mt-4 flex flex-wrap justify-center gap-1.5 relative z-10">
          {tags.map((tag, i) => (
            <span
              key={i}
              className={cn(
                "inline-block rounded-full bg-white px-3 py-1 text-[11px] font-extrabold shadow-[2px_2px_4px_rgba(0,0,0,0.04),-2px_-2px_4px_rgba(255,255,255,0.9)] border border-[#E7E2DA] transition-all duration-300",
                tag === "Premium" || tag === "Cadre A" || tag === "Verified"
                  ? "text-amber-900 group-hover:bg-amber-50 group-hover:scale-105 group-hover:shadow-[0_0_10px_rgba(245,158,11,0.25)]"
                  : "text-stone-700 group-hover:scale-105"
              )}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Action Buttons in Tactile Cream/White */}
      <div className="mt-5 flex gap-2 relative z-10">
        <button
          type="button"
          onClick={onAction}
          className="flex-1 rounded-2xl bg-white hover:bg-stone-50 py-3 text-xs font-extrabold text-stone-900 shadow-[4px_4px_10px_rgba(0,0,0,0.05),-3px_-3px_8px_rgba(255,255,255,0.9)] transition-all duration-300 hover:shadow-[2px_2px_5px_rgba(0,0,0,0.03)] hover:scale-98 active:scale-95 border border-[#E7E2DA] flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <UserPlus className="h-4 w-4 text-amber-600 transition-transform duration-300 hover:scale-110" />
          <span>Connect</span>
        </button>
        <button
          type="button"
          onClick={onAction}
          className="flex-1 rounded-2xl bg-white hover:bg-stone-50 py-3 text-xs font-extrabold text-stone-700 shadow-[4px_4px_10px_rgba(0,0,0,0.05),-3px_-3px_8px_rgba(255,255,255,0.9)] transition-all duration-300 hover:shadow-[2px_2px_5px_rgba(0,0,0,0.03)] hover:scale-98 active:scale-95 border border-[#E7E2DA] flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <MessageCircle className="h-4 w-4 text-stone-600 transition-transform duration-300 hover:scale-110" />
          <span>Sahyog</span>
        </button>
      </div>

      {/* Animated subtle border on hover */}
      <div className="absolute inset-0 rounded-3xl border border-amber-400/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </div>
  );
}

export default function AnimatedProfileCard() {
  const alexProfile: ProfileCardProps = {
    name: "Dr. Surendra K. Gautam",
    role: "Senior Medical Officer · Cadre A",
    status: "online",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80",
    tags: ["Verified", "Cadre A", "Bulandshahr"],
    isVerified: true,
    followers: 62410,
    aidAmount: "₹21.84L Raised",
    district: "Bulandshahr, Uttar Pradesh",
  };

  return (
    <div className="bg-[#FAF8F5] p-6 rounded-3xl border border-[#E7E2DA] flex items-center justify-center w-full relative overflow-hidden">
      <ProfileCard {...alexProfile} />
    </div>
  );
}

export function ProfileCardGrid() {
  const profiles: ProfileCardProps[] = [
    {
      name: "Dr. Surendra K. Gautam",
      role: "Senior Medical Officer · Cadre A",
      status: "online",
      avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80",
      tags: ["Cadre A", "Medical Officer"],
      isVerified: true,
      followers: 62410,
      aidAmount: "₹21,84,350",
      district: "Bulandshahr",
    },
    {
      name: "Master Ramprakash Ambedkar",
      role: "Senior Science Teacher · Cadre B",
      status: "online",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
      tags: ["Cadre B", "Education"],
      isVerified: true,
      followers: 61415,
      aidAmount: "₹21,49,525",
      district: "Prayagraj",
    },
    {
      name: "Smt. Anita Shakya",
      role: "SHG Coordinator · Cadre D",
      status: "away",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
      tags: ["Cadre D", "Grassroots"],
      isVerified: true,
      followers: 60310,
      aidAmount: "₹21,10,850",
      district: "Ambedkar Nagar",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
      {profiles.map((p, idx) => (
        <ProfileCard key={idx} {...p} />
      ))}
    </div>
  );
}
