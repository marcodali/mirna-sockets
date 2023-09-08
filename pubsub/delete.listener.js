import { socketProvider } from '../providers/socket.provider.js'

// Listening pub/sub redis events
export default function listenerDelete(path) {
  if (socketProvider.getOneSocket(path)) {
    socketProvider.deleteSocket(path)
  }
}
