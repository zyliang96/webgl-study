import common from "./modules/common";

let obj = {
	...common,
};

const baseUrl = "/warehouseManage";
Object.keys(obj).forEach((key) => {
	obj[key] =
		obj[key][0] === "/" ? baseUrl + obj[key] : baseUrl + "/" + obj[key];
});
export default obj;
