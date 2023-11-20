/**
 * Socket model
 * @property {string} url - The url (project path) of the socket. Example: /username/project
 * @property {Function} fn - The function code to be executed. This is callable code
 * @property {WebSocketServer} socketServer - The WebSocketServer instance
 */
class Socket {
    constructor(url, fn, socketServer) {
        this.url = url
        this.fn = fn
        this.socketServer = socketServer
    }

    // Getters
    getUrl = () => this.url
    getFn = () => this.fn
    getSocketServer = () => this.socketServer

    // Setters
    setUrl = (url) => this.url = url
    setFn = (fn) => this.fn = fn
    setSocketServer = (socketServer) => this.socketServer = socketServer
}

export { Socket }
