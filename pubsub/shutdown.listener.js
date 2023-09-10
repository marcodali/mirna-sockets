export default function shutDown(name, signal, server, databases = []) {
    return function _shutDown() {
        console.log(`Received ${signal}, shutting down ${name} gracefully`)
        databases.forEach(db => db.quit())
        server.close(() => process.exit(0))
    }
}
