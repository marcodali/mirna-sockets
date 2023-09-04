import { injectRoutes, listDirectories, parentFolder } from './utils.js'

// read folder names in this location and create an array of them
const moduleNames = listDirectories(parentFolder)

export default async function InjectRoutes(app) {
    for (const moduleName of moduleNames) {
        await injectRoutes(app, moduleName)
    }
}
