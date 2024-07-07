import { useDispatch } from '../hooks/redux'
import { removeCategoryById, type ICategory } from '../store/resume-slice'
import DeleteIcon from './icons/delete'
import Resume from './resume'
import ResumeSlot from './resume-slot'

export interface CategoryProps extends ICategory {
  columns: number
  isDeletable?: boolean
  className?: string
}

const Category = ({
  _id,
  name,
  resumes,
  columns,
  isDeletable = true,
  className = ''
}: CategoryProps) => {
  const dispatch = useDispatch()

  const handleRemove = () => {
    dispatch(removeCategoryById(_id))
  }

  return (
    <div className={`rounded-lg bg-neutral-100 px-4 pb-4 pt-3 ${className}`}>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex-shrink-0 text-sm font-medium text-neutral-500">
          {name}
        </h2>
        {isDeletable ? (
          <button className="group" onClick={handleRemove}>
            <DeleteIcon className="h-5 w-5 flex-shrink-0 fill-neutral-500 transition-all group-hover:fill-neutral-700" />
          </button>
        ) : null}
      </div>

      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {!resumes.length ? (
          <ResumeSlot _id="id" category={_id} index={0} />
        ) : null}
        {resumes.map((resume, index) => (
          <Resume key={resume._id} {...resume} index={index} />
        ))}
      </div>
    </div>
  )
}

export default Category
