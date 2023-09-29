/**
 * Socket model
 * @typedef {Object} Socket
 * @property {string} url - The url of the socket
 * @property {Function} fn - The function to be executed
 * @property {WebSocketServer} socketServer - The WebSocketServer instance
 * @property {Set} genesisSockets - The genesis sockets
 * @property {Function} getUrl - The url getter
 * @property {Function} getFn - The fn getter
 * @property {Function} getSocketServer - The socketServer getter
 * @property {Function} getGenesisSockets - The genesisSockets getter
 */
class Socket {
    constructor(url, fn, socketServer, genesisSockets = new Set()) {
        this.url = url
        this.fn = fn
        this.socketServer = socketServer
        this.genesisSockets = genesisSockets
    }
    getUrl = () => this.url
    getFn = () => this.fn
    getSocketServer = () => this.socketServer
    getGenesisSockets = () => this.genesisSockets
}

export { Socket }
