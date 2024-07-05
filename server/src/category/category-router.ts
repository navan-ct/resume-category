import { Router } from 'express'
import Joi from 'joi'

import { validateBody } from '../common/utils/validator'
import * as categoryController from './category-controller'

const router = Router()

const categoryBodySchema = Joi.object({
  name: Joi.string().required()
})

router.post(
  '/',
  validateBody(categoryBodySchema),
  categoryController.addCategory
)
router.patch(
  '/:id',
  validateBody(categoryBodySchema),
  categoryController.renameCategory
)
router.delete('/:id', categoryController.removeCategory)

export default router
