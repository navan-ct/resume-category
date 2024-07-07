import { useCallback } from 'react'
import { useDrag, useDrop } from 'react-dnd'

import {
  type ICategory,
  moveResume,
  selectCategories,
  selectUncategorized,
  updateResumeCategory
} from '../store/resume-slice'
import { Draggable } from '../utils/constants'
import { useDispatch, useSelector } from './redux'

interface IItem {
  _id: string
}

const useDragDrop = (_id: string, category: string, index: number) => {
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

      // Search for the resume in the uncategorized resume list.
      let resumeIndex = uncategorized.resumes.findIndex(
        (resume) => resume._id === resumeId
      )

      if (resumeIndex === -1) {
        // Search for the resume in each category until found.
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

  const [{ isDragging }, drag] = useDrag(
    {
      type: Draggable.CARD,
      item: { _id },
      collect: (monitor) => ({
        isDragging: _id === monitor.getItem()?._id
      })
    },
    [_id, index]
  )

  const [, drop] = useDrop(
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
        dispatch(
          updateResumeCategory(
            resumeResult.resume._id,
            category!._id,
            category!.resumes.map((resume) => resume._id)
          )
        )
      }
    }),
    [findResume, findCategoryById]
  )

  return { isDragging, drag, drop }
}

export default useDragDrop
