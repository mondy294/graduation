<template>
    <div class="container">
        <div class="tool-header">
            <el-button type="primary" @click="dialogVisible = !dialogVisible">发布</el-button>
            <el-button v-show="productList.data.length" type="primary" @click="cancle">撤消</el-button>
        </div>
        <el-table ref="multipleTableRef" :data="productList.data.slice(10 * (currentPage - 1), 10 * currentPage)"
            style="width: 100%" @selection-change="handleSelectionChange"
            :default-sort="{ prop: 'date', order: 'descending' }" empty-text="您暂未发布任何商品~">

            <el-table-column v-if="productList.data.length" type="selection" width="55" />
            <el-table-column v-if="false" type="selection" width="55" />
            <el-table-column label="日期" sortable>
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
            <el-table-column prop="remain" label="剩余数 /吨" sortable>
            </el-table-column>
            <el-table-column prop="price" label="价格 CO2/吨" sortable>
            </el-table-column>
            <el-table-column label="操作">

                <template #default="scope">
                    <el-button size="small" type="primary" @click="editRow()">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 对话框 -->
        <el-dialog v-model="dialogVisible" title="确认购买" width="400" :before-close="handleClose">
            <div class="dialog-count">
                <span> 发布数量：</span>
                <div>
                    <el-input-number v-model="count" :min="1" :max="currentRepertory" />
                    <span style="margin-left: 10px;">/吨</span>
                </div>

            </div>
            <div class="total-money">
                <span>价格：</span>
                <div>
                    <input v-model="price" placeholder="价格/￥" class="price" type="text">

                    <span style="margin-left: 10px;">￥/吨</span>
                </div>
            </div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="confirm('cancle')">取消</el-button>
                    <el-button type="primary" @click="confirm('confirm')">
                        确认发布
                    </el-button>
                </div>
            </template>
        </el-dialog>
        <div class="pagination">
            <el-pagination :page-size="10" :pager-count="10" layout="prev, pager, next" :total="productList.data.length"
                v-model:current-page="currentPage" hide-on-single-page />
        </div>
    </div>
</template>

<script setup lang="ts">
import { Timer } from '@element-plus/icons-vue'
import { Trade, Cancle, Publish, Repertory } from '@/api/index'
import { getRepertory } from './index'
import { onMounted, reactive, ref, computed } from 'vue';
import { ElMessage } from 'element-plus';

import { TradeRow } from '@/utils/index'

const userInfo = reactive(JSON.parse(localStorage.getItem('user')))

const count = ref(1)
const price = ref(0)
const selections = reactive({
    data: []
})
const productList = reactive({
    data: []
})
const dialogVisible = ref(false)
const currentRepertory = ref(0)

const currentPage = ref(1)

onMounted(async () => {
    currentRepertory.value = JSON.parse(localStorage.getItem('repertory'))

    // 查询当前账号库存
    await getRepertory(userInfo.id)

    // 请求我的商品
    await getProducts()

})

const getProducts = async () => {
    const { id } = userInfo
    const res = await Trade({ id, page: 'products' })
    if (res.data.status == 0) {
        const { data } = res.data
        productList.data = data
    }

}

const editRow = () => {

}
const cancle = async () => {
    const idList = []
    let repertory = await getRepertory(userInfo.id)
    selections.data.forEach((item) => {
        idList.push(item.id)
        repertory += item.remain
    })
    const res = await Cancle({ idList, repertory, sellid: userInfo.id })
    if (res.data.status == 0) {
        // 重新拉取数据
        await getProducts()
        await getRepertory(userInfo.id)
        ElMessage.success('删除成功')
    }
}
// 发布商品
const publish = async () => {
    const { id: sellid, nickname: seller } = userInfo
    let repertory = await getRepertory(userInfo.id)
    let timer = new Date()
    // 生成当前时间字符串
    let date = timer.toLocaleDateString() + ' ' + timer.toLocaleTimeString()
    // 发布后剩余的库存
    repertory -= count.value

    const data = { sellid, seller, date, price: price.value, count: count.value, remain: count.value, repertory }
    const res = await Publish(data)
    if (res.data.status == 0) {
        // 重新拉取数据
        await getProducts()
        await getRepertory(userInfo.id)
        ElMessage.success('发布成功')

    }

}
const handleSelectionChange = (data) => {
    selections.data = data


}

// 对话框最后选择时
const confirm = async (type: string) => {
    switch (type) {
        case ('cancle'):
            handleClose()
            break
        case ('confirm'):
            await publish()
            handleClose()
            break
    }
}
// 通过失去焦点关闭
const handleClose = () => {
    dialogVisible.value = false
    count.value = 1
}


</script>

<style scoped lang="scss">
.container {
    .tool-header {
        width: 100%;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: end;
        padding: 0 20px;
        border-bottom: 1px solid #eee;

        .cancle {}

    }


    .dialog-count {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .total-money {
        margin-top: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .price {
            padding: 0 5px;
            width: 45px;
            height: 30px;
            outline: none;
            border: 0px;
            border-bottom: 1px solid gray;
        }
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