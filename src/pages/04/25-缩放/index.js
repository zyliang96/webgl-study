/*
 * @Author: your name
 * @Date: 2021-05-10 16:19:13
 * @LastEditTime: 2021-05-20 23:25:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \webgl-study\scripts\createPage\template\empty\index.js
 */
import React, {useEffect, useState, useRef} from "react";
import "./index.less";
import debounce from "lodash/debounce";
import {
    initShaders,
    loadShader,
    renderPoints,
    renderPointsIncludeOther,
    getMouseCoordinate,
    glToCssPos,
    getCommonUnit,
    ScaleLinear,
} from '@/utils/webgl.utils.js'
import {Poly} from "@/utils/Poly/index.js";
import {Sky} from "@/utils/Sky/index.js";
import {Compose} from "@/utils/Tweening/Compose.js";
import {Track} from "@/utils/Tweening/Track.js";
import {ShapeGeo} from "@/utils/ShapeGeo/index.js";

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
        // 位移和点不是直接相关的，所以适用uniform
        uniform float u_Scale;
        // 角度转弧度
        // attribute float a_PointSize; 
        void main() {
            // gl_Position.x = a_Position.x*u_Scale; // 设置坐标 值都是0-1区间内 字段分别为坐标 x,y,z 
            // gl_Position.y = a_Position.y*u_Scale; // 设置坐标 值都是0-1区间内 字段分别为坐标 x,y,z 
            // gl_Position.z = a_Position.z*u_Scale; // 设置坐标 值都是0-1区间内 字段分别为坐标 x,y,z 
            // gl_Position.w = 1.0; // 设置坐标 值都是0-1区间内 字段分别为坐标 x,y,z 
            gl_Position = vec4(vec3(a_Position)*u_Scale,1.0);
            // gl_PointSize = 10.0; // 设置尺寸
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

        // 三角面点位
        const vertices = new Float32Array([
            0.0, 0.1,
            -0.1, -0.1,
            0.1, -0.1
        ]);

        // 缓冲对象
        const vertexBuffer = gl.createBuffer();
        // 绑定缓冲对象
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        // 写入数据
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        // 设置attribute 变量,得放在初始化之后，要不然拿不到着色器的信息
        const a_Position = gl.getAttribLocation(gl.program, "a_Position");
        // const a_PointSize = gl.getAttribLocation(gl.program, "a_PointSize");
        const u_Scale = gl.getUniformLocation(gl.program, 'u_Scale');


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
        // gl.clear(gl.COLOR_BUFFER_BIT);

        //  绘制一系列点
        // gl.drawArrays(gl.POINTS, 0, 3);

        // 绘制一系列三角形。每三个点作为顶点
        // gl.drawArrays(gl.TRIANGLES, 0, 3);

        let y = 0.0;
        !(function ani() {
            y += 0.05;

            // 为uniform赋值
            gl.uniform1f(u_Scale, Math.sin(y) + 1);
            gl.clear(gl.COLOR_BUFFER_BIT);
            // 绘制一系列三角形。每三个点作为顶点
            gl.drawArrays(gl.TRIANGLES, 0, 3);
            requestAnimationFrame(ani)
        })()

        // 绘制一系列单独线段。每两个点作为端点，线段之间不连接
        // gl.drawArrays(gl.LINES, 0, 2);

        // 绘制一个线条。即，绘制一系列线段，上一点连接下一点
        // gl.drawArrays(gl.LINE_STRIP, 0, 3);

        //  绘制一个线圈。即，绘制一系列线段，上一点连接下一点，并且最后一点与第一个点相连
        // gl.drawArrays(gl.LINE_LOOP, 0, 3);

        /**
         * 绘制一个三角带
         * ? 第偶数个三角形：以上一个三角形的第二条边 + 下一个点为基础，以和第二条边相反的方向绘制三角形
         * ? 第奇数个三角形：以上一个三角形的第三条边 + 下一个点为基础，以和第三条边相反的方向绘制三角形
         */
        // gl.drawArrays(gl.TRIANGLE_STRIP, 0, 5);

        /**
         * 绘制一个三角扇
         * ? 以上一个三角形的第三条边+下一个点位基础，按照和第三条边相反的顺序绘制三角形
         * ! 注意，如果点位数量超过实际个数时，会找到原点，并且绘制三角扇
         */
        // gl.drawArrays(gl.TRIANGLE_FAN, 0, 5);
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
        <div className="index-27">
            <canvas id="canvas"></canvas>
        </div>
    );
}
