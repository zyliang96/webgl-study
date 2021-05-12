import React, {useEffect, useState, useRef} from "react";
import "./index.less";
import debounce from "lodash/debounce";
import {initShaders, loadShader, renderPoints} from '@/utils/webgl.utils.js'

export default function First07(props) {
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
	        gl_PointSize = 100.0; // 设置尺寸
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

        const a_points = [];


        // 鼠标点击事件
        canvas.addEventListener('click', (event) => {
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
            a_points.push({x,y})
            renderPoints(gl, a_points, a_Position)
        })
    };
    useEffect(() => {
        init();
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
        <div className="first07">
            <canvas id="canvas"></canvas>
        </div>
    );
}
