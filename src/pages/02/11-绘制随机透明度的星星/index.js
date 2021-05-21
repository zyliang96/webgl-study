import React, {useEffect, useState, useRef} from "react";
import "./index.less";
import debounce from "lodash/debounce";
import {initShaders, loadShader, renderPoints, renderPointsIncludeOther} from '@/utils/webgl.utils.js'

export default function First11(props) {
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
	        gl_PointSize = a_PointSize; // 设置尺寸
	    }
	`;
    /**
     * 片元着色器
     * @type {string}
     */
    const fragmentShader = `
        // 片元着色器的规则 对浮点数精度的定义， mediump 是中等精度的意思，这个必须要有，不然画不出东西来
        precision mediump float;
        // 暴露uniform对象
        uniform vec4 u_FragColor;
        void main() {
            float dist = distance(gl_PointCoord, vec2(0.5,0.5));
            if(dist < 0.5){
                gl_FragColor = u_FragColor; // 设置颜色
            }else{
                discard;
            }
        }
    `;


    const init = () => {
        const canvas = settingCanvasSize("canvas");

        // 三位画笔
        const gl = canvas.getContext('webgl');

        // 开启片元的颜色合成功能才能够有透明度
        gl.enable(gl.BLEND);
        // 设置片元的合成方式
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        /**
         * 初始化着色器
         * 功能：解析着色器文本，整合到程序对象，关联webgl上下文对象，实现两种语言的相互通信
         */
        initShaders(gl, vertexShader, fragmentShader);

        // 设置attribute 变量
        const a_Position = gl.getAttribLocation(gl.program, "a_Position");
        const a_PointSize = gl.getAttribLocation(gl.program, "a_PointSize");
        const u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor");

        // 声明颜色 rbga
        gl.clearColor(0, 0, 0, 0);
        // 刷底色
        gl.clear(gl.COLOR_BUFFER_BIT);

        const a_points = [];

        const colorList = [
            {r: 1.0, g: 0.0, b: 0.0, a: 1.0},
            {r: 1.0, g: 0.5, b: 0.0, a: 1.0},
            {r: 1.0, g: 1.0, b: 0.0, a: 1.0},
            {r: 0.0, g: 1.0, b: 0.0, a: 1.0},
            {r: 0.0, g: 1.0, b: 1.0, a: 1.0},
            {r: 0.0, g: 0.0, b: 1.0, a: 1.0},
            {r: 0.5, g: 0.0, b: 1.0, a: 1.0},
        ]
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
            const size = Math.random() * 5 + 2;
            // const color = colorList[Math.round(Math.random() * 10) % 7]

            const r = 0.87;
            const g = 0.91;
            const b = 1;
            const a = Math.random().toFixed(2);
            const color = {r, g, b, a}
            a_points.push({x, y, size, color});
            renderPointsIncludeOther(gl, a_points, {
                sourcePosition: a_Position,
                sourcePointSize: a_PointSize,
                sourcePointColor: u_FragColor,
            });
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
        <div className="first11">
            <canvas id="canvas"></canvas>
        </div>
    );
}
