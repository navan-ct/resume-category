import { Schema, model, type Types } from 'mongoose'

export interface ICategory {
  name: string
  resumes: Types.ObjectId[]
}

const categorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: true,
    unique: true
  },
  resumes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Resume'
    }
  ]
})

const Category = model<ICategory>('Category', categorySchema)

export default Category
