/*
 * @Author: your name
 * @Date: 2021-05-12 13:45:13
 * @LastEditTime: 2021-05-12 16:32:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \webgl-study\src\pages\first\18-鼠标绘制线条\index.js
 */
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
import { Poly } from "@/utils/Poly/index.js";

export default function index(props) {
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
        const vertices = [];
        let isStop = true;

        // 声明颜色 rbga
        gl.clearColor(0, 0, 0, 1);
        // 刷底色
        gl.clear(gl.COLOR_BUFFER_BIT);

        const poly = new Poly({
            gl,
            types: ["POINTS", "LINE_STRIP"],
        });

        // 取消默认右击时间
        canvas.oncontextmenu = function () {
            return false;
        };

        canvas.addEventListener("mousedown", (event) => {
            if (event.button === 2) {
                if (poly.count > 0) {
                    poly.popVertex();
                    gl.clear(gl.COLOR_BUFFER_BIT);
                    poly.draw();
                    isStop = true
                }
            } else {
                const { x, y } = getMouseCoordinate(event, canvas);
                poly.popVertex();
                poly.addVertex(x, y, x, y);
                gl.clear(gl.COLOR_BUFFER_BIT);
                poly.draw();
                isStop = false
            }
        });

        canvas.addEventListener("mousemove", (event) => {
            if(isStop) return
            const { x, y } = getMouseCoordinate(event, canvas);
            poly.setVertex(poly.count - 1, x, y);
            gl.clear(gl.COLOR_BUFFER_BIT);
            poly.draw();
        });

        // setTimeout(() => {
        //     poly.addVertex(-0.2,-0.1);
        //     gl.clear(gl.COLOR_BUFFER_BIT);
        //     poly.draw()
        // }, 1000);

        // setTimeout(() => {
        //     gl.clear(gl.COLOR_BUFFER_BIT);
        //     poly.draw(['POINT','LINE_STRIP'])
        // }, 2000);
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
        <div className="18-图形封装">
            <canvas id="canvas"></canvas>
        </div>
    );
}
