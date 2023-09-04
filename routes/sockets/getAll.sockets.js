// TODO: this endpoint should be protected from public access
export default async function getAllWebSocketServers(req, res, next){

    // get all paths from redis database and return them
    res.json({
        paths: await req.redis.keys('*'),
    })
}
