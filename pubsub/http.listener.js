import { PORT } from '../servers/socket.server.js'

export default function httpListener(err) {
    if (err) {
      console.error(err)
      process.exit(0)
    }
    console.log(`Socket Server listening at http://localhost:${PORT}`)
}
