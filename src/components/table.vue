<template>
<!-- 动态多表格 -->
<div>
    <el-table border :data="element.resultVo.result?element.resultVo.result.records:[]" height="350" class="container">
        <!-- 序号 -->
        <el-table-column v-if="element.resultVo.result && element.resultVo.result.records.length" type="index" width="60" label="序号">
            <template slot-scope="scope">
                <span>{{element.resultVo.result.size*(element.resultVo.result.current-1)+scope.$index+1}}</span>
            </template>
        </el-table-column>
        <!-- 码值/超链接/正常 -->
        <el-table-column :prop="item.metadataName" :label="item.metadataComment" v-for="(item,index ) in element.tableHeads" :key="index">
            <template slot-scope="scope">
                <span v-if="item.hasDict">{{getDict(item.dict,scope.row[item.metadataName])}}</span>
                <span v-else-if="item.itemOperate.length>1">
                    <span class="item-operate" v-for="(item2,index2) in item.itemOperate" :key="index2" href @click="itemOperate(item2,scope.row)">
                        <span :class="[item2.isUnderline=='0'?'noUnderline':'']">{{item2.hrefName}}</span>
                    </span>
                </span>
                <span v-else-if="item.itemOperate.length==1">
                    <span class="item-operate" href @click="itemOperate(item.itemOperate[0],scope.row)">
                        <span :class="[item.itemOperate[0].isUnderline=='0'?'noUnderline':'']">{{scope.row[item.metadataName]||item.itemOperate[0].hrefName}}</span>
                    </span>
                </span>
                <span v-else :title="scope.row[item.metadataName]">{{scope.row[item.metadataName]||''}}</span>
            </template>
        </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="pagination_box">
        <el-pagination v-if="element.resultVo.result" @size-change="(e)=>handleSizeChange(e,element)" @current-change="(e)=>handleCurrentChange(e,element)" :current-page="element.current" :page-sizes="[10, 50, 100, 200]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="element.resultVo.result.total"></el-pagination>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            element: {
                resultVo: {
                    result: {
                        records: [],
                    },
                },
            },
        };
    },
    methods: {
        itemOperate() {},
        handleSizeChange(val, element) {
            element.resultVo.result.size = val;
            this._previewSingle(element);
        },
        handleCurrentChange(val, element) {
            element.resultVo.result.current = val;
            this._previewSingle(element);
        },
    },
};
</script>

<style lang="scss" scoped>
</style>
