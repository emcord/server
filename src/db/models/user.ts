import { Schema, model } from 'mongoose'
import { required } from './utils'

export interface User {
  name: string
  hashTag: string
  avator: string
  gender?: string
  profileInfo?: string
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
