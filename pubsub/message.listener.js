import { redisMapListener } from '../servers/api-socket.server.js'

export default function messageListener(channel, message) {
	if (channel in redisMapListener) {
		try {
			redisMapListener[channel](message)
		} catch (error) {
			/**
			 * Delete the code from redis if an
			 * Faltal Error Kill Everything exception is thrown
			 */
			if (error.details) {
				console.debug(
					'Paso:',
					error.message,
					'Y por esta razón:',
					error.details.reason,
					'Se borrará el código de redis'
				)
				redis.del(error.details.path)
			}
		}
	}
}
