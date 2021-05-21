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
import { ShapeGeo } from "@/utils/ShapeGeo/index.js";

export default function __functionName(props) {
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
        const canvas = settingCanvasSize("canvas");
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
        <div className="__className">
            <canvas id="canvas"></canvas>
        </div>
    );
}
