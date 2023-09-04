class Socket {
    constructor(url, fn, socketServer) {
        this.url = url
        this.fn = fn
        this.socketServer = socketServer
    }
    getUrl() {
        return this.url
    }
    getFn() {
        return this.fn
    }
    getSocketServer() {        
        return this.socketServer
    }
}

export { Socket }
