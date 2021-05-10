import React, { useEffect, useState, useRef } from "react";
import "./index.less";
import debounce from "lodash/debounce";
import { Color } from "three";

export default function B(props) {
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

		// 实例化Color对象
		const color = new Color("rgba(255,0,0,1)");

		gl.clearColor(color.r, color.g, color.b, 1);
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
