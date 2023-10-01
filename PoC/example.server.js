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
const happyEmoticons = [
	'😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆',
	'😉', '😊', '😋', '😎', '😍', '😘', '😗', '😙',
	'😚', '🙂', '🤗', '🤩', '😏', '😌', '😛', '😜',
	'😝', '🤤', '🤑', '😲', '😳', '🤪', '🥳', '😈',
]
const socketMatchDevelopers = new Map()
const developers = {}

// Enviar la lista de developers a todos los sockets conectados
const broadcastDevelopersToAllConnectedSockets = () => {
	for (const socket of socketMatchDevelopers.keys()) {
		socket.send(JSON.stringify(Object.values(developers)))
	}
}

const getRandomEmoticon = () => happyEmoticons[
	Math.floor(Math.random() * happyEmoticons.length)
]

wss.on('connection', (ws) => {

	// Eliminar del hashmap el socket recien desconectado
	ws.on('close', () => {
		const deadDevelopers = socketMatchDevelopers.get(ws)
		const msg = `[S] El socket, que estaba linkeado a ${
			Array.from(deadDevelopers)
		}, se fué 🙁 ni pex vendrán mas`;
		socketMatchDevelopers.delete(ws)
		for (const developer of deadDevelopers) {
			developers[developer].state = '🔴'
		}
		console.log(msg + ', ahora hay=', socketMatchDevelopers.size)
		broadcastDevelopersToAllConnectedSockets()
	})

	// Manejar errores
	ws.on('error', (error) => {
		console.log('[S] Se me salio de control algo', error)
	})

	// Manejar mensajes
	ws.onmessage = (msg) => {
		const username = msg.data
		console.log('[S] username received', username)
		developers[username] = {
			name: username,
			state: getRandomEmoticon(),
		}
		socketMatchDevelopers.get(ws).add(username)
		broadcastDevelopersToAllConnectedSockets()
	}

	// Agregar al Map el socket recien conectado
	if (!socketMatchDevelopers.has(ws)) {
		socketMatchDevelopers.set(ws, new Set())
		console.log(
			'[S] Nuevo socket se ha conectado, ahora hay=',
			socketMatchDevelopers.size,
		)
	} else {
		console.log('[S] Viejo socket se ha conectado')
	}

	// Enviar la lista de developers al socket recien conectado
	ws.send(JSON.stringify(Object.values(developers)))

})
// COPY&PASTE code ends here

// Inicia el servidor HTTP en el puerto 8080
server.listen(8080, () => {
	consoleLogOriginal('Servidor HTTP en funcionamiento en el puerto 8080')
})
