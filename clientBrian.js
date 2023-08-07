import WebSocket from 'ws';

const ws = new WebSocket('ws://localhost:5000/ws/brian/tinderbook');

ws.on('error', console.error);

ws.on('open', () => {
  ws.send('soy briandeveloper.tk')
});

ws.on('message', (data) => {
  console.log('received: %s', data)
})
