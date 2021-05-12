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
import { Compose } from "@/utils/Tweening/Compose.js";
import { Track } from "@/utils/Tweening/Track.js";
import { size } from "lodash";
import cefMp3 from './audio/cef.mp3'

export default function First12(props) {
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
        const gl = canvas.getContext("webgl");

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
        const stars = [];

        // 合成对象
        const compose = new Compose();

        // 鼠标点击事件
        canvas.addEventListener("click", (event) => {
            const { x, y } = getMouseCoordinate(event, canvas);
            const size = Math.random() * 5 + 2;
            // const color = colorList[Math.round(Math.random() * 10) % 7]

            const r = 0.87;
            const g = 0.91;
            const b = 1;
            const a = Math.random().toFixed(2);
            const color = { r, g, b, a };
            const obj = { x, y, size, color };
            a_points.push(obj);
            //建立轨道对象
            const track = new Track(obj);
            track.start = new Date();
            track.timeLen = 2000;
            track.loop = true;
            track.keyMap = new Map([
                [
                    "color.a",
                    [
                        [500, a],
                        [1000, 0],
                        [1500, a],
                    ],
                ],
            ]);
            compose.add(track);
        });
        !(function ani() {
            compose.update(new Date());
            // render();
            renderPointsIncludeOther(gl, a_points, {
                sourcePosition: a_Position,
                sourcePointSize: a_PointSize,
                sourcePointColor: u_FragColor,
            });
            requestAnimationFrame(ani);
        })();
    };
    useEffect(() => {
        init();
    }, []);
    return (
        <div className="first12">
            <canvas id="canvas"></canvas>
            <audio id="audio" controls loop autoPlay>
                <source src={cefMp3} type="audio/mpeg" />
            </audio>
        </div>
    );
}
