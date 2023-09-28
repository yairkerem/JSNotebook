import express from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'
import path from 'path'
import { createCellsRouter } from './routes/cells'

export const serve = (
  port: number,
  filename: string,
  dir: string,
  useProxy: boolean
) => {
  const app = express()

  app.use(createCellsRouter(filename, dir))

  if (useProxy) {
    // used when the user has not installed the cli on their machine (and is using a create-react-app server
    app.use(
      createProxyMiddleware({
        target: 'http://localhost:3000',
        ws: true,
        logLevel: 'silent',
      })
    )
  } else {
    // used when the user has installed the cli on their machine
    const packpgePath = require.resolve(
      '@jsnote-ykerem/local-client/build/index.html'
    )
    app.use(express.static(path.dirname(packpgePath)))
  }

  return new Promise<void>((resolve, reject) => {
    app.listen(port, resolve).on('error', reject)
  })
}
