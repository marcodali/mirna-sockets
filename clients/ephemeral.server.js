import { WebSocketServer } from 'ws'
import http from 'http'

// Crea un servidor HTTP básico
const server = http.createServer((req, res) => {
	res.writeHead(200, { 'Content-Type': 'text/plain' })
	res.end('Servidor WebSocket en funcionamiento\n')
})

// Crea un servidor WebSocket en el mismo puerto que el servidor HTTP
const wss = new WebSocketServer({ server })

// COPY&PASTE code starts here
const clients = {}
const sockets = new Set()
const messageToAll = (msg) => {
	for (const socket of sockets) {
		socket.send(msg)
	}
}

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
