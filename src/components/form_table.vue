<template>
<!-- 表单及表格编辑 -->
<el-form class="form" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
    <el-form-item label="链接名称：" prop="hrefName">
        <el-input v-model="ruleForm.hrefName"></el-input>
    </el-form-item>
    <el-form-item label="链接地址：" prop="href" required>
        <el-input v-model="ruleForm.href"></el-input>
    </el-form-item>
    <el-form-item label="下划线：" prop="isUnderline">
        <el-radio-group v-model="ruleForm.isUnderline">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
        </el-radio-group>
    </el-form-item>
    <el-form-item label="打开方式：" prop="wayToOpen">
        <el-select v-model="ruleForm.wayToOpen" placeholder="请选择打开方式">
            <el-option label="新页面" value="blank"></el-option>
            <el-option label="弹窗" value="top"></el-option>
            <el-option label="路由跳转" value="router"></el-option>
        </el-select>
    </el-form-item>

    <el-form-item label="动态参数：" prop="dynamicParameters">
        <el-table ref="multipleTable" border stripe :data="dynamicParameters" height="160" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="key" label="数据列" align="center" width="220"></el-table-column>
            <el-table-column prop="paramKey" label="参数" align="center" width="225">
                <template slot-scope="scope">
                    <!-- 表格编辑 -->
                    <span v-if="currentCell == 'paramKey1'+scope.$index">
                        <el-input v-model="scope.row.paramValue" @blur="inputBlur" />
                    </span>
                    <span v-else @click="handleSpan(scope,1)">{{ scope.row.paramValue }}</span>
                </template>
            </el-table-column>
        </el-table>
    </el-form-item>
    <el-form-item label="固定参数：" prop="staticParameters">
        <el-table :data="ruleForm.staticParameters" border stripe style="width: 100%" height="160">
            <el-table-column width="100" align="center">
                <template slot-scope="scope">
                    <el-button v-if="scope.$index==ruleForm.staticParameters.length-1" @click="addParmer(scope)" type="text" size="small">新增</el-button>
                    <el-button v-else @click="delParmer(scope)" type="text" class="red" size="small">删除</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="paramKey" label="数据列" align="center">
                <template slot-scope="scope">
                    <span v-if="currentCell == 'paramKey2'+scope.$index">
                        <el-input v-model="scope.row.paramKey" @blur="inputBlur" />
                    </span>
                    <span v-else @click="handleSpan(scope,2)">{{ scope.row.paramKey }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="paramValue" label="参数" align="center">
                <template slot-scope="scope">
                    <span v-if="currentCell == 'paramValue2'+scope.$index">
                        <el-input v-model="scope.row.paramValue" @blur="inputBlur" />
                    </span>
                    <span v-else @click="handleSpan(scope,2)">{{ scope.row.paramValue }}</span>
                </template>
            </el-table-column>
        </el-table>
    </el-form-item>
    <el-form-item class="btns">
        <div>
            <el-button class="del" @click="delForm('ruleForm')">删除</el-button>
            <el-button @click="cancleForm('ruleForm')">取消编辑</el-button>
            <el-button type="primary" @click="submitForm('ruleForm')">完成编辑</el-button>
        </div>
    </el-form-item>
</el-form>
</template>

<script>
import {
    getLinkDetail,
    delLinkList,
    saveLinkList
} from "@/api/query.js";
export default {
    props: ["itemId", "metaList"],
    data() {
        return {
            dynamicParameters: [],
            ruleForm: {
                hrefName: "",
                href: "",
                isUnderline: "0",
                wayToOpen: "top",
                dynamicParameters: [],
                staticParameters: [{
                    paramKey: "",
                    paramValue: "",
                }, ],
            },
            rules: {
                hrefName: [{
                        required: true,
                        message: "请输入链接名称",
                        trigger: "blur",
                    },
                    {
                        min: 2,
                        max: 15,
                        message: "长度在 2 到 15 个字符",
                        trigger: "blur",
                    },
                ],
                href: [{
                    required: true,
                    message: "请输入链接地址",
                    trigger: "blur",
                }, ],
            },
            currentCell: "",
            multipleSelection: [],
        };
    },
    mounted() {
        // 点击弹出框事件触发请求数据或者清空数据
        this.$bus.$on("editLink", (id) => {
            this.restDynamic(this.metaList);
            if (id) {
                this._getLink(id);
            } else {
                this.formRest();
            }
        });
    },
    methods: {
        _getLink(operateId) {
            getLinkDetail(operateId).then((res) => {
                console.log("getLinkDetail", res);
                this.ruleForm = res.data;
                // this.multipleSelection = res.data.dynamicParameters;
                let danamicTemp = res.data.dynamicParameters;
                // uuid赋值给表格元素
                this.tableSelected(danamicTemp);
                if (!this.ruleForm.staticParameters) {
                    this.ruleForm.staticParameters = [{
                        paramKey: "",
                        paramValue: "",
                    }, ];
                }
            });
        },
        _saveLinkList(form) {
            saveLinkList(form).then((res) => {
                res.success && this.$message.success("保存成功");
                this.dialogClose();
            });
        },
        submitForm(formName) {
            let _this = this;
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    _this.ruleForm.dynamicParameters = _this.multipleSelection;
                    _this._saveLinkList(_this.ruleForm);
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        cancleForm(formName) {
            //  this.$refs[formName].resetFields();
            this.$emit("closeLink");
        },
        delForm() {
            // this.$refs[formName].resetFields();
            delLinkList(this.ruleForm.uuid).then((res) => {
                res.success && this.$message.success("删除成功");
                this.dialogClose();
            });
        },
        tableSelected(temp) {
            if (temp && temp.length) {
                temp.map((item, index) => {
                    this.dynamicParameters.map((item1, index1) => {
                        if (item.paramKey == item1.paramKey) {
                            item1 = Object.assign(item1, item);
                            this.$refs.multipleTable &&
                                this.$refs.multipleTable.toggleRowSelection(item1, true);
                        }
                    });
                });
            }
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        addParmer(scope) {
            this.ruleForm.staticParameters.push({
                paramKey: "",
                paramValue: "",
            });
        },
        delParmer(row) {
            this.ruleForm.staticParameters.splice(-2, 1);
        },
        inputBlur() {
            this.currentCell = "";
        },
        handleSpan(scope, type) {
            this.currentCell = scope.column.property + type + scope.$index;
        },
        formRest() {
            this.$refs["ruleForm"] && this.$refs["ruleForm"].resetFields();
            this.ruleForm.staticParameters = [{
                paramKey: "",
                paramValue: "",
            }, ];
            this.$refs.multipleTable && this.$refs.multipleTable.clearSelection();
        },
        restDynamic(metaList) {
            this.dynamicParameters = [];
            metaList.map((item) => {
                this.dynamicParameters.push({
                    operateId: "",
                    paramKey: item.metadataName,
                    paramValue: "",
                    key: item.headTitle,
                });
            });
        },
        dialogClose() {
            this.$emit("closeLink");
        },
    },
    watch: {
        metaList: {
            handler(newVal) {
                console.log("metaList", newVal);
                this.restDynamic(newVal);
            },
            immediate: true,
        },
        itemId: {
            handler(newVal) {
                console.log("itemId", newVal);
                this.ruleForm.itemId = newVal;
                //  this._getLink(newVal);
            },
            immediate: true,
        },
    },
};
</script>

<style lang="scss" scoped>
.form {
    margin-bottom: 0;

    .red {
        color: #dc2b2b;
    }

    .btns {
        margin-bottom: 0;

        .del {
            background-color: #e13203;
            color: #fff;
        }
    }
}
</style><style lang="scss">
.form {
    .el-radio {
        line-height: 40px;
    }

    .el-form-item {
        margin-bottom: 12px;
    }

    .el-form-item__label {
        line-height: 30px;
    }

    .btns {
        .el-form-item__content {
            margin-left: 0 !important;

            &>div {
                width: max-content;
                margin: 0 auto;
            }
        }
    }

    .el-table {
        border: solid 1px #aaaaaa;

        td,
        th {
            padding: 4px 0;
        }

        .cell {
            font-weight: 400;
            padding-right: 0;
            padding-left: 0;
            height: 30px;
            line-height: 30px;

            &>span {
                display: inline-block;
                width: 100%;
                height: 100%;
                cursor: pointer;
            }

            &>label {
                transform: translateY(8px);
            }
        }

        thead th.is-leaf {
            background: #f2f2f2;
        }

        td,
        th.is-leaf {
            border-color: #aaaaaa;
        }

        td {
            padding: 0 !important;
        }

        .el-table--border th:last-child {
            border-right: none;
        }
    }
}
</style>
