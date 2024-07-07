import { useDrag, useDrop } from 'react-dnd'

import { useCallback, useEffect, useState, useTransition } from 'react'
import { useDispatch, useSelector } from '../hooks/redux'
import {
  moveResume,
  selectCategories,
  selectUncategorized,
  type ICategory,
  type IResume
} from '../store/resume-slice'
import { Draggable } from '../utils/constants'

export interface ResumeProps extends IResume {
  index: number
}

const Resume = ({ _id, name, category, index }: ResumeProps) => {
  const dispatch = useDispatch()
  const uncategorized = useSelector(selectUncategorized)
  const categories = useSelector(selectCategories)

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

  const [{ _isDragging }, drag] = useDrag(
    {
      type: Draggable.CARD,
      item: { _id },
      collect: (monitor) => ({
        _isDragging: _id === monitor.getItem()?._id
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
      }
    }),
    [findResume]
  )

  const [isDragging, setIsDragging] = useState(false)
  const [, startTransition] = useTransition()

  useEffect(() => {
    startTransition(() => {
      setIsDragging(_isDragging)
    })
  }, [_isDragging, startTransition])

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`flex h-36 items-end overflow-hidden rounded-md bg-neutral-50 shadow-sm outline-dashed outline-neutral-200 ${isDragging ? 'bg-transparent shadow-none outline-2' : 'outline-0'}`}
    >
      {isDragging ? null : (
        <span
          className="w-full bg-white px-4 py-2.5 text-sm font-medium"
          title={name}
        >
          {name}
        </span>
      )}
    </div>
  )
}

export default Resume

interface IItem {
  _id: string
}
