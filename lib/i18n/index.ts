export type Locale = "uz" | "ru" | "en";

export const defaultLocale: Locale = "uz";
export const locales: Locale[] = ["uz", "ru", "en"];

export const localeNames: Record<Locale, string> = {
  uz: "O'zbek",
  ru: "Русский",
  en: "English",
};

export const localeFlags: Record<Locale, string> = {
  uz: "🇺🇿",
  ru: "🇷🇺",
  en: "🇬🇧",
};

import { uz } from "./uz";
import { ru } from "./ru";
import { en } from "./en";

export const dictionaries: Record<Locale, typeof uz> = {
  uz,
  ru,
  en,
};

export function getDictionary(locale: Locale) {
  return dictionaries[locale] || dictionaries[defaultLocale];
}
