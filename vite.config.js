import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'

function apiDevPlugin() {
  return {
    name: 'api-dev-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (
          req.url &&
          (req.url === '/api/auth' ||
            req.url.startsWith('/api/auth?') ||
            req.url.startsWith('/api/auth/'))
        ) {
          try {
            const chunks = []
            for await (const chunk of req) {
              chunks.push(chunk)
            }
            const bodyBuffer = Buffer.concat(chunks)
            const bodyText = bodyBuffer.toString('utf-8')

            const protocol = req.headers['x-forwarded-proto'] || 'http'
            const host = req.headers.host || 'localhost:5173'
            const url = `${protocol}://${host}${req.url}`

            const webHeaders = new Headers()
            for (const [key, val] of Object.entries(req.headers)) {
              if (val !== undefined) {
                if (Array.isArray(val)) {
                  val.forEach((v) => webHeaders.append(key, v))
                } else {
                  webHeaders.set(key, val)
                }
              }
            }

            const webReq = new Request(url, {
              method: req.method,
              headers: webHeaders,
              body: ['GET', 'HEAD'].includes(req.method) ? undefined : bodyText || undefined,
            })

            const authModule = await server.ssrLoadModule('./functions/auth.ts')
            const authHandler = authModule.default

            const webRes = await authHandler(webReq)

            res.statusCode = webRes.status
            webRes.headers.forEach((val, key) => {
              res.setHeader(key, val)
            })

            const resText = await webRes.text()
            res.end(resText)
            return
          } catch (err) {
            console.error('[dev-api] Error handling /api/auth:', err)
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(
              JSON.stringify({
                error: 'Internal dev server error',
                details: err instanceof Error ? err.message : String(err),
              })
            )
            return
          }
        }
        next()
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  Object.assign(process.env, env)

  return {
    plugins: [react(), tailwindcss(), apiDevPlugin()],
  }
})
