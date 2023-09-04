import createRedis from '../factories/redis.factory.js'

export const dbConnection = (req, res, next) => {
    req.redis = createRedis()
    return next()
}
