import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      // 'autoUpdate' registra y actualiza el service worker automáticamente
      // sin pedirle al usuario que recargue — ideal para MVP
      registerType: 'autoUpdate',

      // Archivos que Workbox precachea al instalar el service worker
      // Esto hace que la app shell cargue offline aunque nunca se haya visitado
      includeAssets: ['favicon.svg', 'icon-192.png', 'icon-512.png'],

      manifest: {
        name: 'HomeStock',
        short_name: 'HomeStock',
        description: 'Gestión de inventario del hogar',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',  // Sin barra de navegación del browser al instalarse
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            // 'any maskable' permite que iOS/Android adapten el ícono a su forma
            purpose: 'any maskable',
          },
        ],
      },

      workbox: {
        // Patrones de archivos que Workbox precachea automáticamente
        // Cubre el bundle de Vite — JS, CSS, HTML, imágenes, fuentes
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],

        // Runtime caching — qué hacer con requests que no están en el precache
        runtimeCaching: [
          {
            // Cachear las llamadas a la API con NetworkFirst:
            // intenta la red primero, si falla usa el cache
            // Esto complementa IndexedDB — si el browser no puede llegar al backend,
            // al menos las respuestas recientes están cacheadas aquí
            urlPattern: /^https?:\/\/.*\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24, // 24 horas
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
})