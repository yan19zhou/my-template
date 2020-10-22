<template>
<div id="viewDiv" />
</template>

<script>
//npm install esri-loader就可以了
import {
    loadModules,
    loadCss
} from "esri-loader";
import {
    mapMutations
} from "vuex";

let MAP = null;
loadCss();
export default {
    data() {
        return {
            map: null,
            view: null,
            markpic: require("@/images/location.png"),
            Graphic: null,
            centerPoint: [],
        };
    },
    mounted() {
        console.log("coordinate ", this.coordinate);
        this.convertPoint(this.coordinate);
        this.initMap();
    },
    props: ["coordinate"],
    methods: {
        initMap() {
            const that = this;
            loadModules([
                    // "esri/tasks/Locator",
                    "esri/Map",
                    "esri/views/MapView", //2D地图引入，3D使用screenView
                    "esri/layers/TileLayer", //地图图层可以使用这个类来添加
                    "esri/Graphic", //图像，点线面等
                    "esri/widgets/Fullscreen", //全屏小部件
                    "esri/widgets/Zoom", //放大缩小部件
                    "dojo/domReady!",
                ])
                .then(([Map, MapView, TileLayer, Graphic, Fullscreen, Zoom]) => {
                    var transportationLayer = new TileLayer({
                        //url: "https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetGray/MapServer", //这边使用的是国内服务器上的中国地图
                        url: "https://ldxxcc.baoan.gov.cn/ldxcxc/arcgis/rest/services/BAKSJ/DTVEC_QS_ZQ_BA/MapServer", //这里千万小心，要用绝对路径，这是托管在本地服务器上的地址
                        id: "streets",
                    });
                    MAP = Map;
                    that.Graphic = Graphic;
                    that.map = new Map({
                        //basemap: "streets",//地图样式
                        layers: [transportationLayer], //低图的图层，我这里加入的是上一步定义的图层
                    });
                    that.view = new MapView({
                        map: that.map, //绘制的地图
                        container: "viewDiv", //绘制地图的ID
                        zoom: 3,
                        center: [113.85004376, 22.57494868],
                        spatialReference: 4490,
                    });
                    that.addPoint();
                })
                .catch((err) => {
                    console.error(err);
                });
        },
        addPoint() {
            this.view.graphics.removeAll();
            var point = {
                //创建点，并确定点的经度和纬度
                type: "point", // autocasts as new Polyline()
                x: this.centerPoint[0],
                y: this.centerPoint[1],
                spatialReference: 4490,
            };

            //添加图片修饰点
            var lineSymbol = {
                type: "picture-marker", // autocasts as new PictureMarkerSymbol()
                url: this.markpic,
                width: "54px",
                height: "54px",
            };
            var pointGraphic = new this.Graphic({
                //绘制点
                geometry: point,
                symbol: lineSymbol,
            });
            this.view.graphics.addMany([pointGraphic]);
            this.view.center = point;
            //地图点击事件获取信息
            this.view.on("click", (e) => {
                console.log("1111", e);
                // hitTest 方法在点击位置上如果存在 Graphic（线或点），即可获取 Graphic 对象的整个数据
                this.view.hitTest(e).then((res) => {
                    console.log("2222", res);
                    if (res.results.length) {
                        // 获取每个图形上的ID
                    }
                });
            });
            // 视图移动到指定位置
            this.view
                .goTo({
                    center: this.centerPoint,
                })
                .then(() => {
                    console.log("移动到中心");
                })
                .catch(function (error) {
                    console.log("错误了");
                    if (error.name != "AbortError") {
                        console.error(error);
                    }
                });
        },

        convertPoint(newVal) {
            let temp = newVal.split(",");
            this.centerPoint = [Number(temp[0]), Number(temp[1])];
        },
    },
    beforeDestroy() {
        if (this.view) {
            // destroy the map view
            this.view.destroy();
        }
    },
    watch: {
        coordinate(newVal) {
            this.convertPoint(newVal);
            console.log("tag", this.centerPoint);
            this.view && this.addPoint();
        },
    },
};
</script>

<style>
#viewDiv {
    z-index: 80;
    height: 400px;
    width: 400px;
}
</style>
