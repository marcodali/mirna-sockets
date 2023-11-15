import { readdirSync } from 'fs'
import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// map the method name to the HTTP method
const methodsMatch = {
	'create': 'post',
	'delete': 'delete',
	'getOne': 'get',
	'getAll': 'get',
	'update': 'put',
}

// get this file's parent folder
export const parentFolder = dirname(fileURLToPath(import.meta.url))

export const injectRoutes = async (app, moduleName) => {
	// read all files in the module name folder and dynamically import them
	const filenames = readdirSync(join(parentFolder, moduleName))
	for (const file of filenames) {
		const { default: myRoute } = await import(`./${moduleName}/${file}`)

		// inject every module route into the app
		const method = methodsMatch[file.substring(0, 6)]
		if (method && file.substring(0, 6) === 'getOne') {
			app[method](`/${moduleName}/:id`, express.json(), myRoute)
		} else {
			app[method](`/${moduleName}`, express.json(), myRoute)
		}
	}
}

// read folder names in this location and return an array of them
export const listDirectories = path => readdirSync(path, { withFileTypes: true })
	.filter(file => file.isDirectory())
	.map(directory => directory.name)
	.sort()
