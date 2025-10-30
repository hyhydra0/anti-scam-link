import './index.css'
import { Container, Card, CardContent, Typography, Button, Stack, ToggleButton, ToggleButtonGroup, AppBar, Toolbar, Box, Link, Divider } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'

function App() {
  const [lang, setLang] = useState('zh')
  const [baseSlide, setBaseSlide] = useState(0)
  const [overlaySlide, setOverlaySlide] = useState(1)
  const [transitioning, setTransitioning] = useState(false)

  const translations = {
    zh: {
      headerTitle: '反诈宣传 Anti-Scam',
      navGuide: '指南',
      navTips: 'Tips',
      slides: [
        {
          title: '反诈宣传 Anti-Scam Awareness',
          subtitle: '警惕陌生链接与来电 · 不透露验证码与银行卡信息 · 远离高回报骗局',
          overlayClass: 'items-center justify-center text-center px-4',
        },
        {
          title: '谨防诈骗 Stay Alert',
          subtitle: '核实身份 · 官方渠道 · 不转账 · 不点击陌生链接',
          overlayClass: 'items-end justify-start text-left pl-6 sm:pl-10 pb-6',
        },
        {
          title: '识别套路 Recognize Scams',
          subtitle: '谨记“三不一多”：不轻信、不透露、不转账、多核实',
          overlayClass: 'items-start justify-center text-center pt-6 px-4',
        },
      ],
      body1: '警惕陌生来电、短信与链接；不透露验证码、银行卡等敏感信息；不轻信“客服、公检法、投资高回报”等话术。',
      body2: '点击下方跳转链接，查看官方防骗指南（效果类似外卖代付引导链接）。',
      cta: '立即前往 防骗指南',
      toggleZh: '中',
      toggleEn: 'EN',
      privacy: '隐私政策',
      terms: '使用条款',
      copyright: '© ' + new Date().getFullYear() + ' 反诈宣传',
    },
    en: {
      headerTitle: 'Anti-Scam Awareness',
      navGuide: 'Guide',
      navTips: 'Tips',
      slides: [
        {
          title: 'Anti-Scam Awareness',
          subtitle: 'Beware of unknown links/calls · Never share codes or bank info · Avoid high-return scams',
          overlayClass: 'items-center justify-center text-center px-4',
        },
        {
          title: 'Stay Alert',
          subtitle: 'Verify identity · Use official channels · Don’t transfer money · Don’t click unknown links',
          overlayClass: 'items-end justify-start text-left pl-6 sm:pl-10 pb-6',
        },
        {
          title: 'Recognize Scams',
          subtitle: 'Remember “3 No’s and 1 More”: Don’t trust, don’t disclose, don’t transfer; verify more',
          overlayClass: 'items-start justify-center text-center pt-6 px-4',
        },
      ],
      body1: 'Beware of unknown calls, messages, and links. Never share verification codes or bank details. Do not trust “customer service”, “police/prosecutor”, or “high-return investments”.',
      body2: 'Tap the link below to view the official anti‑scam guide (similar to takeaway pay assist links).',
      cta: 'Go to Anti‑Scam Guide',
      toggleZh: 'ZH',
      toggleEn: 'EN',
      privacy: 'Privacy Policy',
      terms: 'Terms of Use',
      copyright: '© ' + new Date().getFullYear() + ' Anti-Scam Awareness',
    },
  }

  const t = translations[lang]

  const slides = useMemo(() => ([
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

  const baseUrl = 'https://example.com/anti-scam-info'
  const trackingUrl = useMemo(() => {
    const url = new URL(baseUrl)
    url.searchParams.set('utm_source', 'landing')
    url.searchParams.set('utm_medium', 'cta_button')
    url.searchParams.set('utm_campaign', 'anti_scam_awareness')
    url.searchParams.set('lang', lang)
    return url.toString()
  }, [baseUrl, lang])

  return (
    <Box className="min-h-screen flex flex-col">
      <AppBar position="static" color="primary" enableColorOnDark>
        <Toolbar className="justify-between flex-wrap gap-3">
          <Typography variant="h6" className="font-semibold">{t.headerTitle}</Typography>
          <Stack direction="row" spacing={2} className="items-center flex-wrap">
            <Link href="#guide" color="inherit" underline="hover" className="hidden sm:inline text-sm sm:text-base">{t.navGuide}</Link>
            <Link href="#tips" color="inherit" underline="hover" className="hidden sm:inline text-sm sm:text-base">{t.navTips}</Link>
            <ToggleButtonGroup
              color="secondary"
              size="small"
              exclusive
              value={lang}
              onChange={(_, v) => v && setLang(v)}
            >
              <ToggleButton value="zh">{t.toggleZh}</ToggleButton>
              <ToggleButton value="en">{t.toggleEn}</ToggleButton>
            </ToggleButtonGroup>
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
                href={trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 w-full sm:w-auto self-center"
                sx={{ textTransform: 'none' }}
              >
                {t.cta}
              </Button>
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
