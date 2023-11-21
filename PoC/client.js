import 'dotenv/config'
import WebSocket from 'ws'

const ws = new WebSocket(process.env.EXAMPLE_SERVER_URL)

ws.onclose = () => {
	console.log('[C] me cerraron la conexión que gachos')
}

ws.onerror = (err) => {
	console.log('[C] sufri un error inesperado', err)
}

// process.argv[0] es la ruta al ejecutable de Node.js
// process.argv[1] es la ruta al script que se está ejecutando
// Los argumentos reales comienzan en process.argv[2]
ws.onopen = () => {
	const primerArgumento = process.argv[2];
	console.log('[C] el socket se ha abierto, enviaré mi nombre', primerArgumento)
	ws.send(primerArgumento)
}

ws.onmessage = (msg) => {
	console.log('[C] el server me mando un msg, pa k o khe?', msg.data.toString())
}
