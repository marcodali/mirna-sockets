import { strict as assert } from 'assert'
import { channels } from '../servers/api-socket.server.js'

export default function socketSubscriber(err, count){
    if (err) {
      console.error('At redis subscription something went wrong', err)
    }
    console.info(`Subscribed to channels [${
      channels
    }] We are ready and listening for messages...`)
    assert.strictEqual(count, channels.length, 'We are not subscribed to all channels')
}
