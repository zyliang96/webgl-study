import React, { useEffect, useState, useRef } from "react";
import "./index.less";
import debounce from "lodash/debounce";
import {
    initShaders,
    loadShader,
    renderPoints,
    renderPointsIncludeOther,
    getMouseCoordinate,
} from "@/utils/webgl.utils.js";

export default function First13(props) {
    /**
     * 设置大小
     */
    const settingCanvasSize = () => {
        const canvas = document.getElementById("canvas");
        canvas.width = window.innerWidth - 200;
        canvas.height = window.innerHeight - 60;
        return canvas;
    };

    /**
     * 顶点着色器
     */
    const vertexShader = `
        // 声明attribute变量
        attribute vec4 a_Position;
        attribute float a_PointSize; 
        void main() {
            gl_Position = a_Position; // 设置坐标 值都是0-1区间内 字段分别为坐标 x,y,z 
            gl_PointSize = 10.0; // 设置尺寸
        }
	`;
    /**
     * 片元着色器
     * @type {string}
     */
    const fragmentShader = `
        void main() {
            gl_FragColor = vec4(1.0,1.0,0.0,1.0); // 设置颜色
        }
    `;

    const init = () => {
        const canvas = settingCanvasSize("canvas");

        // 三位画笔
        const gl = canvas.getContext("webgl");

        /**
         * 初始化着色器
         * 功能：解析着色器文本，整合到程序对象，关联webgl上下文对象，实现两种语言的相互通信
         */
        initShaders(gl, vertexShader, fragmentShader);

        // 如何向attribute 变量中写入多点，并绘制多点
        // 顶点数据
        const vertices = new Float32Array([
            0, 0.1, -0.1, -0.1, 0.1, -0.1,
        ]);
        // 缓冲对象
        const vertexBuffer = gl.createBuffer();
        // 绑定缓冲对象
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        // 写入数据
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        // 设置attribute 变量,得放在初始化之后，要不然拿不到着色器的信息
        const a_Position = gl.getAttribLocation(gl.program, "a_Position");
        const a_PointSize = gl.getAttribLocation(gl.program, "a_PointSize");
        /**
         * 修改attribute 变量
         * @description:  void gl.vertexAttribPointer(index, size, type, normalized, stride, offset); https://developer.mozilla.org/zh-CN/docs/Web/API/WebGLRenderingContext/vertexAttribPointer
         * @param {*}
         * @return {*}
         */
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
        // gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, 32, 2);
        // 赋能-批处理
        gl.enableVertexAttribArray(a_Position);

        // 声明颜色 rbga
        gl.clearColor(0, 0, 0, 1);
        // 刷底色
        gl.clear(gl.COLOR_BUFFER_BIT);
        // 绘制顶点
        gl.drawArrays(gl.POINTS, 0, 3);
    };
    useEffect(() => {
        init();
        // const handler = debounce(function () {
        //     console.log("resize______________________");
        //     settingCanvasSize();
        // }, 300);
        // window.addEventListener("resize", handler);
        // return () => {
        //     window.removeEventListener("resize", handler);
        // };
    }, []);
    return (
        <div className="first13">
            <canvas id="canvas"></canvas>
        </div>
    );
}
