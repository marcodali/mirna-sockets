import { WebSocketServer } from 'ws'
import http from 'http'

// Creates a basic HTTP server
const server = http.createServer((req, res) => {
	res.writeHead(200, { 'Content-Type': 'text/plain' })
	res.end('Servidor WebSocket en funcionamiento\n')
})

// Creates a WebSocket server on the same port as the HTTP server
const wss = new WebSocketServer({ server })

// COPY&PASTE code starts here
const happyEmoticons = [
	'😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆',
	'😉', '😊', '😋', '😎', '😍', '😘', '😗', '😙',
	'😚', '🙂', '🤗', '🤩', '😏', '😌', '😛', '😜',
	'😝', '🤤', '🤑', '😲', '😳', '🤪', '🥳', '😈',
]
const happyEmoticonsLength = happyEmoticons.length
const socketMatchDevelopers = new Map()
const socketMatchFlag = new Map()
const developers = {}

// Send the list of developers to all connected sockets
const broadcastDevelopersToAllConnectedSockets = () => {
	const devData = JSON.stringify(Object.values(developers))
	for (const socket of socketMatchDevelopers.keys()) {
		socket.send(devData)
	}
}

// Get a random emoticon
const getRandomEmoticon = () => happyEmoticons[
	Math.floor(Math.random() * happyEmoticonsLength)
]

const getCountryData = async (ipAddress) => {
	try {
		const response = await axios.get(`http://ip-api.com/json/${ipAddress}`)
		return response.data.countryCode
	} catch (error) {
		console.error('Error fetching country data:', error)
		// NP = Nepal, BT = Bhutan
		return Math.random() > 0.5 ? 'NP' : 'BT'
	}
}

const getCountryEmoji = (countryCode) => countryCode.replace(/./g,(ch)=>String.fromCodePoint(0x1f1a5+ch.toUpperCase().charCodeAt()))

const cleanString = (str) => str.replace(/[^a-zA-Z]+/g, '')

wss.on('connection', async (ws, req) => {

	// Delete the recently disconnected socket from the hashmap
	ws.on('close', () => {
		const deadDevelopers = socketMatchDevelopers.get(ws)
		const msg = `This socket was linked to ${Array.from(deadDevelopers).join(', ') || 'None'}, but has gone away`
		socketMatchDevelopers.delete(ws)
		socketMatchFlag.delete(ws)
		for (const developer of deadDevelopers) {
			developers[developer].state = '🔴'
		}
		console.log(
			msg + ', there',
			socketMatchDevelopers.size <= 1 ? 'is' : 'are',
			socketMatchDevelopers.size == 0 ? 'None' : socketMatchDevelopers.size,
			'left',
		)
		broadcastDevelopersToAllConnectedSockets()
	})

	// Handle errors
	ws.on('error', error => console.error('Megaerror happened:', error))

	// Handle received messages
	ws.onmessage = (msg) => {
		const username = cleanString(msg.data)
		console.log('message received:', username)
		if (username === 'Mirna') {
			socketMatchDevelopers.clear()
			socketMatchFlag.clear()
			Object.keys(developers).forEach(key => delete developers[key])
			return
		}
		developers[username] = {
			name: username,
			state: getRandomEmoticon(),
			from: socketMatchFlag.get(ws),
		}
		socketMatchDevelopers.get(ws)?.add(username)
		broadcastDevelopersToAllConnectedSockets()
	}

	// Add the recently connected socket to the Map
	const ipAddress = (req.headers['x-forwarded-for']?.split(',')[0].trim()) || req.socket.remoteAddress
	const countryCode = await getCountryData(ipAddress)
  	const emoji = getCountryEmoji(countryCode)
	if (!socketMatchDevelopers.has(ws)) {
		socketMatchDevelopers.set(ws, new Set())
		console.log('New socket online, new size is =', socketMatchDevelopers.size)
	}
	if (!socketMatchFlag.has(ws)) {
		socketMatchFlag.set(ws, emoji)
	}

	// Send the list of developers to the recently connected socket
	ws.send(JSON.stringify(Object.values(developers)))

})
// COPY&PASTE code ends here

// Starts the HTTP server on port 8080
server.listen(8080, () => {
	console.log('HTTP server running on port 8080')
})
