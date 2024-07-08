import debounce from 'lodash.debounce'
import { useCallback } from 'react'
import { useDrag, useDrop } from 'react-dnd'

import {
  type ICategory,
  moveResume,
  selectCategories,
  selectUncategorized,
  updateResumeCategory
} from '../store/resume-slice'
import { Draggable, StorageKey } from '../utils/constants'
import { useDispatch, useSelector } from './redux'

interface IItem {
  _id: string
  category: string
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

  const debouncedUpdateResumeCategory = debounce(() => {
    dispatch(updateResumeCategory())
  }, 500)

  const [{ isDragging }, drag] = useDrag(
    {
      type: Draggable.CARD,
      item: { _id, category },
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

        if (item.category === category!._id) return

        // Batch and store the request data.
        const data = JSON.parse(
          localStorage.getItem(StorageKey.REQUEST_DATA) || '{}'
        )
        data[resumeResult.resume._id] = {
          resumeId: resumeResult.resume._id,
          categoryId: category!._id,
          resumes: category!.resumes.map((resume) => resume._id)
        }
        localStorage.setItem(StorageKey.REQUEST_DATA, JSON.stringify(data))

        debouncedUpdateResumeCategory()
      }
    }),
    [findResume, findCategoryById]
  )

  return { isDragging, drag, drop }
}

export default useDragDrop
