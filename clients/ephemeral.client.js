import WebSocket from 'ws'

const ws = new WebSocket('ws://localhost:8080/');

const pedro = {
	name: 'Marinoeta',
	status: 'offline',
};

ws.onclose = () => {
	console.log('[C] cerrado')
}

ws.onerror = (err) => {
	console.log('[C] error', err)
}

ws.onopen = () => {
	console.log('[C] abierto, sending message...')
	ws.send(JSON.stringify(pedro))
}

ws.onmessage = (msg) => {
	console.log('[C] mensaje', msg.data)
}
