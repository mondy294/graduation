<template>
    <div class="container">
        <div class="tool-header">
            <MonthlyData :orderList="orderList"></MonthlyData>
            <!-- <el-button type="primary" @click="dialogVisible = !dialogVisible">发布</el-button>
            <el-button v-show="productList.data.length" type="primary" @click="cancle">撤消</el-button> -->
        </div>
        <el-table v-loading="loading" element-loading-text="Loading..."
            :data="orderList.data.slice(PAGE_SIEE * (currentPage - 1), PAGE_SIEE * currentPage)" style="width: 100%"
            height="1000" :default-sort="{ prop: 'date', order: 'descending' }" empty-text="您暂未发布任何商品~">
            <el-table-column prop="date" label="日期" sortable>
                <template #default="scope">
                    <div style="display: flex; align-items: center">
                        <el-icon>
                            <timer />
                        </el-icon>
                        <span style="margin-left: 10px">{{ scope.row.date }}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="卖家">
                <template #default="scope">
                    <el-popover effect="light" trigger="hover" placement="top" width="auto">
                        <template #default>
                            <div>name: {{ scope.row.seller }}</div>
                        </template>
                        <template #reference>
                            <el-tag>{{ scope.row.seller }}</el-tag>
                        </template>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column prop="count" label="总数 /吨" sortable>
            </el-table-column>
            <el-table-column prop="price" label="价格 CO2/吨" sortable>
            </el-table-column>
            <el-table-column prop="totalmoney" label="总价 ￥" sortable>
            </el-table-column>
            <!-- <el-table-column label="操作">

                <template #default="scope">
                    <el-button size="small" type="primary">编辑</el-button>
                </template>
            </el-table-column> -->
        </el-table>
        <div class="pagination">
            <el-pagination :page-size="PAGE_SIEE" layout="prev, pager, next" :total="orderList.data.length"
                v-model:current-page="currentPage" hide-on-single-page />
        </div>
    </div>
</template>

<script setup lang="ts">
import { MyOrder } from '@/api/index'
import { Timer } from '@element-plus/icons-vue'

import { onMounted, reactive, ref, computed, onBeforeMount } from 'vue';
import { ElMessage } from 'element-plus';
import { PAGE_SIEE } from '@/constant'

import MonthlyData from '@/components/MonthlyData/index.vue'


const currentPage = ref(1)
const userInfo = reactive(JSON.parse(localStorage.getItem('user')))
const loading = ref(true)


const orderList = reactive({
    data: []
})

onMounted(async () => {
    await getMyOrder()
})

const getMyOrder = async () => {
    const { id: buyid } = userInfo
    loading.value = true
    const res = await MyOrder({ buyid })

    if (res.data.status == 0) {
        const { data } = res.data

        orderList.data = data

        setTimeout(() => {
            loading.value = false
        }, 500);

    }
}


</script>

<style scoped lang="scss">
.container {
    .tool-header {
        width: 100%;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: space-around;
        padding: 0 20px;
        border-bottom: 1px solid #eee;
    }

    .pagination {
        width: 100%;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

}
</style>