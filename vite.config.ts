import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv, type Plugin } from 'vite'

// En producción /api/news lo sirve Vercel (carpeta api/). En `vite dev` no hay
// runtime de funciones serverless, así que este plugin monta el mismo handler
// a mano para poder probar la sección sin desplegar.
function apiNewsDevMiddleware(): Plugin {
  return {
    name: 'api-news-dev-middleware',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/news', async (req, res) => {
        const mod = await server.ssrLoadModule('/api/news.ts')
        await mod.default(req, res)
      })
    },
  }
}

// Mismo patrón para /api/contact. RESEND_API_KEY no tiene prefijo VITE_ a
// propósito (no debe llegar nunca al bundle del cliente), así que acá la
// cargamos a mano con loadEnv() y la inyectamos en process.env, tal como en
// Vercel la inyecta el propio runtime a partir de las env vars del proyecto.
function apiContactDevMiddleware(): Plugin {
  return {
    name: 'api-contact-dev-middleware',
    apply: 'serve',
    configureServer(server) {
      const env = loadEnv(server.config.mode, process.cwd(), '')
      if (env.RESEND_API_KEY && !process.env.RESEND_API_KEY) {
        process.env.RESEND_API_KEY = env.RESEND_API_KEY
      }
      if (env.CONTACT_TO_EMAIL && !process.env.CONTACT_TO_EMAIL) {
        process.env.CONTACT_TO_EMAIL = env.CONTACT_TO_EMAIL
      }

      server.middlewares.use('/api/contact', async (req, res) => {
        const mod = await server.ssrLoadModule('/api/contact.ts')
        await mod.default(req, res)
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), apiNewsDevMiddleware(), apiContactDevMiddleware()],
})
