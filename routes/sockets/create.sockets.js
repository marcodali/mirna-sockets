export default async function createWebSocketServer(req, res, next) {
	try {
		const path = `/${req.body.username}/${req.body.project}`
		const channel = 'create'
		let protocol, host, port

		console.log(req.body.code)

		if (process.env.NODE_ENV === 'production') {
			protocol = 'wss'
			host = 'socket.mirna.cloud'
			port = ''
		} else {
			protocol = 'ws'
			host = 'localhost'
			port = ':' + process.env.SOCKET_PORT
		}

		if (await req.redis.exists(path)) {
			return res.status(400).json({
				message: 'WebSocketServer already exists try with another project name',
			})
		}

		// save code into redis database and trigger pub/sub redis event
		await req.redis.set(path, req.body.code)
		await req.redis.publish(channel, path)

		res.status(201).json({
			message: 'WebSocketServer created successfully',
			uri: `${protocol}://${host}${port}${path}`,
		})
	} catch (err) {
		next(err)
	}
}
