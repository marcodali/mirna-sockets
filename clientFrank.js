import WebSocket from 'ws';

const ws = new WebSocket('ws://localhost:5000/ws/frank/tecuidamos');

ws.on('error', console.error);

ws.on('open', () => {
  ws.send('soy fr4nky developer')
});

ws.on('message', (data) => {
  console.log('received: %s', data)
})
