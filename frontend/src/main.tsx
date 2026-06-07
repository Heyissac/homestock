import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.tsx'

// registerSW registra el service worker generado por vite-plugin-pwa
// onOfflineReady se dispara cuando Workbox termina de precachear — la app ya puede funcionar offline
// onNeedRefresh se dispara cuando hay una nueva versión disponible
// Con registerType: 'autoUpdate' en vite.config.ts, la actualización es automática
// pero el callback nos permite loggear o mostrar un indicador si quisiéramos
registerSW({
  onOfflineReady() {
    console.log('[PWA] App lista para funcionar offline')
  },
  onNeedRefresh() {
    console.log('[PWA] Nueva versión disponible, actualizando...')
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)