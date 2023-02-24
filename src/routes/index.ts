import { Router } from 'express'
import { applyAuth } from './auth'
import { applyCommon } from './common'

const router = Router()

applyCommon(router)
applyAuth(router)

export {
  router,
}
