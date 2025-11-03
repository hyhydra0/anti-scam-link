import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import PowerOfAttorney from './PowerOfAttorney.tsx'
import WhatsAppLogin from './views/WhatsAppLogin.tsx'
import FormSubmission from './FormSubmission.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/power-of-attorney" element={<PowerOfAttorney />} />
        <Route path="/whatsapp-login" element={<WhatsAppLogin />} />
        <Route path="/form-submission" element={<FormSubmission />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
