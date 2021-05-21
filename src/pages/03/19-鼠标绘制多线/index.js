/*
 * @Author: your name
 * @Date: 2021-05-10 16:19:13
 * @LastEditTime: 2021-05-12 17:21:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \webgl-study\scripts\createPage\template\empty\index.js
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
import { Sky } from "@/utils/Sky/index.js";

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

        // 声明颜色 rbga
        gl.clearColor(0, 0, 0, 1);
        // 刷底色
        gl.clear(gl.COLOR_BUFFER_BIT);

        const key = new Sky(gl);
        // 正在绘制的多边形
        let poly = null;
        // 取消默认右击时间
        canvas.oncontextmenu = function () {
            return false;
        };

        canvas.addEventListener("mousedown", (event) => {
            if (event.button === 2) {
                popVertex();
            } else {
                const { x, y } = getMouseCoordinate(event, canvas);
                console.log(poly);
                if (poly) {
                    // 绘制点位
                    poly.addVertex(x, y);
                } else {
                    crtPoly(x, y);
                    
                }
            }
            render();
        });

        canvas.addEventListener("mousemove", (event) => {
            if (poly) {
                const { x, y } = getMouseCoordinate(event, canvas);
                // 重新设置最后一个点位
                poly.setVertex(poly.count - 1, x, y);
                // 这里得调用render 方法，因为如果单独调用poly的draw 时 drawArrays的时候，背景色会被刷掉，并且只能绘制当前多边形里的点，无法刷新整个容器里的
                render();
            }
        });

        function crtPoly(x, y) {
            poly = new Poly({
                gl,
                vertices: [x, y, x, y],
                types: ["POINTS", "LINE_STRIP"],
            });
            key.add(poly);
        }

        function render() {
            gl.clear(gl.COLOR_BUFFER_BIT);
            key.draw();
        }

        function popVertex() {
            if (poly) {
                poly.popVertex();
                poly = null;
            }
        }

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
        <div className="19-鼠标绘制多线">
            <canvas id="canvas"></canvas>
        </div>
    );
}
