import WebSocket from 'ws'

const ws = new WebSocket('wss://socket.mirna.cloud/blackelephant686/rusty2/events');

ws.onclose = () => {
	console.log('[C] cerrado')
}

ws.onerror = (err) => {
	console.log('[C] error', err)
}

ws.onopen = () => {
	console.log('[C] abierto')
}

ws.onmessage = (msg) => {
	console.log('[C] mensaje', msg.data)
}
