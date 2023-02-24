import { Schema, model } from 'mongoose'
import { required } from './utils'

export interface User {
  id: string
  name: string
  hashTag: string
  avator: string
  gender?: string
  profileInfo?: string
}

export type UserOverview = Pick<User, 'name' | 'avator'> & { userId: string }
export const UserOverViewSchema = {
  name: required(String),
  avator: required(String),
  userId: required(String),
}

export const UserModel = model(
  'UserModel',
  new Schema({
    name: required(String),
    hashTag: required(String),
    avator: required(String),
    gender: String,
    profileInfo: String,
  }),
  'USER',
)
