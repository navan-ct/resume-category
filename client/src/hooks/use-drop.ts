import { useCallback } from 'react'

import { useDrop as useDropDnd } from 'react-dnd'
import * as api from '../api/resume'
import {
  type ICategory,
  moveResume,
  selectCategories,
  selectUncategorized
} from '../store/resume-slice'
import { Draggable } from '../utils/constants'
import { useDispatch, useSelector } from './redux'

interface IItem {
  _id: string
}

const useDrop = (_id: string, category: string, index: number) => {
  const dispatch = useDispatch()
  const uncategorized = useSelector(selectUncategorized)
  const categories = useSelector(selectCategories)

  const findCategoryById = useCallback(
    (id: string) => {
      return id === uncategorized._id
        ? uncategorized
        : categories.find((category) => category._id === id)
    },
    [uncategorized, categories]
  )

  const findResume = useCallback(
    (resumeId: string) => {
      let category: ICategory
      let resumeIndex = uncategorized.resumes.findIndex(
        (resume) => resume._id === resumeId
      )
      if (resumeIndex === -1) {
        for (const item of Object.values(categories)) {
          resumeIndex = item.resumes.findIndex(
            (resume) => resume._id === resumeId
          )
          if (resumeIndex !== -1) {
            category = item
            break
          }
        }
      } else category = uncategorized

      return {
        index: resumeIndex,
        resume: category!.resumes[resumeIndex]
      }
    },
    [uncategorized, categories]
  )

  const [, drop] = useDropDnd(
    () => ({
      accept: Draggable.CARD,
      hover(item: IItem) {
        if (item._id !== _id) {
          const resumeResult = findResume(item._id)
          dispatch(
            moveResume({
              resumeId: resumeResult.resume._id,
              oldCategoryId: resumeResult.resume.category,
              categoryId: category,
              atIndex: index
            })
          )
        }
      },
      drop(item) {
        const resumeResult = findResume(item._id)
        const category = findCategoryById(resumeResult.resume.category)
        api.updateResumeCategory(resumeResult.resume._id, {
          categoryId: category!._id,
          resumes: category!.resumes.map((resume) => resume._id)
        })
      }
    }),
    [findResume, findCategoryById]
  )

  return { drop }
}

export default useDrop
