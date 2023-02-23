import { Schema, model } from 'mongoose'

const userSchema = new Schema({
  name: String,
  hashTag: String,
  gender: String,
  avator: String,
  profileInfo: String,
  password: String,
  settings: {
    allowAddMe: Boolean,
    theme: String,
  },
})

export const UserModel = model('UserModel', userSchema, 'USER')
