import WebSocket from 'ws';

const PORT = process.env.PORT || 2000
const ws = new WebSocket(`ws://localhost:${PORT}/frank/tecuidamos`);

ws.on('error', console.error);

ws.on('open', () => {
	ws.send('soy fr4nky developer')
});

ws.on('message', (data) => {
	console.log('received: %s', data)
})
