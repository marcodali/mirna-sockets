import { injectRoutes, listDirectories, parentFolder } from './utils.js'

// read folder names in this location and create an array of them
const moduleNames = listDirectories(parentFolder)

// inject routes for all modules
export default async function InjectAllRoutes(app) {
	for (const moduleName of moduleNames) {
		await injectRoutes(app, moduleName)
	}
}

// inject routes for health module
const injectHealthRoutes = async (app) => {
	await injectRoutes(app, moduleNames[0])
}

// inject routes for socket module
const injectSocketRoutes = async (app) => {
	await injectRoutes(app, moduleNames[1])
}

export { injectHealthRoutes, injectSocketRoutes }
