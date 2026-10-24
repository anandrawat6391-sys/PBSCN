"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface GradientBlobCardProps {
  title?: string;
  subtitle?: string;
  metric?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  cardClassName?: string;
  blobGradient?: string;
  width?: string;
  height?: string;
  onClick?: () => void;
}

export const GradientBlobCard: React.FC<GradientBlobCardProps> = ({
  title,
  subtitle,
  metric,
  icon,
  children,
  className,
  cardClassName,
  blobGradient = "bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500",
  width = "w-[200px]",
  height = "h-[250px]",
  onClick,
}) => {
  return (
    <div className={cn("flex items-center justify-center p-2", className)}>
      <div
        onClick={onClick}
        className={cn(
          "relative rounded-[14px] flex flex-col items-center justify-center",
          "shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff] dark:shadow-[20px_20px_60px_#111,-20px_-20px_60px_#222]",
          "overflow-hidden transition-all duration-300 hover:scale-105 cursor-pointer",
          width,
          height,
          cardClassName
        )}
      >
        {/* Glassy Background & Foreground Content */}
        <div className="absolute inset-[5px] bg-white/95 dark:bg-black/70 backdrop-blur-[24px] rounded-[10px] outline outline-2 outline-white dark:outline-gray-700 z-10 flex flex-col items-center justify-center p-4 text-center select-none">
          {children ? (
            children
          ) : (
            <>
              {icon && <div className="mb-2 text-stone-900 dark:text-amber-400">{icon}</div>}
              {metric && (
                <div className="text-xl font-extrabold font-mono-tabular text-stone-900 dark:text-white tracking-tight">
                  {metric}
                </div>
              )}
              {title && (
                <div className="text-xs font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-300 mt-1">
                  {title}
                </div>
              )}
              {subtitle && (
                <p className="text-[11px] text-stone-600 dark:text-stone-300 mt-1 leading-tight font-medium">
                  {subtitle}
                </p>
              )}
            </>
          )}
        </div>

        {/* Animated Gradient Blob (same bold colors for light & dark mode) */}
        <div
          className={cn(
            "absolute top-1/2 left-1/2 w-[150px] h-[150px] rounded-full opacity-100",
            "filter blur-[12px] z-0 animate-blob",
            blobGradient
          )}
        />

        {/* Inline keyframes animation */}
        <style>
          {`
            @keyframes blob {
              0% {
                transform: translate(-100%, -100%);
              }
              25% {
                transform: translate(0%, -100%);
              }
              50% {
                transform: translate(0%, 0%);
              }
              75% {
                transform: translate(-100%, 0%);
              }
              100% {
                transform: translate(-100%, -100%);
              }
            }

            .animate-blob {
              animation: blob 5s linear infinite;
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default GradientBlobCard;
