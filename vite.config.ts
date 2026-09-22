import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, type Plugin } from 'vite'

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

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), apiNewsDevMiddleware()],
})
