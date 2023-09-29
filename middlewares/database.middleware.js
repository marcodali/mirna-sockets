import { redis } from '../servers/api.server.js'

export const dbConnection = (req, res, next) => {
	req.redis = redis
	return next()
}
