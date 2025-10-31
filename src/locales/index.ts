import { Language, Translations } from './types'
import { zh } from './zh'
import { en } from './en'

export const locales: Record<Language, Translations> = {
  zh,
  en,
}

export * from './types'

export function getTranslations(lang: Language): Translations {
  return locales[lang]
}

