import { Language, Translations } from './types'
import { zhCn } from './zh-cn'
import { zhTw } from './zh-tw'
import { zhHk } from './zh-hk'
import { en } from './en'
import { ja } from './ja'
import { ko } from './ko'
import { es } from './es'
import { fr } from './fr'
import { de } from './de'
import { it } from './it'
import { pt } from './pt'
import { ru } from './ru'
import { ar } from './ar'
import { th } from './th'
import { vi } from './vi'
import { nl } from './nl'
import { pl } from './pl'
import { tr } from './tr'
import { id } from './id'
import { ms } from './ms'

export const locales: Record<Language, Translations> = {
  'zh-cn': zhCn,
  'zh-tw': zhTw,
  'zh-hk': zhHk,
  'en': en,
  'ja': ja,
  'ko': ko,
  'es': es,
  'fr': fr,
  'de': de,
  'it': it,
  'pt': pt,
  'ru': ru,
  'ar': ar,
  'th': th,
  'vi': vi,
  'nl': nl,
  'pl': pl,
  'tr': tr,
  'id': id,
  'ms': ms,
}

export * from './types'

export function getTranslations(lang: Language): Translations {
  return locales[lang]
}

