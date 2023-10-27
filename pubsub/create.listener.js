import { WebSocketServer } from 'ws'

import { redis } from '../servers/api-socket.server.js'
import { socketProvider } from '../providers/socket.provider.js'
import { argumentToString, createGenesisWebSocketServer } from './utils.js'

// Listening pub/sub redis events
export default async function listenerCreate(path) {

	// If the socket already exists, we don't want to create it again
	if (socketProvider.getOneSocket(path)) {
		throw new Error('Socket already exists')
	}

	// Save the original console.log function reference
	const originalConsoleLog = console.log

	// We need to override the console.log function behavior
	console.log = (...args) => {
		// First, we send the console.log output to the UI
		sendOutputDataToMirnaUI(args)
		// Second, we call the original console.log function
		originalConsoleLog.apply(console, args)
	}

	const sendOutputDataToMirnaUI = args => sendMessageToGenesisSockets(
		args.map(argumentToString).join(' ')
	)

	/**
	 * What is a genesis socket?
	 * A genesis socket is a nickname for the socket that
	 * is connected to the /username/project/events path.
	 * This socket is responsible for sending to the UI
	 * the console.log output generated on backend side
	 * by the dynamic user code execution. It can be one or more
	 */
	const sendMessageToGenesisSockets = (msg) => {
		const howManyGenesisSockets = socketProvider.getOneSocket(path)?.getGenesisSockets().size || 0
		if (howManyGenesisSockets === 0) {
			return
		}
		for (const socket of socketProvider.getOneSocket(path).getGenesisSockets()) {
			socket.send(msg)
		}
	}

	// Get the code as string from redis
	const code = await redis.get(path)
	const userWrittenWSS = new WebSocketServer({ noServer: true })
	// Create a function from the code string
	const codeRunner = new Function('wss', 'console', code)

	/**
	 * Create another websocket server so we
	 * can send to the UI the console.log messages
	 * generated by the user code
	 */
	const userInterfaceEventsWSS = new WebSocketServer({ noServer: true })
	const genesisSockets = new Set()
	userInterfaceEventsWSS.on('connection',
		createGenesisWebSocketServer(path, genesisSockets)
	)

	/**
	 * Both WebSocketServer are running now, but in order
	 * for them to be publicly accessible we must register
	 * them within the socketProvider
	 */
	socketProvider.createSocket(
		path,
		codeRunner,
		userWrittenWSS,
		genesisSockets,		// why do we need to pass the genesisSockets here?
	)
	socketProvider.createSocket(
		`${path}/events`,
		() => { },
		userInterfaceEventsWSS,
		// why we don't pass the genesisSockets here?
	)

	// we need to test all cases: 10, 01, 11, 00

	// let's delay the execution of the dynamic code for 3 seconds
	setTimeout(() => {
		// dynamic code execution (aka DCE) from the user input code starts here
		console.info('DCE:OUTPUT for path', path)
		try {
			codeRunner(userWrittenWSS, console)
		} catch (error) {
			console.log(
				'At dynamic code execution something went wrong',
				error.message,
			)
			console.debug('Full Error Stack', error)
			const customError = new Error('Faltal Error Kill Everything')
			customError.details = {
				reason: error.message,
				path,
			}
			throw customError
		}
		// DCE from the user input code ends here
	}, 3*1000)
}
