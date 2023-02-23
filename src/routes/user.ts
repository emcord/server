import { Router } from 'express'
import JWT from 'jsonwebtoken'
import { secretKey } from '../consts'
import { UserModel } from '../db/models'

const router = Router()

const models = [
  { path: 'user', model: UserModel },
]
models.forEach(({ path, model }) => {
  router.get(`/${path}/:id`, async (req, res) => {
    const { id } = req.params
    try {
      const result = await model.findById(id)
      res.status(200).json(result)
    }
    catch (e) {
      res.status(500).json({
        message: `[${path}]: Database query error`,
      })
    }
  })

  router.post(`/${path}`, async (req, res) => {
    const content = req.body
    try {
      const result = await model.create(content)
      res.status(200).json(result)
    }
    catch (e) {
      res.status(500).json({
        message: `[${path}]: Database add error`,
      })
    }
  })

  router.patch(`/${path}/:id`, async (req, res) => {
    const { id } = req.params
    const content = req.body
    try {
      const result = await model.findByIdAndUpdate(id, content)
      res.status(200).json(result)
    }
    catch (e) {
      res.status(500).json({
        message: `[${path}]: Database update error`,
      })
    }
  })
  router.delete(`/${path}/:id`, async (req, res) => {
    const { id } = req.params
    try {
      const result = await model.findByIdAndDelete(id)
      res.status(200).json(result)
    }
    catch (e) {
      res.status(500).json({
        message: `[${path}]: Database delete error`,
      })
    }
  })
})

router.post('/login', async (req, res) => {
  const { email } = req.body
  try {
    const user = await UserModel.findOne({ email })
    if (!user) {
      res.status(401).json({
        message: 'Wrong email',
      })
    }
    else {
      const token = JWT.sign(
        { id: user.id },
        secretKey,
        { expiresIn: '24h' },
      )
      res.status(200).json({
        message: 'success',
        token,
      })
    }
  }
  catch (e) {
    res.status(500).json({
      message: 'Wrong email',
    })
  }
})

export { router }
