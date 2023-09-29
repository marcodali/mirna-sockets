import { WebSocketServer } from 'ws'
import http from 'http'

// Crea un servidor HTTP básico
const server = http.createServer((req, res) => {
	res.writeHead(200, { 'Content-Type': 'text/plain' })
	res.end('Servidor WebSocket en funcionamiento\n')
})

// Crea un servidor WebSocket en el mismo puerto que el servidor HTTP
const wss = new WebSocketServer({ server })

const consoleLogOriginal = console.log
console.log = (...args) => {
	sendOutputDataToMirnaUI(args)
	// Llama al console.log original
	consoleLogOriginal.apply(console, args)
}

const sendOutputDataToMirnaUI = (args) => {
	messageToAll(args
		.map(arg => {
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
		})
		.join(' '))
}

const messageToAll = (msg) => {
	for (const socket of sockets) {
		socket.send(msg)
	}
}

// COPY&PASTE code starts here
const clients = {}
const sockets = new Set()

wss.on('connection', (socket) => {

	// Eliminar el cliente desconectado del hashmap de clientes
	socket.on('close', () => {
		sockets.delete(socket)
		console.log('[S] 1 socket se fue ni pex vendrán mas, quedan=', sockets.size)
	})

	socket.on('error', (error) => {
		console.log('[S] ocurrió un error', error)
	})

	socket.onmessage = (msg) => {
		const user = JSON.parse(msg.data)
		console.log('[S] mensaje', user)
		clients[user.name] = user

		// Enviar la lista de clientes a todos los sockets conectados
		messageToAll(JSON.stringify(Object.values(clients)))
	}

	sockets.add(socket)
	console.log('[S] Nuevo cliente se ha conectado, ahora hay=', sockets.size)

})
// COPY&PASTE code ends here

// Inicia el servidor HTTP en el puerto 8080
server.listen(8080, () => {
	consoleLogOriginal('Servidor HTTP en funcionamiento en el puerto 8080')
})
