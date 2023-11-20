export const argumentToString = (arg) => {
	let result
	if (arg === null) {
		result = 'null'
	} else if (arg === undefined) {
		result = 'undefined'
	} else if (arg instanceof Date) {
		result = arg.toLocaleString()
	} else if (arg instanceof Error) {
		result = arg.toString()
	} else if (arg instanceof Map) {
		result = `Map(${arg.size}) ${JSON.stringify([...arg])}`
	} else if (arg instanceof Set) {
		result = `Set(${arg.size}) ${JSON.stringify([...arg])}`
	} else if (arg instanceof Function) {
		result = arg.toString()
	} else if (arg instanceof Object) {
		result = JSON.stringify(arg)
	} else {
		result = arg
	}
	return result
}

export const createGenericWebSocketServer = (path) => {
	return function _createGenericWebSocketServer(socket) {

		// Handle disconnection
		socket.on('close', () => console.debug('Client has gone from %s', path))

		// Handle errors
		socket.on('error', (error) => console.error('A socket error has ocurred for %s', path, error))

		// Handle incoming messages
		socket.onmessage = (msg) => { }

		console.debug('New client has been connected to %s', path)

	}
}
