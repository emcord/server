import type { Router } from 'express'
import { UserModel } from '../db/models'

export function applyCommon(router: Router) {
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
}
