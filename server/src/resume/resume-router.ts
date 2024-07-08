import { Router } from 'express'
import Joi from 'joi'

import { validateBody } from '../common/utils/validator'
import * as resumeController from './resume-controller'

const router = Router()

const updateCategoryBodySchema = Joi.object({
  categoryId: Joi.string().required(),
  resumes: Joi.array().items(Joi.string()).required().min(1)
})
const batchUpdateCategoryBodySchema = Joi.array()
  .items(
    Joi.object({
      resumeId: Joi.string().required(),
      categoryId: Joi.string().required(),
      resumes: Joi.array().items(Joi.string()).required().min(1)
    })
  )
  .required()
  .min(1)

router.get('/', resumeController.getResumes)
router.patch(
  '/category/batch',
  validateBody(batchUpdateCategoryBodySchema),
  resumeController.batchUpdateCategory
)
router.patch(
  '/:id',
  validateBody(updateCategoryBodySchema),
  resumeController.updateCategory
)

export default router
