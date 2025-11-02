import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import PowerOfAttorney from './PowerOfAttorney.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PowerOfAttorney />} />
        <Route path="/home" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
