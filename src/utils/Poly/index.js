const defAttr = () => {
	return {
		gl: null,
		vertices: [],
		geoData: [],
		size: 2,
		attrName: "a_Position",
		isPointName: "u_IsPOINTS",
		count: 0,
		types: ["POINTS"],
		isInit: false,
		circleDot: false,
		u_IsPOINTS: null,
	};
};

export class Poly {
	constructor(attr) {
		Object.assign(this, defAttr(), attr);
		(this.bufferData = null), this.init();
	}
	/**
	 * 初始化
	 */
	init() {
		const { gl, size, count, circleDot } = this;
		if (!gl) return;
		// 缓冲对象 不会被异步调用清空
		if (!this.bufferData) {
			this.bufferData = gl.createBuffer();
		}
		// 绑定缓冲对象
		gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferData);
		this.updateBuffer();
		// 设置attribute 变量,得放在初始化之后，要不然拿不到着色器的信息
		const a_Position = gl.getAttribLocation(gl.program, this.attrName);
		// const a_PointSize = gl.getAttribLocation(gl.program, this.attrName);
		/**
		 * 修改attribute 变量
		 * @description:  void gl.vertexAttribPointer(index, size, type, normalized, stride, offset); https://developer.mozilla.org/zh-CN/docs/Web/API/WebGLRenderingContext/vertexAttribPointer
		 * @param {*}
		 * @return {*}
		 */
		gl.vertexAttribPointer(a_Position, size, gl.FLOAT, false, 0, 0);
		// gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, 32, 2);
		// 赋能-批处理
		gl.enableVertexAttribArray(a_Position);

		// 如果是圆点，就获取一下uniform 变量
		if (circleDot) {
			this.u_IsPOINTS = gl.getUniformLocation(gl.program, this.isPointName);
		}
	}

	/**
	 * 更新buffer缓冲
	 */
	updateBuffer() {
		const { gl, vertices } = this;
		this.updateCount();
		// 写入数据
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	}

	/**
	 * 更新数量
	 */
	updateCount() {
		this.count = Math.floor(this.vertices.length / this.size);
	}

	/**
	 * 添加点
	 */
	addVertex(...params) {
		this.vertices.push(...params);
		this.updateBuffer();
	}

	/**
	 * 移除点
	 */
	removeVertex(index) {
		const { vertices, size } = this;
		const len = vertices.length;
		const str = index * size;
		if (str > len) {
			return;
		}
		vertices.splice(str, str + size);
		this.updateBuffer();
	}

	/**
	 * 移除最后一个点位
	 */
	popVertex() {
		const { vertices, size } = this;
		const len = vertices.length;
		if (!len) return;
		vertices.splice(len - size, len);
		// TODO 这里和视频中的不一样，这里调用updateBuffer,修改后就及时更新，
		this.updateBuffer();
	}

	/**
	 * 设置点位数据
	 */
	setVertex(index, ...params) {
		const { vertices, size } = this;
		const i = index * size;
		params.forEach((param, paramIndex) => {
			vertices[i + paramIndex] = param;
		});
		this.updateBuffer();
	}

	/**
	 * 根据模型数据修改点位数据，主要是便于操作
	 */
	updateVertices(params) {
		const { geoData } = this;
		const vertices = [];
		geoData.forEach((data) => {
			params.forEach((key) => {
				vertices.push(data[key]);
			});
		});
		this.vertices = vertices;
		this.updateBuffer();
	}

	/**
	 * 绘制
	 * @param {*} types
	 */
	draw(types = this.types) {
		const { gl, count, vertices, circleDot, u_IsPOINTS } = this;
		for (let type of types) {
			circleDot && gl.uniform1f(u_IsPOINTS, type === "POINTS");
			gl.drawArrays(gl[type], 0, count);
		}
	}
}
