class Socket {
    constructor(url, fn, socketServer) {
        this.url = url
        this.fn = fn
        this.socketServer = socketServer
    }
    getUrl = () => this.url
    getFn = () => this.fn
    getSocketServer = () => this.socketServer
}

export { Socket }
