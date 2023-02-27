import { URL } from 'url'
import { WebSocket, WebSocketServer } from 'ws'
import consola from 'consola'
import { useMessageModel } from '../db/models'
import { athorization, createChannelSetMap, createWSError, createWSOK, jsonParse, jsonStringfy } from './utils'
import type { WSMessagePayload } from './types'

export function initWSS(path: string, port: number) {
  const wss = new WebSocketServer({
    path,
    port,
  })

  const { channelSetMap, add, remove } = createChannelSetMap()

  wss.on('connection', (ws, req) => {
    const params = new URL(`ws://localhost:9527${req.url!}`).searchParams
    const channelId = params.get('channelId')
    if (!channelId) {
      ws.close()
      return
    }
    consola.success(`Connected to channel ${channelId}`)
    add(channelId, ws)

    ws.on('error', console.error)

    ws.on('message', async (data) => {
      const payload = jsonParse<WSMessagePayload>(ws, data)
      if (payload && payload.channelId === channelId) {
        if (athorization(payload)) {
          const model = useMessageModel(channelId)
          try {
            const result = await model.create(payload)
            spread(channelId, ws, payload)
            ws.send(createWSOK(result))
          }
          catch (e) {
            ws.send(createWSError(388, `Database add error: ${e}`))
          }
        }
        else {
          ws.send(createWSError(401, 'Unauthorized'))
        }
      }
      else {
        ws.send(createWSError(388, 'Payload should has the matched channelId with your channel'))
      }
    })

    ws.on('close', () => {
      consola.error(`${channelId} closed`)
      remove(channelId, ws)
    })

    ws.send('WebSocket connected')
  })

  function spread(channelId: string, source: WebSocket, newMessage: WSMessagePayload) {
    channelSetMap.get(channelId)?.forEach(client => {
      if (source !== client && client.readyState === WebSocket.OPEN) {
        const msg = jsonStringfy(client, newMessage)
        if (msg)
          client.send(msg)
      }
    })
  }
}
