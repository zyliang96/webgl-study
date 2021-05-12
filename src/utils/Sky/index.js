/*
 * @Author: your name
 * @Date: 2021-05-12 14:37:51
 * @LastEditTime: 2021-05-12 17:24:59
 * @LastEditors: Please set LastEditors
 * @Description: 容器对象，承载多边形容器
 * @FilePath: \webgl-study\src\utils\Sky\index.js
 */

export class Sky {
    constructor(gl) {
        this.gl = gl;
        this.children = [];
    }

    /**
     * 新增
     */
    add(obj) {
        obj.gl = this.gl;
        this.children.push(obj);
    }

    /**
     * 更新子集
     * @param {*} params
     */
    updateVertices(params) {
        this.children.forEach((ele) => {
            ele.updateVertices(params);
        });
    }

    /**
     * 绘画
     */
    draw() {
        console.log(this.children.length,this.children)
        this.children.forEach((ele,index) => {
            ele.init();
            ele.draw();
        });
    }
}
