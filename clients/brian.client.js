import WebSocket from 'ws'

const ws = new WebSocket('wss://socket.mirna.cloud/brownbird951/mommy');

const pedro = {
	name: 'Lucero',
	status: 'online',
};

ws.onclose = () => {
	console.log('[C] cerrado')
}

ws.onerror = (err) => {
	console.log('[C] error', err)
}

ws.onopen = () => {
	console.log('[C] abierto')
	ws.send(JSON.stringify(pedro))
}

ws.onmessage = (msg) => {
	console.log('[C] mensaje', msg.data)
}
