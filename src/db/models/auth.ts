import type { ObjectId } from 'mongoose'
import { Schema, model } from 'mongoose'
import { required } from './utils'

export interface Auth {
  userId: ObjectId
  email: string
  password: string
}

export const AuthModel = model(
  'AuthModel',
  new Schema({
    userId: required(String),
    email: required(String),
    password: required(String),
  }),
  'AUTH',
)
