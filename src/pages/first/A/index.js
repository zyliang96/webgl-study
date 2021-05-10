import React, { useEffect, useState, useRef } from "react";
import "./index.less";
import debounce from "lodash/debounce";

export default function A(props) {
	/**
	 * 设置大小
	 */
	const settingCanvasSize = () => {
		const canvas = document.getElementById("canvas");
		canvas.width = window.innerWidth - 200;
		canvas.height = window.innerHeight - 60;
		return canvas;
	};
	const init = () => {
		const canvas = document.getElementById("canvas");
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		// 二维画笔
		// const gl = canvas.getContext("2d");
		// 三维画笔
		const gl = canvas.getContext("webgl");
		// 声明颜色 rgba  字段值为 0 - 1
		gl.clearColor(1, 0, 0, 1);
		// 刷底色
		gl.clear(gl.COLOR_BUFFER_BIT);

		// css 颜色
		const rgbaCss = "rgba(255,255,0,1)";
		// 正则
		const reg = new RegExp(/\((.*)\)/);
		// 捕捉数据
		const rgbaStr = reg.exec(rgbaCss)[1];
		console.log(rgbaStr);
		// 加工数据
		const list = rgbaStr.split(",").map((item) => {
			return parseInt(item);
		});

		const r = list[0] / 255;
		const g = list[1] / 255;
		const b = list[2] / 255;
		const a = list[3] / 1;

		gl.clearColor(r, g, b, a);
		// 刷底色
		gl.clear(gl.COLOR_BUFFER_BIT);
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
	return <canvas id="canvas"></canvas>;
}
