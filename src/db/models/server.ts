import { Schema, model } from 'mongoose'
import { required } from './utils'

export interface Server {
  id: string
  name: string
  owner: {
    id: string
    name: string
  }
  channels: string[]
  avator?: string
  profileInfo?: string
}

export const ServerModel = model(
  'ServerModel',
  new Schema({
    name: required(String),
    owner: required({
      id: required(String),
      name: required(String),
    }),
    channels: required([String]),
    avator: String,
    profileInfo: String,
  }),
  'SERVER',
)
