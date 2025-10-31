import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import 'dayjs/locale/zh-cn'
import { ReactNode } from 'react'
import { Language } from './locales'

interface DatePickerLocalizationProps {
  children: ReactNode
  lang: Language
}

export function DatePickerLocalization({ children, lang }: DatePickerLocalizationProps) {
  const locale = lang === 'zh' ? 'zh-cn' : 'en'
  
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
      {children}
    </LocalizationProvider>
  )
}

