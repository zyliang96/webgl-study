/*
 * @Author: your name
 * @Date: 2021-05-10 16:19:13
 * @LastEditTime: 2021-05-19 22:33:31
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
	glToCssPos,
} from "@/utils/webgl.utils.js";
import { Poly } from "@/utils/Poly/index.js";
import { Sky } from "@/utils/Sky/index.js";
import { Compose } from "@/utils/Tweening/Compose.js";
import { Track } from "@/utils/Tweening/Track.js";
import szzMp3 from "./audio/szz.mp3";

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
        attribute vec4 a_Attr;
        // varying 创建一个全局对象，片元着色器和顶点着色器都可以使用
        varying float v_Alpha;
        void main() {
            gl_Position = vec4(a_Attr.x,a_Attr.y,0.0,1.0); // 设置坐标 值都是0-1区间内 字段分别为坐标 x,y,z 
            gl_PointSize = a_Attr.z; // 设置尺寸
            v_Alpha=a_Attr.w;
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
        // uniform vec4 u_FragColor;
        // 获取到全局变量，用全局变量来设置透明度
        varying float v_Alpha;
        void main() {
            float dist = distance(gl_PointCoord, vec2(0.5,0.5));
            if(dist < 0.5){
                gl_FragColor = vec4(0.87,0.91,1.0,v_Alpha); // 设置颜色
            }else{
                discard;
            }
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
		// gl.clearColor(0, 0, 0, 1);
		// 刷底色
		// gl.clear(gl.COLOR_BUFFER_BIT);

		// 建立绘制多边形方法对象
		const key = new Sky(gl);
		// 建立合成对象，用于补间动画
		const compose = new Compose();
		// 正在绘制的多边形
		let poly = null;
		// 鼠标划上的点
		let point = null;
		// 取消默认右击时间
		canvas.oncontextmenu = function () {
			return false;
		};

		canvas.addEventListener("mousedown", (event) => {
			if (event.button === 2) {
				popVertex();
			} else {
				const { x, y } = getMouseCoordinate(event, canvas);
				if (poly) {
					// 连续添加顶点
					addVertex(x, y);

					// 绘制点位
					// poly.addVertex(x, y);
				} else {
					crtPoly(x, y);
				}
			}
			render();
		});

		canvas.addEventListener("mousemove", (event) => {
			const { x, y } = getMouseCoordinate(event, canvas);
			point = hoverPoint(x, y);
			if (point) {
				canvas.style.cursor = "pointer";
			} else {
				canvas.style.cursor = "default";
			}
			if (poly) {
				const obj = poly.geoData[poly.geoData.length - 1];
				obj.x = x;
				obj.y = y;
			}
		});

		/**
		 * 逐帧渲染
		 */
		!(function ani() {
			compose.update(new Date());
			key.updateVertices(["x", "y", "pointSize", "alpha"]);
			render();
			requestAnimationFrame(ani);
		})();

		// 生成随机大小
		function random() {
			return Math.random() * 8.0 + 3.0;
		}

		// 补间动画
		function crtTrack(obj = {}) {
			const { pointSize } = obj;
			const track = new Track(obj);
			track.start = new Date();
			track.timeLen = 2000;
			track.loop = true;
			track.keyMap = new Map([
				[
					"pointSize",
					[
						[500, pointSize],
						[1000, 0],
						[1500, pointSize],
					],
				],
				[
					"alpha",
					[
						[500, 1],
						[1000, 0],
						[1500, 1],
					],
				],
			]);
			compose.add(track);
		}

		function crtPoly(x, y) {
			let o1 = point ? point : { x, y, pointSize: random(), alpha: 1 };
			let o2 = { x, y, pointSize: random(), alpha: 1 };
			poly = new Poly({
				size: 4,
				attrName: "a_Attr",
				geoData: [o1, o2],
				types: ["POINTS", "LINE_STRIP"],
			});
			// 增加多边形
			key.add(poly);
			crtTrack(o1);
			crtTrack(o2);
		}

		/**
		 * 增加点位
		 * @param x
		 * @param y
		 */
		function addVertex(x, y) {
			const { geoData } = poly;
			// 如果点位存在，则将最后一个替换成那个相同的点位
			if (point) {
				geoData[geoData.length - 1] = point;
			}

			let obj = { x, y, pointSize: random(), alpha: 1 };
			geoData.push(obj);
			crtTrack(obj);
		}

		/**
		 * 判断是否
		 * @param x
		 * @param y
		 */
		function hoverPoint(mx, my) {
			for (let { geoData } of key.children) {
				for (let obj of geoData) {
					// 如果是当前点就不比较了
					if (poly && obj === poly.geoData[poly.geoData.length - 1]) {
						continue;
					}
					const delta = {
						x: mx - obj.x,
						y: my - obj.y,
					};
					const { x, y } = glToCssPos(delta, canvas);
					const dist = x * x + y * y;
					/**
					 * 这个计算两点之间的距离小于10px 这样计算的原因是，random方法生成的size是一个 10 到 11 之间的数字，所以两点的距离在10 到 11 之间，
					 * 一旦比10小，就说明肯定是同一个点了，存在一定的误差，但是影响不大
					 */
					if (dist < 100) {
						return obj;
					}
				}
			}
			return null;
		}

		function render() {
			gl.clear(gl.COLOR_BUFFER_BIT);
			key.draw();
		}

		function popVertex() {
			if (poly) {
				// 点位去掉最后一个滑动的点位
				poly.geoData.pop();
				// 从联合对象中删除最后一个的数据，即删除对应的补间动画
				compose.children.pop();
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
		<div className="szz">
			<canvas id="canvas"></canvas>
			<audio id="audio" controls loop autoPlay>
				<source src={szzMp3} type="audio/mpeg" />
			</audio>
		</div>
	);
}
