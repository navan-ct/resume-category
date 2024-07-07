import { useEffect, useState, useTransition } from 'react'

import useDragDrop from '../hooks/use-drag-drop'
import { type IResume } from '../store/resume-slice'

export interface ResumeProps extends IResume {
  index: number
}

const Resume = ({ _id, name, category, index }: ResumeProps) => {
  const {
    isDragging: _isDragging,
    drag,
    drop
  } = useDragDrop(_id, category, index)

  const [isDragging, setIsDragging] = useState(false)
  const [, startTransition] = useTransition()

  // Delay `isDragging` to display the preview image.
  useEffect(() => {
    startTransition(() => {
      setIsDragging(_isDragging)
    })
  }, [_isDragging, startTransition])

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`flex h-36 items-end overflow-hidden rounded-md bg-neutral-50 shadow-sm outline-dashed outline-neutral-200 ${isDragging ? 'bg-transparent shadow-none outline-[3px]' : 'outline-0'}`}
    >
      {isDragging ? null : (
        <>
          <span
            className="z-50 w-full bg-white px-4 py-2.5 text-sm font-medium"
            title={name}
          >
            {name}
          </span>
        </>
      )}
    </div>
  )
}

export default Resume
