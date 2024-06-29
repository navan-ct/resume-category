import { Schema, model } from 'mongoose'

export interface ICategory {
  name: string
}

const categorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: true,
    unique: true
  }
})

const Category = model<ICategory>('Category', categorySchema)

export default Category
