import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import 'dayjs/locale/zh-cn'
import 'dayjs/locale/zh-tw'
import 'dayjs/locale/zh-hk'
import 'dayjs/locale/ja'
import 'dayjs/locale/ko'
import 'dayjs/locale/es'
import 'dayjs/locale/fr'
import 'dayjs/locale/de'
import 'dayjs/locale/it'
import 'dayjs/locale/pt'
import 'dayjs/locale/ru'
import 'dayjs/locale/ar'
import 'dayjs/locale/th'
import 'dayjs/locale/vi'
import 'dayjs/locale/nl'
import 'dayjs/locale/pl'
import 'dayjs/locale/tr'
import 'dayjs/locale/id'
import 'dayjs/locale/ms'
import { ReactNode } from 'react'
import { Language } from './locales'

interface DatePickerLocalizationProps {
  children: ReactNode
  lang: Language
}

export function DatePickerLocalization({ children, lang }: DatePickerLocalizationProps) {
  // Map our language codes to dayjs locale codes
  const localeMap: Record<Language, string> = {
    'zh-cn': 'zh-cn',
    'zh-tw': 'zh-tw',
    'zh-hk': 'zh-hk',
    'en': 'en',
    'ja': 'ja',
    'ko': 'ko',
    'es': 'es',
    'fr': 'fr',
    'de': 'de',
    'it': 'it',
    'pt': 'pt',
    'ru': 'ru',
    'ar': 'ar',
    'th': 'th',
    'vi': 'vi',
    'nl': 'nl',
    'pl': 'pl',
    'tr': 'tr',
    'id': 'id',
    'ms': 'ms',
  }
  
  const locale = localeMap[lang]
  
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
      {children}
    </LocalizationProvider>
  )
}

