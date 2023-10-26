import { redisMapListener } from '../servers/api-socket.server.js'

export default function messageListener(channel, message) {
	if (channel in redisMapListener) {
		redisMapListener[channel](message)
	}
}
