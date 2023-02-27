import consola from 'consola'
import type { RawData, WebSocket } from 'ws'
import JWT from 'jsonwebtoken'
import { secretKey } from '../consts'
import type { WSMessagePayload } from './types'

export function jsonParse<T>(ws: WebSocket, data: RawData) {
  try {
    const json = JSON.parse(data.toString())
    return json as T
  }
  catch (e) {
    consola.error('[ws]: JSON parse error')
    ws.send(createWSError(500, '[ws]: JSON parse error'))
  }
}

export function jsonStringfy<T>(ws: WebSocket, data: T) {
  try {
    const json = JSON.stringify(data)
    return json
  }
  catch (e) {
    consola.error('[ws]: JSON stringfy error')
    ws.send(createWSError(500, '[ws]: JSON stringfy error'))
  }
}

export function createWSOK<T>(data: T) {
  return JSON.stringify({
    code: 200,
    data,
  })
}

export function createWSError(code: 401 | 500 | 388, message: string) {
  return JSON.stringify({
    code,
    message,
  })
}

export function athorization(payload: WSMessagePayload) {
  if (!payload.token)
    return false
  const { token } = payload
  try {
    JWT.verify(
      token,
      secretKey,
    )
    return true
  }
  catch (e: any) {
    consola.error(e.message)
    return false
  }
}

export function createChannelSetMap() {
  const channelSetMap = new Map<string, Set<WebSocket>>()

  function add(channelId: string, ws: WebSocket) {
    if (channelSetMap.has(channelId)) {
      const set = channelSetMap.get(channelId)!
      set.add(ws)
    }
    else {
      const set = new Set<WebSocket>([ws])
      channelSetMap.set(channelId, set)
    }
  }

  function remove(channelId: string, ws: WebSocket) {
    if (channelSetMap.has(channelId))
      channelSetMap.get(channelId)!.delete(ws)
  }

  return {
    channelSetMap,
    add,
    remove,
  }
}
