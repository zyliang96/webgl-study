const fsExtra = require("fs-extra");
const path = require("path");
const fs = require("fs");

function createMockUp(routerConfig) {
	fsExtra.outputFileSync(
		path.resolve(__dirname, "../../mockup.js"),
		` module.exports = ${JSON.stringify(routerConfig)}`
	);
}

function pageConfigToDir() {
	const mockPath = path.resolve(__dirname, "../../mock");
	let mockUpObj = {};
	const getPath = (filePath, parent = "") => {
		console.log(filePath, parent);
		const apiRouter = fs.readdirSync(filePath);
		if (Array.isArray(apiRouter)) {
			apiRouter.forEach((item) => {
				const parentPath = parent ? `${parent}/${item}` : `/${item}`;
				const nextPath = `${filePath}/${item}`;
				const stat = fs.lstatSync(nextPath);
				const is_direc = stat.isDirectory();
				if (is_direc) {
					getPath(nextPath, parentPath);
				} else {
					const index = item.lastIndexOf(".");
					const filename = index > -1 ? item.slice(0, index) : item;
					const mockPathUrl = parent ? `${parent}/${filename}` : `/${filename}`;
					mockUpObj[mockPathUrl] = nextPath;
				}
			});
		}
	};
	getPath(mockPath);
	return mockUpObj;
}
const mockPathObj = pageConfigToDir();

createMockUp(mockPathObj);
