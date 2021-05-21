export class ShapeGeo {
	constructor(config = {}) {
		const { pathData = [], params = ["x", "y"] } = config;
		this.pathData = pathData; // 平展开的路径数据
		this.geoData = []; // 由路径数据pathData 转成的对象型数组
		this.triangles = []; // 三角形集合，对象型数组
		this.vertices = []; // 平展开的对立三角形顶点集合
		this.params = params;
		this.parsePath();
		this.update();
	}

	/**
	 * 更新方法，基于pathData 生成vertices
	 */
	update() {
		this.vertices = [];
		this.triangles = [];
		const list = [].concat(this.geoData);
		// 寻找三角形
		this.findTriangle(0, list);
		// 更新三角形
		this.updateVertices();
	}

	/**
	 * 基于路径数据pathData 转成对象型数组
	 */
	parsePath() {
		let result = [];
		const { pathData, params } = this;
		for (let i = 0, len = pathData.length; i < len; i = i + params.length) {
			let obj = {};
			let count = 0;
			params.forEach((item) => {
				obj[item] = pathData[count + i];
				count++;
			});
			result.push(obj);
		}
		this.geoData = result;
	}

	/**
	 * 寻找符合条件的三角形
	 * @param i 顶点在geoData 中的索引位置，表示从哪里开始寻找三角形
	 */
	findTriangle(i, list = []) {
		const len = list.length;
		// 如果
		if (list.length <= 3) {
			this.triangles.push([...list]);
		} else {
			// 初始点位
			const [v0, v1, v2] = [i % len, (i + 1) % len, (i + 2) % len];
			const triangle = [list[v0], list[v1], list[v2]];
			if (this.cross(triangle) > 0 && !this.includePoint(triangle)) {
				this.triangles.push(triangle);
				list.splice(v1, 1);
			}
			this.findTriangle(v1, list);
		}
	}

	/**
	 * 判断三角形中是否有其它顶点
	 * 原理：遍历点位，
	 * @param triangle 三角形
	 */
	includePoint(triangle) {
		let result = false;
		for (let ele of this.geoData) {
			if (!triangle.includes(ele)) {
				if (this.inTriangle(ele, triangle)) {
					result = true;
				}
			}
		}
		return result;
	}

	/**
	 * 判断一个顶点是否在三角形中
	 * 判断的原理是，判断这个点与三角形任意两个顶点的叉乘都不小于零则说明这个点在三角形内，换句话说，三角想内的点，与任意相邻两点的叉乘都必须满足大于0，即角度在0-180度以内（满足右手定则），
	 * @param p0
	 * @param triangle
	 */
	inTriangle(p0, triangle) {
		let inPoly = true;
		for (let i = 0; i < 3; i++) {
			const j = (i + 1) % 3;
			// 获取相邻的两个点
			const [p1, p2] = [triangle[i], triangle[j]];
			if (this.cross([p0, p1, p2]) < 0) {
				inPoly = false;
				break;
			}
		}
		return inPoly;
	}

	/**
	 * 以p0为基点，对二维向量p0p1、p0p2做叉乘运算，这里实际上计算的就是看符不符合,如果大于0，则说明符合，如果小于0，则说明不符合
	 * 计算原理: 平面向量，向量A * 向量B = |A| * |B| * sin AB的夹角，这里的夹角有正负之分，由向量A到向量B如果遵循右手定则，则是0 - 180的角，否则则是超过180度的角
	 * @param p0
	 * @param p1
	 * @param p2
	 */
	cross([p0, p1, p2]) {
		const [ax, ay, bx, by] = [
			p1.x - p0.x,
			p1.y - p0.y,
			p2.x - p0.x,
			p2.y - p0.y,
		];
		return ax * by - bx * ay;
	}

	/**
	 * 基于对象数组geoData 生成平展开的vertices 数据
	 */
	updateVertices() {
		const arr = [];
		this.triangles.forEach((triangle) => {
			for (let { x, y } of triangle) {
				arr.push(x, y);
			}
		});
		this.vertices = arr;
	}
}
