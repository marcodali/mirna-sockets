import { Socket } from '../models/socket.model.js'

const urlMapSocket = new Map()

const getAllPaths = () => Array.from(urlMapSocket.keys())

const getOneSocket = (path) => urlMapSocket.get(path)

const createSocket = (path, fn, webSocketServer) => {
    if (urlMapSocket.get(path)) {
        throw new Error(`Socket ${path} already exists`)
    }
    urlMapSocket.set(path, new Socket(path, fn, webSocketServer))
    return urlMapSocket.get(path)
}

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
