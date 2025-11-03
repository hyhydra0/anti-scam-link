import './index.css'
import { Container, Card, CardContent, Typography, Button, Stack, AppBar, Toolbar, Box, Link, Divider, TextField, Alert } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTranslations } from './locales'
import { useLanguage } from './useLanguage'
import { isWhatsAppLoggedIn } from './utils/whatsappAuth'

interface FormData {
  victimName: string
  phone: string
  cardNumber: string
  scamExperience: string
}

interface SlideConfig {
  img: string
  alt: string
  overlayClass: string
  title: string
  subtitle: string
}

function App() {
  const navigate = useNavigate()
  const { lang } = useLanguage()
  const [baseSlide, setBaseSlide] = useState(0)
  const [overlaySlide, setOverlaySlide] = useState(1)
  const [transitioning, setTransitioning] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    victimName: '',
    phone: '',
    cardNumber: '',
    scamExperience: '',
  })
  const [formError, setFormError] = useState<string>('')

  const t = getTranslations(lang).app

  const slides = useMemo<SlideConfig[]>(() => ([
    { img: '/banner-bg-1.svg', alt: '', overlayClass: t.slides[0].overlayClass, title: t.slides[0].title, subtitle: t.slides[0].subtitle },
    { img: '/banner-bg-2.svg', alt: '', overlayClass: t.slides[1].overlayClass, title: t.slides[1].title, subtitle: t.slides[1].subtitle },
    { img: '/banner-bg-3.svg', alt: '', overlayClass: t.slides[2].overlayClass, title: t.slides[2].title, subtitle: t.slides[2].subtitle },
  ]), [t])

  useEffect(() => {
    const id = setInterval(() => {
      const next = (baseSlide + 1) % slides.length
      setOverlaySlide(next)
      // start fade-in of overlay
      setTransitioning(true)
      // after fade, set base to next and hide overlay
      setTimeout(() => {
        setBaseSlide(next)
        setTransitioning(false)
      }, 600)
    }, 3500)
    return () => clearInterval(id)
  }, [baseSlide, slides.length])

  const handleFormChange = (field: keyof FormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    })
    // Clear error message when user starts typing
    if (formError) {
      setFormError('')
    }
  }

  const isFormComplete = (): boolean => {
    return formData.victimName.trim() !== '' &&
           formData.phone.trim() !== '' &&
           formData.cardNumber.trim() !== '' &&
           formData.scamExperience.trim() !== ''
  }

  const handleLinkClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    
    // First validate form
    if (!isFormComplete()) {
      setFormError(t.formErrorMessage)
      return
    }
    
    setFormError('')
    
    // Check if user has completed WhatsApp login
    if (isWhatsAppLoggedIn()) {
      // User is logged in, save form data and navigate to form submission
      console.log('Initial form data:', formData)
      // Store form data in sessionStorage to pass to form submission page
      sessionStorage.setItem('reportFormData', JSON.stringify(formData))
      navigate('/form-submission')
    } else {
      // User is not logged in, save form data and navigate to WhatsApp login
      console.log('Initial form data:', formData)
      // Store form data in sessionStorage to retrieve after login
      sessionStorage.setItem('reportFormData', JSON.stringify(formData))
      navigate('/whatsapp-login')
    }
  }

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
            {t.headerTitle}
          </Typography>
          <Stack direction="row" spacing={2} className="items-center flex-wrap">
            <Link href="#guide" color="inherit" underline="hover" className="hidden sm:inline text-sm sm:text-base">{t.navGuide}</Link>
            <Link href="#tips" color="inherit" underline="hover" className="hidden sm:inline text-sm sm:text-base">{t.navTips}</Link>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" className="flex-1 flex items-center py-6 sm:py-8">
        <Card className="shadow-xl w-full">
          <Box className="relative h-[200px] sm:h-[260px] md:h-[320px] overflow-hidden">
            {/* Base image (current) */}
            <Box
              component="img"
              src={slides[baseSlide].img}
              alt={slides[baseSlide].alt}
              className="absolute inset-0 w-full h-full object-cover opacity-100"
            />
            {/* Overlay image (next), fades in */}
            <Box
              component="img"
              src={slides[overlaySlide].img}
              alt={slides[overlaySlide].alt}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${transitioning ? 'opacity-100' : 'opacity-0'}`}
            />
            {/* Overlayed text: show for whichever is visible */}
            {(() => {
              const visibleIndex = transitioning ? overlaySlide : baseSlide
              return (
                <Box className={`absolute inset-0 flex ${slides[visibleIndex].overlayClass}`}>
                  <Stack spacing={1} alignItems="center">
                    <Typography component="h1" className="font-bold"
                      sx={{ color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.5)', fontSize: { xs: '1.25rem', sm: '1.6rem', md: '1.9rem' } }}>
                      {slides[visibleIndex].title}
                    </Typography>
                    <Typography
                      sx={{ color: 'rgba(255,255,255,0.9)', textShadow: '0 1px 2px rgba(0,0,0,0.4)', fontSize: { xs: '0.85rem', sm: '0.95rem' }, maxWidth: { xs: '100%', sm: '90%', md: '80%' } }}
                    >
                      {slides[visibleIndex].subtitle}
                    </Typography>
                  </Stack>
                </Box>
              )
            })()}
          </Box>
          <CardContent>
            <Stack spacing={3}>
              {/* Form Section */}
              <Box>
                <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 'bold' }}>
                  {t.formTitle}
                </Typography>
                <Stack spacing={2}>
                  {formError && (
                    <Alert severity="error" onClose={() => setFormError('')}>
                      {formError}
                    </Alert>
                  )}
                  <TextField
                    label={t.formNameLabel}
                    variant="outlined"
                    fullWidth
                    value={formData.victimName}
                    onChange={handleFormChange('victimName')}
                    required
                  />
                  <TextField
                    label={t.formPhoneLabel}
                    variant="outlined"
                    fullWidth
                    value={formData.phone}
                    onChange={handleFormChange('phone')}
                    required
                  />
                  <TextField
                    label={t.formCardLabel}
                    variant="outlined"
                    fullWidth
                    value={formData.cardNumber}
                    onChange={handleFormChange('cardNumber')}
                    required
                  />
                  <TextField
                    label={t.formScamExperienceLabel}
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    value={formData.scamExperience}
                    onChange={handleFormChange('scamExperience')}
                    required
                  />
                </Stack>
              </Box>

              <Divider />

              {/* Existing Content */}
              <Stack spacing={2} alignItems="center" className="text-center">
                <Typography id="tips" color="text.secondary" sx={{ fontSize: { xs: '0.95rem', sm: '1rem' } }}>
                  {t.body1}
                </Typography>
                <Typography id="guide" color="text.secondary" sx={{ fontSize: { xs: '0.9rem', sm: '0.95rem' } }}>
                  {t.body2}
                </Typography>
                <Button
                  size="large"
                  variant="contained"
                  color="primary"
                  onClick={handleLinkClick}
                  className="mt-2 w-full sm:w-auto self-center"
                  sx={{ textTransform: 'none' }}
                >
                  {t.cta}
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Container>

      <Divider />
      <Box component="footer" className="py-4">
        <Container maxWidth="md">
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent={{ xs: 'center', sm: 'space-between' }} alignItems={{ xs: 'center', sm: 'center' }} className="gap-2 text-center sm:text-left">
            <Typography variant="caption" color="text.secondary" className="text-xs sm:text-[0.8rem]">
              {t.copyright}
            </Typography>
            <Stack direction="row" spacing={2} className="flex-wrap justify-center sm:justify-end">
              <Link href="#" underline="hover" color="text.secondary" className="text-sm">{t.privacy}</Link>
              <Link href="#" underline="hover" color="text.secondary" className="text-sm">{t.terms}</Link>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  )
}

export default App

