import express from 'express'
import consola from 'consola'
import mongoose from 'mongoose'
import { expressjwt } from 'express-jwt'
import { secretKey } from './consts'
import { router } from './routes'
import { initWSS } from './ws'

mongoose
  .connect('mongodb://127.0.0.1:27017/make-a-discord-local')
  .then(() => consola.success('MongoDB database Connected'))
  .catch((err) => {
    consola.warn('Connection failed')
    consola.error(err)
  })

const app = express()
app.use(express.json())
app.use(
  expressjwt({
    secret: secretKey,
    algorithms: ['HS256'],
  }).unless({
    path: [
      '/api/login',
      '/api/register',
    ],
  }),
)
// @ts-expect-error token
app.use((err, _req, res, _next) => {
  if (err.name === 'UnauthorizedError') {
    return res.send({
      status: 401,
      message: err.message,
    })
  }
  res.send({
    status: 500,
    message: 'Unkown error',
  })
})
app.use('/api', router)
initWSS('/api/ws/channel', 9527)
app.listen(3000, () => {
  consola.success('Server started at port 3000')
})
