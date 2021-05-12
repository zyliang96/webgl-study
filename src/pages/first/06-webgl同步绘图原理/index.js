import React, {useEffect, useState, useRef} from "react";
import "./index.less";
import debounce from "lodash/debounce";
import {initShaders, loadShader, renderPoints} from '@/utils/webgl.utils.js'

export default function First06(props) {
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
	    void main() {
	        gl_Position = a_Position; // 设置坐标 值都是0-1区间内 字段分别为坐标 x,y,z 
	        gl_PointSize = 50.0; // 设置尺寸
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

    // 单独画点的方法
    const init = () => {

        const canvas = settingCanvasSize("canvas");

        // 三维画笔
        const gl = canvas.getContext('webgl');

        /**
         * 初始化着色器
         * 功能：解析着色器文本，整合到程序对象，关联webgl上下文对象，实现两种语言的相互通信
         */
        initShaders(gl, vertexShader, fragmentShader);

        // 设置attribute 变量

        const a_Position = gl.getAttribLocation(gl.program, "a_Position");
        // 声明颜色 rbga
        gl.clearColor(0, 0, 0, 1);
        // 刷底色
        gl.clear(gl.COLOR_BUFFER_BIT);

        // 修改Attribute 变量
        // 前三个数值默认值为0.0 第四个数值默认值为1.0
        gl.vertexAttrib1f(a_Position, 0.5);
        // gl.vertexAttrib2f(a_Position, 0.0, 0.5);
        // gl.vertexAttrib3f(a_Position, 0.0, 0.5, 0.0);
        // gl.vertexAttrib4f(a_Position, 0.0, 0.5, 0.0, 1.0);
        // 绘制顶点
        gl.drawArrays(gl.POINTS, 0, 1)

        // 修改Attribute 变量
        // 前三个数值默认值为0.0 第四个数值默认值为1.0
        gl.vertexAttrib1f(a_Position, 0.2);
        // 绘制顶点
        gl.drawArrays(gl.POINTS, 0, 1)

        // 异步绘制会导致缓冲区被刷新，所以在需要异步的时候，需要将原来的点位缓存下来，然后再进行刷新
        setTimeout(() => {
            // 修改Attribute 变量
            // 前三个数值默认值为0.0 第四个数值默认值为1.0
            gl.vertexAttrib1f(a_Position, 0.2);
            // 绘制顶点
            gl.drawArrays(gl.POINTS, 0, 1)
        }, 2000)

    };

    // 缓存点位画点的方法
    const newInit = () => {
        const canvas = settingCanvasSize("canvas");

        // 三位画笔
        const gl = canvas.getContext('webgl');

        /**
         * 初始化着色器
         * 功能：解析着色器文本，整合到程序对象，关联webgl上下文对象，实现两种语言的相互通信
         */
        initShaders(gl, vertexShader, fragmentShader);

        // 设置attribute 变量

        const a_Position = gl.getAttribLocation(gl.program, "a_Position");
        // 声明颜色 rbga
        gl.clearColor(0, 0, 0, 1);
        // 刷底色
        gl.clear(gl.COLOR_BUFFER_BIT);

        let a_points = [
            {x: -0.3, y: 0},
            {x: 0.3, y: 0},
        ]
        renderPoints(gl, a_points, a_Position)

        // 异步绘制会导致缓冲区被刷新，所以在需要异步的时候，需要将原来的点位缓存下来，然后再进行刷新
        setTimeout(() => {
            // 修改Attribute 变量
            // 前三个数值默认值为0.0 第四个数值默认值为1.0
            a_points.push({x: 0.0, y: 0.0})
            renderPoints(gl, a_points, a_Position)
        }, 2000)
    }
    useEffect(() => {
        // init();
        newInit();
        const handler = debounce(function () {
            console.log("resize______________________");
            settingCanvasSize();
        }, 300);
        window.addEventListener("resize", handler);
        return () => {
            window.removeEventListener("resize", handler);
        };
    }, []);
    return (
        <div className="first06">
            <canvas id="canvas"></canvas>
        </div>
    );
}
