<template>
    <div class="container">
        <div class="tool-header">
            <el-button type="primary" @click="dialogVisible = !dialogVisible">发布</el-button>
            <el-button v-if="productList.data.length" type="primary" @click="cancle">撤消</el-button>
        </div>
        <el-table v-loading="loading" element-loading-text="Loading..."
            :data="productList.data.slice(PAGE_SIEE * (currentPage - 1), PAGE_SIEE * currentPage)" style="width: 100%"
            @selection-change="handleSelectionChange" height="1000"
            :default-sort="{ prop: 'date', order: 'descending' }" empty-text="您暂未发布任何商品~">

            <el-table-column v-if="productList.data.length" type="selection" width="55" />
            <el-table-column v-if="false" type="selection" width="55" />
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
            <el-table-column prop="remain" label="剩余数 /吨" sortable>
            </el-table-column>
            <el-table-column prop="price" label="价格 CO2/吨" sortable>
            </el-table-column>
            <el-table-column label="操作">

                <template #default="scope">
                    <el-button size="small" type="primary" @click="rowDetails(scope.row)">查看详情</el-button>
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
        <el-dialog v-model="showOrderDetails" title="详情" width="1200" :before-close="closeDetails">
            <OrderDetail v-if="showOrderDetails" :total="total" :remain="remain" :orderDetails="orderDetails">
            </OrderDetail>


        </el-dialog>
        <div class="pagination">
            <el-pagination :page-size="10" layout="prev, pager, next" :total="productList.data.length"
                v-model:current-page="currentPage" hide-on-single-page />
        </div>
    </div>
</template>

<script setup lang="ts">
import { Timer } from '@element-plus/icons-vue'
import { Trade, Cancle, Publish, getOrderDetails } from '@/api/index'
import { onMounted, reactive, ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { getRepertory } from './index'
import { MessageBox } from '@/utils/index'
import OrderDetail from '@/components/OrderDetail/index.vue'
import { PAGE_SIEE } from '@/constant'



const userInfo = reactive(JSON.parse(localStorage.getItem('user')))

const count = ref(1)
const price = ref(0)
const total = ref()
const remain = ref()
const selections = reactive({
    data: []
})


const productList = reactive({
    data: []
})
let orderDetails = reactive({ data: [] })
const showOrderDetails = ref(false)
const dialogVisible = ref(false)
const currentRepertory = ref(0)

const currentPage = ref(1)

const loading = ref(true)

const socket = window.socket



onMounted(async () => {
    currentRepertory.value = await getRepertory(userInfo.id)

    // 查询当前账号库存
    await getRepertory(userInfo.id)

    // 请求我的商品
    await getProducts()

})



const getProducts = async () => {
    loading.value = true
    const { id } = userInfo
    const res = await Trade({ id, page: 'products' })
    if (res.data.status == 0) {
        const { data } = res.data
        productList.data = data
        setTimeout(() => {
            loading.value = false
        }, 500);
    }

}

const rowDetails = async (row) => {
    const res = await getOrderDetails({ orderId: row.id })
    if (res.data.status == 0) {
        const { data } = res.data
        orderDetails.data = data
        total.value = row.count
        remain.value = row.remain

        showOrderDetails.value = true

    }



}
const closeDetails = () => {
    showOrderDetails.value = false
}
const cancle = async () => {
    if (selections.data.length == 0) {
        ElMessage.warning('请选择至少一个商品')
        return
    }
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
        const message: MessageBox = {
            type: 4
        }
        socket.send(JSON.stringify(message))
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

        const message: MessageBox = {
            type: 4
        }
        socket.send(JSON.stringify(message))
        ElMessage.success('发布成功')

    }

}
const handleSelectionChange = (data) => {
    selections.data = [...data]

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

    .charts {
        width: 100%;
        height: 300px;
    }

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