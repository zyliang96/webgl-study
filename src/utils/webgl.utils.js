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

/**
 * webgl坐标系转css坐标系
 * @param x
 * @param y
 * @param width
 * @param height
 */
export function glToCssPos({x, y}, {width, height}) {
    const [halfWidth, halfHeight] = [
        width / 2,
        height / 2
    ];
    return {
        x: x * halfHeight,
        y: y * halfHeight
    }
}

/**
 * 获取webgl下，自定义的单位长度
 * @param canvas
 * @param config
 */
export function getCommonUnit(canvas, config = {}) {
    // 以什么维度位标准
    const {unitParam = 'height'} = config;
    // 宽高比
    const ratio = canvas.width / canvas.height;

    // 正方形高度,这里统计标准高度的时候，按照高度和宽高比计算标准宽度，手动等分
    let rectH = 1.0;

    // 正方形宽度
    let rectW = 1.0;
    if (!unitParam || unitParam === 'height') {
        rectW = rectH / ratio;
    } else {
        rectH = rectW * ratio;
    }

    // 正方形宽高的一半
    const [halfRectW, halfRectH] = [rectW / 2, rectH / 2];

    // 两个极点
    const minX = -halfRectW;
    const minY = -halfRectH;
    const maxX = halfRectW;
    const maxY = halfRectH;

    return {
        minX,
        minY,
        maxX,
        maxY
    }
}

/**
 * 建立比例尺
 * 利用点斜式
 * @param ax
 * @param ay
 * @param bx
 * @param by
 * @constructor
 */
export function ScaleLinear(ax, ay, bx, by) {
    const delta = {
        x: bx - ax,
        y: by - ay,
    }
    // 根据向量求斜率
    const k = delta.y / delta.x
    // 偏移量
    const b = ay - ax * k;
    // 返回转化方法
    return function (x) {
        return k * x + b
    }
}
