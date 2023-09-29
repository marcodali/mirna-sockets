import { Socket } from '../models/socket.model.js'

// Map<url, Socket>
const urlMapSocket = new Map()

// Returns an array of paths
const getAllPaths = () => Array.from(urlMapSocket.keys())

// Returns a Socket model instance
const getOneSocket = (path) => urlMapSocket.get(path)

// Create a new Socket model instance and returns it
const createSocket = (path, fn, webSocketServer, genesisSockets) => {
    if (urlMapSocket.get(path)) {
        throw new Error(`Socket ${path} already exists`)
    }
    urlMapSocket.set(path, new Socket(path, fn, webSocketServer, genesisSockets))
    return urlMapSocket.get(path)
}

/**
 * TODO: not only delete the socket from the map,
 * but also stop dynamic code execution and free the memory
 */
const deleteSocket = (path) => {
    if (!urlMapSocket.get(path)) {
        throw new Error(`Socket ${path} does not exists`)
    }
    urlMapSocket.delete(path)
}

export const socketProvider = {
    getAllPaths,
    getOneSocket,
    createSocket,
    deleteSocket,
}
