export default async function deleteWebSocketServer(req, res, next){
    try {
        const { path } = req.body
        const channel = 'delete'

        if (!path) {
            return res.status(400).send({ message: 'Path is required' })
        }
        
        // delete socket's code from database at path and trigger pub/sub redis event
        await req.redis.del(path)
        await req.redis.publish(channel, path)
        
        res.status(204).send()
    } catch (err) {
        next(err)
    }
}
