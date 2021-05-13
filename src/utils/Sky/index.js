/*
 * @Author: your name
 * @Date: 2021-05-12 14:37:51
 * @LastEditTime: 2021-05-13 08:27:18
 * @LastEditors: Please set LastEditors
 * @Description: 容器对象，承载多边形容器
 * @FilePath: \webgl-study\src\utils\Sky\index.js
 */

export class Sky {
	constructor(gl) {
		this.gl = gl;
		this.children = [];
	}

	/**
	 * 新增
	 */
	add(obj) {
		obj.gl = this.gl;
		this.children.push(obj);
	}

	/**
	 * 更新子集
	 * @param {*} params
	 */
	updateVertices(params) {
		this.children.forEach((ele) => {
			ele.updateVertices(params);
		});
	}

	/**
	 * 绘画
	 */
	draw() {
		/**
		 * 这里需要再次调用init方法是因为在重新绘制的时候，每一次的子对象都需要重新绑定缓冲对象，否则缓冲区无法正常获取到之前缓冲对象中的点位
		 */
		this.children.forEach((ele, index) => {
			ele.init();
			ele.draw();
		});
	}
}
