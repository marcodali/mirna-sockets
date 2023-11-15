export default async function getOneWebSocketServerCode(req, res, next) {
	try {
		const { username, project } = req.query

		if (!username || !project) {
			return res.status(400).send({ message: 'Required params not provided' })
		}

        const code = await req.redis.get(`/${username}/${project}`)

		// get the code from the path key in redis
		res.status(200).json({ code })
	} catch (err) {
		next(err)
	}
}
