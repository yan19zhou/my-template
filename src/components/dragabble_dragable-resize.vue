<template>
<draggable class="dragArea list-group table-w component1 border vue-draggable-content" :list="drawingList" group="component1" :parent="parentId" :tabIndex="tabIndex" :parentEle="parentEle" @change="(evt)=>log(evt,parentId)" ref="dragContainer" @start="start" @end="end">
    <vue-draggable-resizable :h="element.h" :min-width="80" :min-height="20" ref="containerResize" :conType="element.conType" :class="[parentId&&element.conType=='t_table'?'has-parent-wrap':'','select']" class-name-active="my-active-class" v-for="(element,index) in drawingList" :key="index" @activated="()=>onActivated(element,index,parentEle)" @deactivated="deactivated" @resizestop="()=>resizestop(index,parentId,element)" :draggable="false" :enable-native-drag="true">
        <div class="resize-wrap box-w" :ref="element.conType=='t_table'?'resizeW':'11'">
            <label class="drag" v-if="!['t_div','t_tab_box','t_table'].includes(element.conType) && activeId != element.id" @dblclick="activeLabel(element)" :title="element.label">{{ element.label}}</label>
            <input v-if="activeId == element.id" type="text" v-model="element.label" @blur="blurLabel" class="label-input" />
            <div :class="[dragState?'auto-pointer-events':'no-pointer-events','input-wrap']" v-if="!['t_div','t_tab_box'].includes(element.conType)" :style="{width:['t_div','t_tab_box','t_table'].includes(element.conType) ?'100%': '80%'}" @dragstart="start" @dragover="end"></div>

            <el-dropdown placement="bottom-start" class="drop-w" trigger="click">
                <span class="el-dropdown-link">
                    <i class="iconfont icon-shenglve"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item class="item-drop">
                        <p @click="del(element,index,parentEle)">
                            <i class="iconfont icon-lajitong1 red-font drop-icon" style="font-size:14px">删除</i>
                        </p>
                    </el-dropdown-item>
                    <!-- <el-dropdown-item>
                <p @click="saveCon(element,parentId,index)">
                  <i class="iconfont icon-baocun drop-icon">保存</i>
                </p>
            </el-dropdown-item>-->
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </vue-draggable-resizable>
</draggable>
</template>

<script>
import draggable from "vuedraggable";
import VueDraggableResizable from "@/components/vue-draggable-resizable-native";
import "@/components/vue-draggable-resizable.css";

export default {
    name: "draggableItem",
    components: {
        draggable,
        VueDraggableResizable,
    },
    data() {
        return {
            activeName: "0",
            activeId: "9999",
            metaList: [],
            containerHeight: "100%",
            currentEle: {},
            tableHeight: 350,
            dragState: true, //鼠标事件是否禁用
        };
    },
    props: ["drawingList", "element", "parentId", "tabIndex", "parentEle"],
    computed: {
        ...mapState(["dataSetId", "queryId", "dataSetName"]),
    },
    mounted() {
        this.$bus.$on("delMeta", () => {
            let {
                element,
                parentId,
                index
            } = this.currentEle;
            element && this.saveCon(element, parentId, index);
        });
    },
    methods: {
        start() {
            // 用来控制resize组件的拖拽
            this.dragState = false;
        },
        end() {
            // 用来控制resize组件的拖拽
            this.dragState = true;
        },
        _isDict(dict) {
            return Object.keys(dict).length;
        },
        _DelContainer(queryId, id) {},

        GetOption(arr) {
            if (arr) {
                return arr.filter((item) => {
                    return item != null;
                });
            }
            return [];
        },

        del(element, index, parentEle) {
            //查询条件删除;
            if (element.id) {
                this._DelContainer(this.queryId, element.id);
                this.$emit("delCon", element);
            }
            if (parentEle && parentEle.conType == "t_tab_box") {
                let i = this.getTabActive(element, parentEle);
                console.log("del", i);
                parentEle.children.splice(i, 1);
            } else {
                this.drawingList.splice(index, 1);
            }
            this.$set(this.drawingList);
            this.changeMetaList(element, "del");
        },
        saveCon(element, parentId, index) {
            this.saveBoxParams(element, parentId, index);
        },
        log(evt, parentId) {
            if (evt.added && evt.added.element) {} else {}
        },
        logLayout(evt, element) {
            //  console.log("logLayout", evt, element);
        },
        activeLabel({
            id
        }) {
            // 更改label的值
            this.activeId = id;
        },
        blurLabel() {
            this.activeId = "9999";
        },
        onActivated(element, index, parentEle) {
            let _this = this;
            if (element.conType == "t_table") {
                this.currentEle = {
                    element: element,
                    index: index,
                    parentEle: parentEle,
                };
            }
            document.onkeyup = function (e) {
                let key = e.keyCode;
                if (key == 46) {
                    //按键删除
                    // 。。。。。
                }
            };
        },
        deactivated() {
            // resizeable失焦
            // input隐藏
            this.activeId = "9999";
            // this.$store.commit("setMetaList", []);
        },

        resizestop(index, parentId, element) {
            // 拖拽结束保存数据
            let types = ["t_text", "t_select"];
            if (types.includes(element.conType) && !element.metadataName) {
                return;
            }
            if (element.conType == "t_table" && !element.tableHeads.length) {
                return;
            }

            this.saveBoxParams(element, parentId, index);
            //传递事件给vue-draggable-resizeable组件重新计算宽高
            this.$bus.$emit("dragStop");
        },
        setSearchHeight() {
            // 设置条件查询容器高度
            let top = this.getSearchComponentHeight();
            this.containerHeight = top + 100 + "px";
            // 触发组件重新计算draggable-resizeable父元素高度
            this.$bus.$emit("dragChange");
        },
        getSearchComponentHeight() {
            // 获取查询条件中组件最大的top
            let selects = this.$refs.containerResize;
            if (selects.length) {
                let top1 = this.$refs.containerResize[0].top;
                for (let i = 1; i < selects.length; i++) {
                    if (top1 < selects[i].top) {
                        top1 = selects[i].top;
                    }
                }
                return top1;
            }
            return;
        },
    },
};
</script>

<style lang="scss" scoped>
@import "../../../assets/styles/query.scss";

.has-parent-wrap {
    width: 100% !important;
    height: 85% !important;

    .sortable-ghost {
        left: auto !important;
        bottom: auto !important;
        border: none;
    }
}

.vue-draggable-content label {
    color: #000;
}

.tabs {
    height: 100%;
    position: relative;
}

.center-icon {
    position: absolute;
    top: 40%;
    left: 50%;
    font-size: 40px;
    color: green;
    transform: translateX(-50%);
}

.container-drag {
    width: 100%;
    height: 100%;
}

.el-select {
    width: 100%;
}

.box-w .drop-w {
    height: auto;
}

.component1 {
    position: relative;

    .sortable-ghost {
        position: absolute;
    }
}

.no-pointer-events {
    pointer-events: none;
}

.auto-pointer-events {
    pointer-events: auto;
}
</style><style lang="scss">
.el-table.sortable-ghost {
    width: 100%;
}

.resize-wrap {
    position: relative;

    .sortable-ghost {
        position: absolute;
        left: -1%;
        bottom: -2%;
        width: 100%;
        height: 100%;
        border: #05d605 2px dotted;
        color: transparent;
    }
}

.el-table.sortable-ghost,
.tabs.sortable-ghost {
    border: none;
    left: auto;
    bottom: auto;
}

.table-w .el-tab-pane {
    .dragArea {
        width: 100%;
    }

    .my-active-class {

        // width: 98% !important;
        .resize-wrap {
            width: 100%;
            height: 88%;
        }
    }
}

.handle {
    box-sizing: border-box;
    position: absolute;
    width: 8px;
    height: 8px;
    background: #03a9f4 !important;
    border: none !important;
    box-shadow: 0 0 0;
    border-radius: 50%;
    z-index: 999999;
}

.resize-wrap .el-table td {
    padding: 5px 0 !important;
}

.resize-wrap .el-table__body-wrapper {
    min-height: 240px !important;
}

.table-w .vdr {
    position: relative;
    width: 100% !important;
    margin: 10px 0;
}
</style>
