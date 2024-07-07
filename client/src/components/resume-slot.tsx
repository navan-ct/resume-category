import useDrop from '../hooks/use-drop'

export interface ResumeProps {
  _id: string
  category: string
  index: number
}

const ResumeSlot = ({ _id, category, index }: ResumeProps) => {
  const { drop } = useDrop(_id, category, index)

  return <div ref={(node) => drop(node)} className="h-36" />
}

export default ResumeSlot
