/**
 * 建立合成对象
 */
export class Compose {
    // 支持嵌套
    constructor() {
        this.parent = null; // 父对象，合成对象可以相互嵌套
        this.children = []; // 子对象合集，其合集元素可以是时间轨，也可以是合成对象
    }

    /**
     * 添加子对象方法
     * @param obj
     */
    add(obj) {
        obj.parent = this;
        this.children.push(obj);
    }

    /**
     * 基于当前事件更新子对象状态的方法
     * @param t
     */
    update(t) {
        this.children.forEach((ele) => {
            ele.update(t)
        })
    }
}