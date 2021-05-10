import React, { useEffect, useState, useRef } from "react";
import "./index.less";
import debounce from "lodash/debounce";

export default function C(props) {
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
	const vertexShader = () => {

	}
	const init = () => {
		const canvas = settingCanvasSize("canvas");
		const gl = canvas.getContext('webgl')
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
		<div className="c">
			<canvas id="canvas"></canvas>
		</div>
	);
}
