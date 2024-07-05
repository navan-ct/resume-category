import { Schema, model, type Types } from 'mongoose'

export interface IResume {
  name: string
  url: string
  category: Types.ObjectId
}

const resumeSchema = new Schema<IResume>({
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  }
})

const Resume = model<IResume>('Resume', resumeSchema)

export default Resume
