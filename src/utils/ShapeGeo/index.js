export class ShapeGeo {
    constructor(config = {}) {
        const {pathData = [], params = ['x', 'y']} = config;
        this.pathData = pathData; // 平展开的路径数据
        this.geoData = [];  // 由路径数据pathData 转成的对象型数组
        this.triangles = []; // 三角形集合，对象型数组
        this.vertices = []; // 平展开的对立三角形顶点集合
        this.params = params;
        this.parsePath();
        this.update();
    }

    /**
     * 更新方法，基于pathData 生成vertices
     */
    update() {
        this.vertices = [];
        this.triangles = [];
        // 寻找三角形
        this.findTriangle(0);
        // 更新三角形
        this.updateVertices();
    }

    /**
     * 基于路径数据pathData 转成对象型数组
     */
    parsePath() {
        let result = [];
        const {pathData} = this;
        for (let i = 0, len = pathData.length; i < len; i = i + this.params.length) {
            let obj = {};
            let count = 0;
            this.params.forEach((item) => {
                obj[item] = pathData[count + i];
                count++;
            })
            result.push(obj)
        }
        this.geoData = result
    }

    /**
     * 寻找符合条件的三角形
     * @param i 顶点在geoData 中的索引位置，表示从哪里开始寻找三角形
     */
    findTriangle(i) {
        const {geoData, triangles} = this;
        const geoDataList = [].concat(geoData)
        const triangleList = []
        const len = triangleList.length;
        if (triangleList.length <= 3) {
            triangleList.push([...geoDataList])
        } else {
            // 初始点位
            const [v0, v1, v2] = [
                i % len,
                (i + 1) % len,
                (i + 2) % len
            ];
            const triangle = [
                geoData[v0],
                geoData[v1],
                geoData[v2]
            ];

        }
    }

    /**
     * 判断三角形中是否有其它顶点
     * @param triangle 三角形
     */
    includePoint(triangle) {

    }

    /**
     * 判断一个顶点是否在三角形中
     * @param p0
     * @param triangle
     */
    inTriangle(p0, triangle) {

    }

    /**
     * 以p0为基点，对二维向量p0p1、p0p2做叉乘运算，这里实际上计算的就是看符不符合
     * @param p0
     * @param p1
     * @param p2
     */
    cross([p0, p1, p2]) {

    }

    /**
     * 基于对象数组geoData 生成平展开的vertices 数据
     */
    updateVertices() {

    }
}