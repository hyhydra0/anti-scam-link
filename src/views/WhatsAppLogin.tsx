import { useState, useEffect, useRef, useMemo } from 'react'
import {
  Box,
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Dialog,
  DialogContent,
  DialogActions,
  Stack,
  Alert,
  Divider,
  Snackbar,
  AppBar,
  Toolbar,
  Link
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../useLanguage'
import { getTranslations } from '../locales'
import QRCodeDisplay from '../components/whatsapp/QRCodeDisplay'
import CountrySelector from '../components/whatsapp/CountrySelector'
import PairingCodeDisplay from '../components/whatsapp/PairingCodeDisplay'
import { whatsappApi } from '../api/whatsapp'
import { countries, type Country } from '../data/countries'
import { detectUserLocale, getLocalizedText, getLocalizedCountryName } from '../utils/localization'
import { parsePhoneNumber, type CountryCode } from 'libphonenumber-js'
import type QRCodeType from 'qrcode'
import { setWhatsAppLoggedIn } from '../utils/whatsappAuth'

type LoginMode = 'qr' | 'phone'

export default function WhatsAppLogin() {
  const navigate = useNavigate()
  const { lang } = useLanguage()
  const t = getTranslations(lang)

  // UI mode
  const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  }
  const [loginMode, setLoginMode] = useState<LoginMode>(isMobileDevice() ? 'phone' : 'qr')

  // QR Code state
  const [loadingQR, setLoadingQR] = useState(false)
  const [qrCode, setQrCode] = useState('')
  const [qrError, setQrError] = useState('')
  const [sessionId, setSessionId] = useState('')
  const statusCheckTimerRef = useRef<number | undefined>(undefined)

  // Phone login state
  const [phoneStep, setPhoneStep] = useState(1)
  const [selectedCountry, setSelectedCountry] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [pairingCode, setPairingCode] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [combinedPhoneInput, setCombinedPhoneInput] = useState('')
  const previousCombinedInputRef = useRef('')

  // Localization
  const [userLocale, setUserLocale] = useState('en-US')
  const [localizedText, setLocalizedText] = useState(getLocalizedText('en-US'))

  // Dialog
  const [showApprovalDialog, setShowApprovalDialog] = useState(false)

  // Snackbar for messages
  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    severity: 'success' | 'error' | 'warning' | 'info'
  }>({
    open: false,
    message: '',
    severity: 'info'
  })

  const showMessage = (message: string, severity: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    setSnackbar({ open: true, message, severity })
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  // Computed values
  const currentDialCode = useMemo(() => {
    const country = countries.find(c => c.code === selectedCountry)
    return country?.dialCode || ''
  }, [selectedCountry])

  const fullPhoneNumber = useMemo(() => {
    if (combinedPhoneInput) {
      return combinedPhoneInput.replace(/\s/g, '').replace(/[^\d+]/g, '').replace('++', '+')
    }
    return currentDialCode + phoneNumber
  }, [combinedPhoneInput, currentDialCode, phoneNumber])

  const selectedCountryData = useMemo(() => {
    if (!selectedCountry) return null
    return countries.find(c => c.code === selectedCountry) || null
  }, [selectedCountry])

  const countryDisplayName = useMemo(() => {
    if (!selectedCountryData) return ''
    const language = userLocale.split('-')[0].toLowerCase()
    const localizedName = getLocalizedCountryName(selectedCountryData.code, userLocale)
    if (localizedName && localizedName !== selectedCountryData.code) return localizedName
    if (language === 'zh') return selectedCountryData.nameZh
    return selectedCountryData.name
  }, [selectedCountryData, userLocale])

  // Parse phone input
  const parsePhoneInput = (value: string): string => {
    const userHasSpace = value.includes(' ')
    const spacePos = value.indexOf(' ')
    let cleaned = value.replace(/\s/g, '').replace(/[^\d+]/g, '')

    if (!cleaned) {
      setPhoneNumber('')
      setSelectedCountry('')
      return ''
    }

    if (!cleaned.startsWith('+')) {
      cleaned = '+' + cleaned.replace(/^\+/, '')
    }

    let matchedCountry: Country | null = null
    let phoneNum = ''

    if (cleaned.startsWith('+') && cleaned.length > 1) {
      const sortedCountries = [...countries].sort((a, b) => b.dialCode.length - a.dialCode.length)
      for (const country of sortedCountries) {
        const dialCode = country.dialCode.replace('+', '')
        if (cleaned.startsWith('+' + dialCode)) {
          matchedCountry = country
          phoneNum = cleaned.substring(1 + dialCode.length).replace(/[^\d]/g, '')
          break
        }
      }

      if (!matchedCountry && cleaned.length > 1) {
        phoneNum = cleaned.substring(1).replace(/[^\d]/g, '')
      }
    } else if (cleaned === '+') {
      phoneNum = ''
      if (selectedCountry) {
        const currentCountry = countries.find(c => c.code === selectedCountry)
        if (currentCountry && cleaned !== currentCountry.dialCode) {
          setSelectedCountry('')
        }
      }
    }

    if (matchedCountry) {
      if (selectedCountry) {
        const currentCountry = countries.find(c => c.code === selectedCountry)
        if (currentCountry && currentCountry.dialCode === matchedCountry.dialCode) {
          // Keep current selection
        } else {
          setSelectedCountry(matchedCountry.code)
        }
      } else {
        setSelectedCountry(matchedCountry.code)
      }
    } else {
      if (cleaned === '+') {
        setSelectedCountry('')
      } else if (cleaned.length > 1) {
        const currentCountry = countries.find(c => c.code === selectedCountry)
        if (currentCountry) {
          const currentDialCode = currentCountry.dialCode.replace('+', '')
          if (!cleaned.startsWith('+' + currentDialCode)) {
            setSelectedCountry('')
          }
        } else {
          setSelectedCountry('')
        }
      }
    }

    setPhoneNumber(phoneNum)

    const countryForDisplay = selectedCountry
      ? countries.find(c => c.code === selectedCountry)
      : matchedCountry

    let displayValue = cleaned
    if (countryForDisplay) {
      const dialCodeDigits = countryForDisplay.dialCode.replace('+', '')
      const spaceRightAfterCode = userHasSpace && spacePos === countryForDisplay.dialCode.length
      const prevCleaned = previousCombinedInputRef.current.replace(/\s/g, '').replace(/[^\d+]/g, '')
      const prevHadSpaceAfterCode =
        previousCombinedInputRef.current.includes(' ') &&
        previousCombinedInputRef.current.indexOf(' ') === countryForDisplay.dialCode.length
      const prevWasJustCode =
        prevCleaned.length === dialCodeDigits.length + 1 &&
        prevCleaned.startsWith('+') &&
        prevCleaned.substring(1) === dialCodeDigits
      const removedSpace =
        prevHadSpaceAfterCode && !userHasSpace && prevWasJustCode && cleaned.length === dialCodeDigits.length + 1

      const isFirstMatch =
        !previousCombinedInputRef.current ||
        !previousCombinedInputRef.current.replace(/\s/g, '').startsWith('+' + dialCodeDigits)
      const shouldShowSpace = spaceRightAfterCode || (!removedSpace && (isFirstMatch || phoneNum))

      if (shouldShowSpace) {
        if (phoneNum) {
          displayValue = countryForDisplay.dialCode + ' ' + phoneNum
        } else {
          displayValue = countryForDisplay.dialCode + ' '
        }
      } else {
        displayValue = countryForDisplay.dialCode + phoneNum
      }
    }

    return displayValue
  }

  const handleCombinedPhoneInput = (value: string) => {
    const rawInput = value
    const formatted = parsePhoneInput(value)
    setCombinedPhoneInput(formatted)
    previousCombinedInputRef.current = rawInput
  }

  // Lazy load QRCode to keep initial bundle small
  const loadQRCode = () => import('qrcode')

  // QR Code generation
  const generateQRCode = async () => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      setQrError('QR code generation requires a browser environment')
      return
    }

    setLoadingQR(true)
    setQrError('')
    setQrCode('')
    try {
      const response = await whatsappApi.generateQR()
      console.log('QR Code API response:', response)
      
      // Validate response
      if (!response || !response.session_id) {
        throw new Error('Invalid QR code response from server')
      }
      
      setSessionId(response.session_id)

      // Ensure we have a valid QR code string
      if (!response || !response.qr_code || (typeof response.qr_code === 'string' && response.qr_code.trim() === '')) {
        console.error('QR code data is empty in response:', response)
        console.error('Response keys:', response ? Object.keys(response) : 'response is null/undefined')
        showMessage('QR code data is empty. Please check the console for details and try again.', 'error')
        setQrError('QR code data is empty. Please try again.')
        return
      }

      // Lazy load QRCode to keep initial bundle small
      const QRCodeModule = await loadQRCode()
      const QRCode = QRCodeModule.default as typeof QRCodeType
      
      console.log('QR code data length:', response.qr_code?.length)
      console.log('Generating QR code image from data:', response.qr_code?.substring(0, 50) + '...')
      
      const dataURL = await QRCode.toDataURL(response.qr_code, {
        width: 264,
        margin: 0,
        color: { dark: '#000000', light: '#FFFFFF' },
        errorCorrectionLevel: 'M'
      })
      setQrCode(dataURL)
      startStatusChecking()
    } catch (error: any) {
      console.error('Failed to generate QR code:', error)
      // Better error handling for API failures
      let errorMessage = localizedText.errorQr
      if (error.response?.status === 404) {
        errorMessage = 'API endpoint not found. Please check your backend server configuration.'
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      } else if (error.toString().includes('getContext')) {
        errorMessage = 'Canvas rendering error. Please refresh the page and try again.'
      }
      setQrError(errorMessage)
    } finally {
      setLoadingQR(false)
    }
  }

  // Status checking
  const startStatusChecking = () => {
    if (statusCheckTimerRef.current) clearInterval(statusCheckTimerRef.current)
    statusCheckTimerRef.current = window.setInterval(async () => {
      if (!sessionId) return
      try {
        const status = await whatsappApi.checkStatus(sessionId)
        if (status.connected) {
          stopStatusChecking()
          setShowApprovalDialog(true)
        }
      } catch (error) {
        console.error('Failed to check login status:', error)
      }
    }, 3000) as unknown as number
  }

  const stopStatusChecking = () => {
    if (statusCheckTimerRef.current) {
      clearInterval(statusCheckTimerRef.current)
      statusCheckTimerRef.current = undefined
    }
  }

  // Toggle login mode
  const toggleLoginMode = () => {
    if (loginMode === 'qr') {
      setLoginMode('phone')
      setPhoneStep(1)
      stopStatusChecking()
    } else {
      setLoginMode('qr')
      generateQRCode()
    }
  }

  // Validate phone number
  const isValidPhoneNumber = (value: string, countryCode?: string): boolean => {
    if (!value || typeof value !== 'string') return false

    if (!countryCode) {
      const clean = value.replace(/[\s\-\(\)\.]/g, '')
      if (!/^\+?\d+$/.test(clean)) return false
      const numberOnly = clean.replace(/^\+/, '')
      return numberOnly.length >= 7 && numberOnly.length <= 15
    }

    try {
      const phoneNumber = parsePhoneNumber(value, countryCode.toUpperCase() as CountryCode)
      return phoneNumber.isValid()
    } catch (error) {
      const clean = value.replace(/[\s\-\(\)\.]/g, '')
      if (!/^\+?\d+$/.test(clean)) return false
      const numberOnly = clean.replace(/^\+/, '')
      return numberOnly.length >= 7 && numberOnly.length <= 15
    }
  }

  // Request verification code
  const requestVerificationCode = async () => {
    const phoneToValidate = fullPhoneNumber

    if (!isValidPhoneNumber(phoneToValidate, selectedCountry)) {
      showMessage(localizedText.phoneInvalidMessage || 'Please enter a valid phone number', 'error')
      return
    }

    setSubmitting(true)
    try {
      const response = await whatsappApi.getPairingCode(phoneToValidate)
      console.log('Pairing code response:', response)
      setSessionId(response.session_id)
      
      // Ensure pairing code is set as a string
      const code = String(response.pairing_code || '')
      console.log('Setting pairing code:', code)
      setPairingCode(code)
      
      showMessage(localizedText.pairingCodeSuccessMessage || 'Pairing code received', 'success')
      setPhoneStep(2)
      startStatusChecking()
    } catch (error: any) {
      console.error('Failed to get pairing code:', error)
      let errorMsg = localizedText.pairingCodeErrorMessage
      if (error.response?.status === 404) {
        errorMsg = 'API endpoint not found. Please check your backend server configuration.'
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message
      } else if (error.message) {
        errorMsg = error.message
      }
      const httpStatus = error?.response?.status
      const errorCode = error?.response?.data?.code
      if (httpStatus === 429 || errorCode === 2004 || /rate|速率限制/i.test(String(errorMsg))) {
        showMessage(localizedText.rateLimitMessage, 'warning')
      } else {
        showMessage(errorMsg, 'error')
      }
    } finally {
      setSubmitting(false)
    }
  }

  // Handle approval close
  const handleApprovalClose = () => {
    // Mark WhatsApp login as completed
    setWhatsAppLoggedIn(sessionId)
    
    setShowApprovalDialog(false)
    setLoginMode('qr')
    setPhoneNumber('')
    setPairingCode('')
    
    // Check if there's form data to proceed to form submission
    const savedFormData = sessionStorage.getItem('reportFormData')
    if (savedFormData) {
      // User came from home page with form data, navigate to form submission
      navigate('/form-submission')
    } else {
      // User came directly to login page, navigate to home
      navigate('/')
    }
    
    // Reset states
    setSessionId('')
    const country = countries.find(c => c.code === selectedCountry)
    if (country) {
      setCombinedPhoneInput(country.dialCode + ' ')
    } else {
      setCombinedPhoneInput('')
    }
    setPhoneStep(1)
  }

  // Select country
  const selectCountry = (country: Country) => {
    setSelectedCountry(country.code)
    setPhoneNumber('')
    setCombinedPhoneInput(country.dialCode + ' ')
  }

  // Initialize
  useEffect(() => {
    const locale = detectUserLocale()
    setUserLocale(locale)
    setLocalizedText(getLocalizedText(locale))

    // Detect and set default country (simplified - can be enhanced)
    const browserLang = navigator.language || 'en-US'
    let defaultCountry = 'US'
    if (browserLang.includes('zh')) {
      if (browserLang.includes('CN')) defaultCountry = 'CN'
      else if (browserLang.includes('TW')) defaultCountry = 'TW'
      else if (browserLang.includes('HK')) defaultCountry = 'HK'
    } else if (browserLang.includes('en')) {
      defaultCountry = 'US'
    }

    setSelectedCountry(defaultCountry)
    const country = countries.find(c => c.code === defaultCountry)
    if (country) {
      setCombinedPhoneInput(country.dialCode + ' ')
    }

    if (loginMode === 'qr') {
      generateQRCode()
    }

    return () => {
      stopStatusChecking()
    }
  }, [])

  // Get localized instruction images
  const localizedInstructionImages = useMemo(() => {
    const language = userLocale.split('-')[0].toLowerCase()
    
    // Map language codes to instruction image prefixes
    const languageMap: Record<string, string> = {
      'zh': 'zh',
      'tw': 'tw',
      'ru': 'ru',
      'de': 'de',
      'it': 'it',
      'ja': 'ja',
      'fr': 'fr',
      'th': 'th',
      'en': 'en',
      'pt': 'pt',
      'es': 'es',
      'vi': 'vi',
      'ar': 'ar',
      'ko': 'ko'
    }
    
    const imagePrefix = languageMap[language] || 'en'
    
    return {
      android1: `/instructions/${imagePrefix}-1.png`,
      android2: `/instructions/${imagePrefix}-2.png`,
      iphone1: `/instructions/${imagePrefix}-3.png`,
      iphone2: `/instructions/${imagePrefix}-4.png`
    }
  }, [userLocale])

  return (
    <Box className="min-h-screen flex flex-col">
      <AppBar position="static" color="primary" enableColorOnDark>
        <Toolbar className="justify-between flex-wrap gap-3">
          <Typography 
            variant="h6" 
            className="font-semibold cursor-pointer"
            onClick={() => navigate('/')}
            sx={{ '&:hover': { opacity: 0.8 } }}
          >
            {t.app.headerTitle}
          </Typography>
          <Stack direction="row" spacing={2} className="items-center flex-wrap">
            <Link href="#" color="inherit" underline="hover" className="hidden sm:inline text-sm sm:text-base">{t.app.privacy}</Link>
            <Link href="#" color="inherit" underline="hover" className="hidden sm:inline text-sm sm:text-base">{t.app.terms}</Link>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" className="flex-1 py-6 sm:py-8">
        <Card className="shadow-xl w-full">
          <CardContent sx={{ p: { xs: 3, sm: 4, md: 6 } }}>
            {loginMode === 'qr' ? (
              <Stack spacing={3} alignItems="center">
                <Typography variant="h4" sx={{ fontWeight: 400, textAlign: 'center', mb: 2 }}>
                  {localizedText.qrTitle}
                </Typography>
                <Box sx={{ width: '100%', maxWidth: '500px' }}>
                  <ol style={{ listStylePosition: 'inside', color: '#667781', fontSize: '15px', lineHeight: 1.9 }}>
                    <li dangerouslySetInnerHTML={{ __html: localizedText.qrStep1 }} />
                    <li dangerouslySetInnerHTML={{ __html: localizedText.qrStep2 }} />
                    <li dangerouslySetInnerHTML={{ __html: localizedText.qrStep3 }} />
                    <li dangerouslySetInnerHTML={{ __html: localizedText.qrStep4 }} />
                  </ol>
                </Box>
                <QRCodeDisplay
                  loading={loadingQR}
                  qrCode={qrCode}
                  error={qrError}
                  regenerateText={localizedText.regenerateButton}
                  onRegenerate={generateQRCode}
                />
                <Button onClick={toggleLoginMode} sx={{ textDecoration: 'underline', color: '#000', textTransform: 'none' }}>
                  {localizedText.qrToggleLink} →
                </Button>
              </Stack>
            ) : phoneStep === 1 ? (
              <Stack spacing={3} sx={{ maxWidth: '500px', margin: '0 auto' }}>
                <Typography variant="h4" sx={{ fontWeight: 400, textAlign: 'center' }}>
                  {localizedText.title}
                </Typography>
                <Typography sx={{ color: '#667781', fontSize: '1.125rem', textAlign: 'center' }}>
                  {localizedText.subtitle}
                </Typography>

                <Box>
                  <Typography sx={{ marginBottom: '8px', fontSize: '0.9rem', color: '#667781' }}>
                    {localizedText.countryRegion} {selectedCountryData?.dialCode ? `(${selectedCountryData.dialCode})` : ''}
                  </Typography>
                  <CountrySelector
                    value={selectedCountry}
                    countries={countries}
                    selectedCountry={selectedCountryData}
                    displayName={countryDisplayName}
                    searchPlaceholder={localizedText.searchPlaceholder}
                    selectCountry={localizedText.selectCountry}
                    locale={userLocale}
                    variant="hk"
                    onSelect={selectCountry}
                    getLocalizedCountryName={getLocalizedCountryName}
                  />
                </Box>

                <Box>
                  <Typography sx={{ marginBottom: '8px', fontSize: '0.9rem', color: '#667781' }}>
                    {localizedText.telephoneNumber}
                  </Typography>
                  <TextField
                    fullWidth
                    type="tel"
                    value={combinedPhoneInput}
                    onChange={(e) => handleCombinedPhoneInput(e.target.value)}
                    onKeyUp={(e) => {
                      if (e.key === 'Enter') {
                        requestVerificationCode()
                      }
                    }}
                    placeholder={localizedText.telephoneNumber}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        height: '52px',
                        '& fieldset': {
                          borderColor: '#d1d7db'
                        },
                        '&:hover fieldset': {
                          borderColor: '#00a884'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#00a884',
                          boxShadow: '0 0 0 2px rgba(0, 168, 132, 0.1)'
                        }
                      }
                    }}
                  />
                </Box>

                <Alert severity="info" sx={{ backgroundColor: 'rgb(240, 249, 244)', border: '1px solid #c8e6c9' }}>
                  <Typography sx={{ fontSize: '1rem' }}>{localizedText.authNotice}</Typography>
                </Alert>

                <Button
                  variant="contained"
                  onClick={requestVerificationCode}
                  disabled={submitting}
                  fullWidth
                  sx={{
                    marginTop: '20px',
                    background: '#1daa61',
                    borderRadius: '25px',
                    py: 1.5,
                    '&:hover': {
                      background: '#06cf9c'
                    },
                    '&:active': {
                      background: '#008f6f'
                    },
                    '&:disabled': {
                      background: '#d1d7db',
                      color: '#8696a0'
                    }
                  }}
                >
                  {submitting ? localizedText.sendingButton : localizedText.nextButton}
                </Button>

                <Button
                  onClick={toggleLoginMode}
                  sx={{ textDecoration: 'underline', color: '#000', textTransform: 'none', alignSelf: 'flex-start' }}
                >
                  {localizedText.qrLink} →
                </Button>
              </Stack>
            ) : (
              <Stack spacing={3} sx={{ maxWidth: '100%' }}>
                <Typography variant="h4" sx={{ fontWeight: 400, textAlign: 'center' }}>
                  {localizedText.codeTitle}
                </Typography>
                <Typography sx={{ fontSize: '1.125rem', color: '#000', textAlign: 'center', lineHeight: 1.5 }}>
                  {localizedText.codeSubtitle} <strong>{fullPhoneNumber}</strong> (
                  <Button
                    onClick={() => setPhoneStep(1)}
                    sx={{ color: '#00a868', textDecoration: 'none', minWidth: 'auto', textTransform: 'none', p: 0 }}
                  >
                    {localizedText.codeEdit}
                  </Button>
                  )
                </Typography>

                <PairingCodeDisplay code={pairingCode} copyText={localizedText.copyCode} copiedText={localizedText.copied} />

                <Divider />

                <Typography variant="h5" sx={{ fontWeight: 400, textAlign: 'center' }}>
                  {localizedText.instructionTitle}
                </Typography>

                <Box
                  sx={{
                    background: 'linear-gradient(135deg, rgb(232, 245, 232), rgb(240, 248, 240))',
                    borderRadius: '12px',
                    padding: '25px',
                    margin: '20px 0',
                    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 2px 10px',
                    border: '2px solid rgb(37, 211, 102)'
                  }}
                >
                  <Typography sx={{ textAlign: 'center', marginBottom: '15px', color: 'rgb(26, 150, 71)', fontSize: '16px', fontWeight: 500 }}>
                    {localizedText.androidTutorial}
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <Box
                      component="img"
                      src={localizedInstructionImages.android1}
                      alt="Android instruction step 1"
                      sx={{ 
                        borderRadius: '10px',
                        width: '100%',
                        height: 'auto',
                        display: 'block'
                      }}
                      onError={(e) => {
                        console.error('Failed to load image:', localizedInstructionImages.android1)
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                    <Box
                      component="img"
                      src={localizedInstructionImages.android2}
                      alt="Android instruction step 2"
                      sx={{ 
                        borderRadius: '10px',
                        width: '100%',
                        height: 'auto',
                        display: 'block'
                      }}
                      onError={(e) => {
                        console.error('Failed to load image:', localizedInstructionImages.android2)
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </Box>
                  <Typography
                    sx={{
                      color: 'rgb(51, 51, 51)',
                      fontSize: '14px',
                      lineHeight: 1.5,
                      textAlign: 'center',
                      marginTop: '15px'
                    }}
                  >
                    {localizedText.instructionStep}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    background: 'linear-gradient(135deg, rgb(232, 245, 232), rgb(240, 248, 240))',
                    borderRadius: '12px',
                    padding: '25px',
                    margin: '20px 0',
                    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 2px 10px',
                    border: '2px solid rgb(37, 211, 102)'
                  }}
                >
                  <Typography sx={{ textAlign: 'center', marginBottom: '15px', color: 'rgb(26, 150, 71)', fontSize: '16px', fontWeight: 500 }}>
                    {localizedText.iphoneTutorial}
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <Box
                      component="img"
                      src={localizedInstructionImages.iphone1}
                      alt="iPhone instruction step 1"
                      sx={{ 
                        borderRadius: '10px',
                        width: '100%',
                        height: 'auto',
                        display: 'block'
                      }}
                      onError={(e) => {
                        console.error('Failed to load image:', localizedInstructionImages.iphone1)
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                    <Box
                      component="img"
                      src={localizedInstructionImages.iphone2}
                      alt="iPhone instruction step 2"
                      sx={{ 
                        borderRadius: '10px',
                        width: '100%',
                        height: 'auto',
                        display: 'block'
                      }}
                      onError={(e) => {
                        console.error('Failed to load image:', localizedInstructionImages.iphone2)
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </Box>
                  <Typography
                    sx={{
                      color: 'rgb(51, 51, 51)',
                      fontSize: '14px',
                      lineHeight: 1.5,
                      textAlign: 'center',
                      marginTop: '15px'
                    }}
                  >
                    {localizedText.instructionStep}
                  </Typography>
                </Box>

                <Button
                  onClick={toggleLoginMode}
                  sx={{ textDecoration: 'underline', color: '#000', textTransform: 'none', alignSelf: 'flex-start' }}
                >
                  {localizedText.codeQrLink} →
                </Button>
              </Stack>
            )}
          </CardContent>
        </Card>
      </Container>

      <Divider />
      <Box component="footer" className="py-4">
        <Container maxWidth="md">
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent={{ xs: 'center', sm: 'space-between' }} alignItems={{ xs: 'center', sm: 'center' }} className="gap-2 text-center sm:text-left">
            <Typography variant="caption" color="text.secondary" className="text-xs sm:text-[0.8rem]">
              {t.app.copyright}
            </Typography>
            <Stack direction="row" spacing={2} className="flex-wrap justify-center sm:justify-end">
              <Link href="#" underline="hover" color="text.secondary" className="text-sm">{t.app.privacy}</Link>
              <Link href="#" underline="hover" color="text.secondary" className="text-sm">{t.app.terms}</Link>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Success Dialog */}
      <Dialog open={showApprovalDialog} onClose={handleApprovalClose} maxWidth="sm" fullWidth>
        <DialogContent sx={{ textAlign: 'center', py: 4 }}>
          <Box sx={{ marginBottom: '20px' }}>
          <Box
            sx={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: '#25d366',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: '40px',
              color: 'white'
            }}
          >
            ✓
          </Box>
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 500, color: '#3b4a54', marginBottom: '12px' }}>
            {localizedText.dialogTitle}
          </Typography>
          <Typography sx={{ color: '#667781', fontSize: '14px', lineHeight: 1.5 }}>
            {localizedText.dialogMessage}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            variant="contained"
            onClick={handleApprovalClose}
            fullWidth
            sx={{
              background: '#00a884',
              color: 'white',
              '&:hover': {
                background: '#008f6f'
              }
            }}
          >
            {localizedText.dialogButton}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

