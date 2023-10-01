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
	} else if (arg instanceof Map || arg instanceof Set) {
		result = JSON.stringify([...arg])
	} else if (arg instanceof Function) {
		result = arg.toString()
	} else if (arg instanceof Object) {
		result = JSON.stringify(arg)
	} else {
		result = arg
	}
	return result
}

export const createGenesisWebSocketServer = (path, genesisSockets) => {
	return function _createGenesisWebSocketServer(socket) {

		// Handle disconnection
		socket.on('close', () => {
			genesisSockets.delete(socket)
			console.debug(
				'[S] for %s a genesis socket has gone, total=%d',
				path,
				genesisSockets.size,
			)
		})

		// Handle errors
		socket.on('error', (error) => {
			console.error(
				'[S] for %s a genesis socket error has ocurred,',
				path,
				error,
			)
		})

		// Handle incoming messages
		socket.onmessage = (msg) => { }

		// Add socket to the set
		genesisSockets.add(socket)
		console.debug(
			'[S] for %s new genesis socket has been added, total=%d',
			path,
			genesisSockets.size,
		)

	}
}
