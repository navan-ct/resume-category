import { type ICategory } from '../store/resume-slice'
import Resume from './resume'

export interface CategoryProps extends ICategory {
  columns: number
  className?: string
}

const Category = ({
  name,
  resumes,
  columns,
  className = ''
}: CategoryProps) => {
  return (
    <div className={`rounded-lg bg-neutral-100 px-4 pb-4 pt-3 ${className}`}>
      <h2 className="mb-3 text-sm font-medium text-neutral-500">{name}</h2>

      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {resumes.map((resume, index) => (
          <Resume key={resume._id} {...resume} index={index} />
        ))}
      </div>
    </div>
  )
}

export default Category
