const pageConfig = require("../../src/pageConfig");
const path = require("path");
const cwd = process.cwd();
const targetPath = path.resolve(__dirname, "../../src/pages");
const fs = require("fs-extra");
const typeMap = {
	empty: "./template/empty",
};

function check(routeConfig) {
	let path = routeConfig.map((item) => item.path);
	path = Array.from(new Set(path));
	if (path.length !== routeConfig.length) {
		console.log("存在重复url，请检查");
	}
}

function pageConfigToDir() {
	let result = [];
	let routeConfig = [];
	const walk = (arr, parent) => {
		arr.forEach((item) => {
			const obj = {
				filePath: "",
				key: item.key,
				path: item.path,
				name: item.name,
				componentPath: "",
				type: item.type,
				className: item.className,
			};
			if (parent) {
				if (!parent.path) {
					// 父级只是结构节点
					obj.filePath = parent.filePath + "/" + item.key;
					obj.componentPath = item.path
						? `${parent.filePath.substring(1)}/${item.key}/index.js`
						: "";
				} else {
					// 父级也是页面
					obj.filePath = parent.filePath + "/children/" + item.key;
					obj.componentPath = item.path
						? `${parent.filePath.substring(1)}/children/${item.key}/index.js`
						: "";
				}
			} else {
				obj.filePath = "./" + item.key;
				obj.componentPath = item.path ? `/${item.key}/index.js` : ``;
			}
			result.push(obj);
			if (item.path) {
				routeConfig.push({
					path: item.path,
					componentPath: obj.componentPath,
					name: item.name,
					type: item.type,
				});
			}
			Array.isArray(item.children) && walk(item.children, obj);
		});
	};
	walk(Object.keys(pageConfig).map((key) => pageConfig[key]));
	return { filePath: result, routeConfig };
}

function titleUpperCase(text) {
	// 首字母大写
	return text.charAt(0).toUpperCase() + text.slice(1);
}

function hyphenate(str) {
	//驼峰转中划线
	const hyphenateRE = /\B([A-Z])/g;
	return str.replace(hyphenateRE, "-$1").toLowerCase();
}

function creatFile(dir, route,index) {
	const jsFile = path.resolve(dir, "./index.js");
	const cssFile = path.resolve(dir, "./index.less");
	const { type = "empty", key, className } = route;
	const templatePath = typeMap[type] ? typeMap[type] : typeMap["empty"];
	if (!fs.pathExistsSync(jsFile)) {
		let jsTemplate = fs.readFileSync(
			path.resolve(__dirname, templatePath + "/index.js"),
			"utf8"
		);
		jsTemplate = jsTemplate
			// .replace(/__functionName/g, titleUpperCase(key))
			// .replace(/__className/g, hyphenate(key));
			.replace(/__functionName/g, 'index')
			.replace(/__className/g, `index-${index}`);
		fs.outputFileSync(jsFile, jsTemplate);
	}
	if (!fs.pathExistsSync(cssFile)) {
		let cssTemplate = fs.readFileSync(
			path.resolve(__dirname, templatePath + "/index.less"),
			"utf8"
		);
		cssTemplate = cssTemplate.replace(/__className/g, className || hyphenate(key));
		fs.outputFileSync(cssFile, cssTemplate);
	}
}

function createRouteConfig(routerConfig) {
	fs.outputFileSync(
		path.resolve(__dirname, "../../src/router/routerConfig.js"),
		` export default  ${JSON.stringify(routerConfig)}`
	);
}

function createPage() {
	const { filePath, routeConfig } = pageConfigToDir();
	check(routeConfig);
	createRouteConfig(routeConfig);
	filePath.forEach((item,index) => {
		const currentPath = path.resolve(targetPath, item.filePath);
		fs.ensureDirSync(currentPath);
		if (item.path) {
			// 当前是页面
			creatFile(currentPath, item,index);
		}
	});
}

createPage();
