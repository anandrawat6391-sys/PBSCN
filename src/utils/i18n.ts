export type LangMode = 'en' | 'hi';

export interface BilingualText {
  en: string;
  hi: string;
}

export function t(lang: LangMode, en: string, hi: string): string {
  return lang === 'en' ? en : hi;
}
