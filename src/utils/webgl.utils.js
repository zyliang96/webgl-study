/**
 * 初始化着色器
 * @param gl
 * @param vsSource
 * @param fsSource
 */
export function initShaders(gl, vsSource, fsSource) {
    // 创建程序对象
    const program = gl.createProgram();
    // 建立着色对象
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
    // 把顶点着色对象封装进程序对象中
    gl.attachShader(program, vertexShader);
    // 把片元着色对象装进程序对象中
    gl.attachShader(program, fragmentShader);
    // 链接webgl上下文对象和程序对象
    gl.linkProgram(program);
    // 启动程序对象
    gl.useProgram(program);
    // 将程序对象挂载到上下文对象（自定义的程序对象）
    gl.program = program;
    return true;
}

/**
 * 加载着色对象
 * @param gl
 * @param type
 * @param source
 */
export function loadShader(gl, type, source) {
    // 根据着色类型，建立着色器对象
    const shader = gl.createShader(type);
    // 将着色器源文件传入着色器对象中
    gl.shaderSource(shader, source);
    // 编译着色器对象
    gl.compileShader(shader);
    // 返回着色器对象
    return shader;
}

/**
 * 渲染点位方法
 * @param gl
 * @param points
 * @param sourcePosition
 */
export function renderPoints(gl, points, sourcePosition) {
    if (Array.isArray(points)) {
        gl.clear(gl.COLOR_BUFFER_BIT);
        points.forEach(({x, y}) => {
            gl.vertexAttrib2f(sourcePosition, x, y);
            gl.drawArrays(gl.POINTS, 0, 1)
        })
    }
}


/**
 * 渲染点位包含大小
 * @param gl
 * @param points
 * @param config
 */
export function renderPointsIncludeOther(gl, points, config) {
    const {sourcePosition, sourcePointSize, sourcePointColor} = config
    if (Array.isArray(points)) {
        gl.clear(gl.COLOR_BUFFER_BIT);
        points.forEach(({x, y, size, color}) => {
            gl.vertexAttrib2f(sourcePosition, x, y);
            if (size && sourcePointSize) {
                gl.vertexAttrib1f(sourcePointSize, size)
            }
            if (color && sourcePointColor) {
                const {r, g, b, a} = color
                // gl.uniform4f(sourcePointColor, r, g, b, a)
                const arr = new Float32Array([r, g, b, a]);
                gl.uniform4fv(sourcePointColor, arr)
            }
            gl.drawArrays(gl.POINTS, 0, 1)
        })
    }
}

/**
 * 获取鼠标坐标
 * @param event
 * @param canvas
 * @returns {number[]}
 */
export function getMouseCoordinate(event, canvas) {
    const {clientX, clientY} = event;
    const {left, top, width, height} = canvas.getBoundingClientRect();
    const [cssX, cssY] = [
        clientX - left,
        clientY - top
    ]

    // 解决坐标原点位置的差异
    const [halfWidth, halfHeight] = [
        width / 2,
        height / 2
    ];
    // 向量差，原点位置 (halfWidth,halfHeight
    const [xBaseCenter, yBaseCenter] = [
        cssX - halfWidth,
        cssY - halfHeight,
    ]
    const yBaseCenterTop = -yBaseCenter
    const [x, y] = [
        xBaseCenter / halfWidth,
        yBaseCenterTop / halfHeight
    ]
    return {
        x, // x 坐标
        y, // y 坐标
    }
}