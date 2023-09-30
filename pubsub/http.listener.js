export default function httpListener(name, PORT) {
	return function _httpListener(err) {
		if (err) {
			console.error(err)
			process.exit(0)
		}
		console.info(`${name} Server listening at http://localhost:${PORT}`)
	}
}
