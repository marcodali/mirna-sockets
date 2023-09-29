import 'dotenv/config'
import Redis from 'ioredis'

export default function createRedis() {
	return new Redis({
		port: process.env.REDIS_PORT,
		host: process.env.REDIS_HOST,
		password: process.env.API_REDIS_PASSWORD,
		username: process.env.API_REDIS_USERNAME,
	})
}