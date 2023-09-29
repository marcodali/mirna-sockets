export const requestLogger = (options) => (req, res, next) => {
	const timestamp = new Date().toLocaleString()
	const { method, url, hostname } = req
	console.log(`at ${timestamp} from ${hostname} ${method} ${url}`)
	next()
}

// TODO: implement responseLogger middleware
export const responseLogger = () => (req, res, next) => {
	next()
}

export const errorHandler = (err, req, res, next) => {
	console.error('Middleware Error Handling', err)
	res.status(err.statusCode || 500).send(err?.message || 'Algo malo paso')
}
