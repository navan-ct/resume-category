import { type IResume } from '../store/resume-slice'

export interface CategoryProps {
  label: string
  resumes: IResume[]
  columns: number
  className?: string
}

const Category = ({
  label,
  resumes,
  columns,
  className = ''
}: CategoryProps) => {
  const top = 2
  const rows = Math.ceil(resumes.length / columns)
  const pt = 0.875
  const pb = 1
  const height = 9
  const gap = 0.75

  return (
    <div
      className={`relative rounded-lg bg-neutral-100 px-4 pb-4 pt-3 transition-all ${className}`}
      style={{
        minHeight: `${top + height * rows + gap * (rows - 1) + (pt + pb)}rem`
      }}
    >
      <h2 className="text-sm font-medium text-neutral-500">{label}</h2>

      {resumes.map((resume, i) => {
        const row = Math.floor(i / columns)
        const width = `(100% - ${pt + pb}rem - ${gap * (columns - 1)}rem) / ${columns}`
        const left = `${pb}rem + ((${width}) * ${i % columns}) + ${gap * (i % columns)}rem`

        return (
          <div
            key={resume.url}
            className="absolute flex items-end overflow-hidden rounded-md bg-neutral-50 shadow-sm transition-all duration-700"
            style={{
              height: `${height}rem`,
              left: `calc(${left})`,
              top: `${top + height * row + gap * row + pt}rem`,
              width: `calc(${width})`
            }}
          >
            <span
              className="w-full bg-white px-4 py-2.5 text-sm font-medium"
              title={resume.name}
            >
              {resume.name}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default Category
