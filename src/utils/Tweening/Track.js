import { set as lodashSet } from "lodash";
/**
 * 创建关键帧
 */
export class Track {
    constructor(target) {
        this.target = target; // 目标对象
        this.parent = null; // 父合成对象
        this.start = 0; // 开始时间，时间轨的建立时间
        this.timeLen = 5; // 时间线（时间轨的总时长）
        this.loop = false; // 是否轮询
        /**
         * 关键帧集合
         * @type {Map<any, any>}
         *
         * [
         *      [
         *          '对象属性',
         *          [
         *              [时间1，属性值], // 关键帧
         *              [时间2，属性值], // 关键帧
         *          ]
         *      ]
         *  ]
         */
        this.keyMap = new Map(); // 关键帧集合
    }

    update(t) {
        const { keyMap, timeLen, target, loop } = this;
        let time = t - this.start; // 这里所谓的本地时间应该式对于整个动画的时间轴来说的
        if (loop) {
            time = time % timeLen; // 将时间循环
        }
        for (const [key, fms] of keyMap) {
            const last = fms.length - 1;
            // 判断本地时间是否小于第一个关键帧时间
            if (time < fms[0][0]) {
                lodashSet(target, key, fms[0][1]);
            } else if (time > fms[last][0]) {
                // 判断本地时间是否大于最后一个关键帧的时间
                lodashSet(target, key, fms[last][1]);
            } else {
                // 计算本地时间在两个关键帧之间对应的补间状态
                lodashSet(target, key, getValBetweenFms(time, fms, last));
            }
            
        }
    }
}

/**
 * 补间动画
 * @param time 本地时间
 * @param fms 某个属性的关键帧集合
 * @param last 最后一个关键帧的索引位置
 */
function getValBetweenFms(time, fms, last) {
    //TODO 我感觉这里好像到last - 1 即可， 遍历所有关键帧
    for (let i = 0; i < last; i++) {
        const fm1 = fms[i];
        const fm2 = fms[i + 1];
        // 判断当前时间在哪个关键帧中间
        if (time >= fm1[0] && time <= fm2[0]) {
            // TODO 这里应该可以根据矩阵求通用解（线性代数知识，需要回炉学习） 根据状态求点斜式（就是一元一次方程）
            const delta = {
                x: fm2[0] - fm1[0],
                y: fm2[1] - fm1[1],
            };
            const k = delta.y / delta.x;
            const b = fm1[1] - fm1[0] * k;
            return k * time + b;
        }
    }
}
