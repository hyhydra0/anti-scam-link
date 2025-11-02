import { useState } from 'react'
import { Language } from './locales'

/**
 * Detect browser language and return the appropriate language code
 * Maps browser languages to supported locales: zh-cn, zh-tw, zh-hk, en, ja, ko, es, fr, de, it, pt, ru, ar, th, vi, nl, pl, tr, id, ms
 */
const detectBrowserLanguage = (): Language => {
  // Get browser language
  const browserLang = navigator.language || (navigator as any).userLanguage
  const langLower = browserLang.toLowerCase()
  const langParts = langLower.split('-')
  const langCode = langParts[0] // Get language code without region
  const region = langParts[1] // Get region code if available
  
  // Map language codes to supported locales
  switch (langCode) {
    case 'zh':
      // Map Chinese variants based on region
      if (region === 'tw') {
        return 'zh-tw'
      } else if (region === 'hk') {
        return 'zh-hk'
      } else {
        // Default to Simplified Chinese for CN and other regions
        // return 'en'
        return 'zh-cn'
      }
    case 'ja':
      return 'ja'
    case 'ko':
      return 'ko'
    case 'es':
      return 'es'
    case 'fr':
      return 'fr'
    case 'de':
      return 'de'
    case 'en':
      return 'en'
    case 'it':
      return 'it'
    case 'pt':
      return 'pt'
    case 'ru':
      return 'ru'
    case 'ar':
      return 'ar'
    case 'th':
      return 'th'
    case 'vi':
      return 'vi'
    case 'nl':
      return 'nl'
    case 'pl':
      return 'pl'
    case 'tr':
      return 'tr'
    case 'id':
      return 'id'
    case 'ms':
      return 'ms'
    default:
      return 'en'
  }
}

/**
 * Custom hook to manage language state with browser detection
 * Language is automatically detected and cannot be changed by user
 */
export const useLanguage = () => {
  const [lang] = useState<Language>(() => {
    // Initialize with browser language on first load
    return detectBrowserLanguage()
  })

  // Return only lang since we don't allow manual language switching anymore
  return { lang }
}

