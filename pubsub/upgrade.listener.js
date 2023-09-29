import { parse } from 'url'

import { socketProvider } from '../providers/socket.provider.js'

export default function upgradeListener(request, socket, head) {
	const { pathname } = parse(request.url)

	const wss = socketProvider.getOneSocket(pathname)?.getSocketServer()
	if (wss) {
		wss.handleUpgrade(request, socket, head, (ws) => {
			wss.emit('connection', ws, request)
		})
	} else {
		socket.destroy()
	}
}
