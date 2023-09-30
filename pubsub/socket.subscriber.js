import { channels } from '../servers/socket.server.js'

export default function socketSubscriber(err, count){
    if (err) {
      console.error('At redis subscription something went wrong', err)
    }
    console.info(`Subscribed to ${
    	count
    } channel(s) Listening for messages on the [${
    	channels
    }] channel(s).`)
}
