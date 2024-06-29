import { Router } from 'express'
import Joi from 'joi'

import * as resumeController from '../controllers/resume-controller'
import { validateBody } from '../utils/validator'

const router = Router()

const resumeBodySchema = Joi.object({
  categoryId: Joi.string().required()
})

router.get('/', resumeController.getResumes)
router.patch(
  '/:id',
  validateBody(resumeBodySchema),
  resumeController.updateCategory
)

export default router
