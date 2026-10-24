"use client";
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";

export type Card = {
  id: number;
  name: string;
  designation: string;
  content: React.ReactNode;
};

export const CardStack = ({
  items,
  offset,
  scaleFactor,
}: {
  items: Card[];
  offset?: number;
  scaleFactor?: number;
}) => {
  const CARD_OFFSET = offset || 12;
  const SCALE_FACTOR = scaleFactor || 0.06;
  const [cards, setCards] = useState<Card[]>(items);

  useEffect(() => {
    setCards(items);
  }, [items]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCards((prevCards: Card[]) => {
        const newArray = [...prevCards];
        newArray.unshift(newArray.pop()!);
        return newArray;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const cycleNow = () => {
    setCards((prevCards: Card[]) => {
      const newArray = [...prevCards];
      newArray.unshift(newArray.pop()!);
      return newArray;
    });
  };

  return (
    <div className="relative h-64 w-full max-w-md md:h-64 md:w-96">
      {cards.map((card, index) => {
        return (
          <motion.div
            key={card.id}
            onClick={cycleNow}
            style={{
              transformOrigin: "top center",
            }}
            animate={{
              top: index * -CARD_OFFSET,
              scale: 1 - index * SCALE_FACTOR,
              zIndex: cards.length - index,
            }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 22,
            }}
            className="absolute inset-x-0 h-64 w-full rounded-2xl bg-white p-5 shadow-xl border border-slate-200/90 flex flex-col justify-between cursor-pointer select-none hover:border-blue-400 transition-colors"
          >
            <div className="font-normal text-slate-700 text-xs sm:text-sm leading-relaxed">
              {card.content}
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-slate-900 font-extrabold text-sm">
                  {card.name}
                </p>
                <p className="text-blue-800 font-semibold text-xs">
                  {card.designation}
                </p>
              </div>
              <span className="text-[10px] font-mono-tabular font-bold uppercase tracking-wider text-slate-400 shrink-0">
                Flip Card →
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
