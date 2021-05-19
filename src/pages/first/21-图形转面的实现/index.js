/*
 * @Author: your name
 * @Date: 2021-05-10 16:19:13
 * @LastEditTime: 2021-05-12 14:22:39
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
// import {ShapeGeo} from "@/ShapeGeo/index.js"

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
    // const fragmentShader = `
    //     // 片元着色器的规则 对浮点数精度的定义， mediump 是中等精度的意思，这个必须要有，不然画不出东西来
    //     precision mediump float;
    //     // 暴露uniform对象
    //     uniform vec4 u_FragColor;
    //     void main() {
    //         float dist = distance(gl_PointCoord, vec2(0.5,0.5));
    //         if(dist < 0.5){
    //             gl_FragColor = u_FragColor; // 设置颜色
    //         }else{
    //             discard;
    //         }
    //     }
    // `;

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

        // 声明颜色 rbga
        gl.clearColor(0, 0, 0, 1);
        // 刷底色
        gl.clear(gl.COLOR_BUFFER_BIT);


        // 路径G
        const pathData = [
            0, 0,
            600, 0,
            600, 100,
            100, 100,
            100, 500,
            500, 500,
            500, 300,
            300, 300,
            300, 400,
            200, 400,
            200, 200,
            600, 200,
            600, 600,
            0, 600
        ]

        // 这里获取到的是一个正方形，自定义的一个0.5 高度的正方形
        const {
            minX,
            minY,
            maxX,
            maxY
        } = getCommonUnit(canvas)


        // 正方形
        const rect = new Poly({
            gl,
            vertices: [
                minX, maxY,
                minX, minY,
                maxX, minY,
                maxX, maxY
            ]
        })

        rect.draw();


        // 建立比例尺
        const scaleX = ScaleLinear(0, minX, 600, maxX);

        const scaleY = ScaleLinear(0, maxY, 600, minY);

        const glData = [];
        for (let i = 0, len = pathData.length; i < len; i += 2) {
            glData.push(scaleX(pathData[i]), scaleY(pathData[i + 1]))
        }
        const path = new Poly({
            gl,
            vertices: glData,
            types: ["POINT", "LINE_LOOP"]
        });
        path.draw();


        // const shapeGeo = new ShapeGeo(glData);
        //
        // const face = new Poly({
        //     gl,
        //     vertices: shapeGeo.vertices,
        //     types: ["TRIANGLES"],
        // });
        // face.draw();

        //  绘制一系列点
        // gl.drawArrays(gl.POINTS, 0, 3);

        // 绘制一系列三角形。每三个点作为顶点
        // gl.drawArrays(gl.TRIANGLES, 0, 6);

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
        // gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        /**
         * 绘制一个三角扇
         * ? 以上一个三角形的第三条边+下一个点位基础，按照和第三条边相反的顺序绘制三角形
         * ! 注意，如果点位数量超过实际个数时，会找到原点，并且绘制三角扇
         */
        // gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
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
        <div className="index-21">
            <canvas id="canvas"></canvas>
        </div>
    );
}
