<template>
    <div class="container">
        <div class="filter-header">
            <div class="fuzzy-search">
                <el-input v-model="search" size="small" placeholder="搜索卖家" @input="searchChange" @blur="searchBlur"
                    @focus="searchFocus" />
                <div v-show="showSearch" class="fuzzy-box">
                    <div v-show="fuzzyList.data.length > 0" class="success">
                        <div class="fuzzy-item" v-for="(item, index) in fuzzyList.data" :key="index"
                            @mousedown="filterProduct(item)">{{
                                item }}</div>
                    </div>
                    <div v-show="fuzzyList.data.length == 0" class="fail">
                        <span>暂无搜索结果</span>
                    </div>
                </div>
            </div>
            <!-- <div class="count">
                预购买数量:
                <el-input-number v-model="count" :min="1" :max="10" @change="handleCountChange" />
            </div> -->
            <div class="smartBuy">
                <el-button type="primary" @click="smartChoose">智能选择</el-button>
            </div>


        </div>
        <el-table v-loading="loading" ref="multipleTableRef"
            :data="productList.data.slice(10 * (currentPage - 1), 10 * currentPage)" height="1200"
            :default-sort="{ prop: 'date', order: 'descending' }" empty-text="暂无任何发布~">
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
            <el-table-column prop="remain" label="数量 /吨" sortable>
            </el-table-column>
            <el-table-column prop="price" label="价格 CO2/吨" sortable>
            </el-table-column>
            <el-table-column label="操作">

                <template #default="scope">
                    <el-button size="small" type="primary" @click="handleBuy(scope.$index, scope.row)">购买</el-button>
                    <el-button size="small" type="primary"
                        @click="handleAddFriend(scope.$index, scope.row)">加好友</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog v-model="dialogVisible" title="确认购买" width="400" :before-close="handleClose">
            <div class="dialog-count">
                <span> 购买数量：</span>
                <el-input-number v-model="count" :min="1" :max="currentRow.data.remain" @change="handleCountChange" />
            </div>
            <div class="total-money">
                <span>总计金额：</span>
                <span>{{ totalMoney }}￥</span>
            </div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="confirm('cancle')">取消</el-button>
                    <el-button type="primary" @click="confirm('confirm')">
                        确认购买
                    </el-button>
                </div>
            </template>
        </el-dialog>
        <div class="pagination">
            <el-pagination :page-size="10" :pager-count="10" layout="prev, pager, next" :total="productList.data.length"
                v-model:current-page="currentPage" @current-change="currentChange" hide-on-single-page />
        </div>
    </div>


</template>

<script setup lang="ts">
import { Timer } from '@element-plus/icons-vue'
import { Trade } from '@/api/index'
import { onMounted, reactive, ref, computed } from 'vue';
import { ElMessage } from 'element-plus';

import { TradeRow } from '@/utils/index'
import { getRepertory } from './index'

import { Purchase } from '@/api/index'

const productList = reactive({
    data: []
})

const copy = []
const search = ref('')
const showSearch = ref(false)
const nameList = reactive([])
const fuzzyList = reactive({ data: [] })
const count = ref(0)

// 当前购买对象信息
const currentRow = reactive({
    data: {} as TradeRow
})

const multipleTableRef = ref()
// 展示对话框
const dialogVisible = ref(false)
// 当前金额
const totalMoney = ref(0)
const userInfo = reactive(JSON.parse(localStorage.getItem('user')))

const currentRepertory = ref(0)

const currentPage = ref(1)

const loading = ref(true)



interface User {
    date: string
    name: string
    address: string
}


onMounted(async () => {
    // 获取当前库存
    currentRepertory.value = JSON.parse(localStorage.getItem('repertory'))
    // 获取商品列表
    await getTrade()
    // 获取卖家列表
    getNameList()

})
const handleBuy = (index: number, row: any) => {
    dialogVisible.value = true
    // 存储当前行信息
    currentRow.data = row
    // buyCount.value = row.count
    // price.value = row.price
    totalMoney.value = row.price
}
const handleAddFriend = (index: number, row: User) => {
    console.log(index, row)
}
// 模糊搜索
const searchChange = () => {

    // 清空搜索结果
    fuzzyList.data = []
    showSearch.value = true
    // 输入框为空时 同时清空筛选
    if (search.value == '') {
        remake()
        showSearch.value = false

    }

    let target = nameList.filter((item: string) => {
        return item.includes(search.value)
    })
    fuzzyList.data = [...target]

}
// 获取卖家名单
const getNameList = (() => {
    let arr = productList.data.map((item) => item.seller)
    nameList.push(...arr)
})
// 搜索后筛选
const filterProduct = (seller: string) => {
    // 在备份数组中去需寻找
    let arr = copy.filter((item) => {
        return item.seller == seller
    })
    productList.data = [...arr]
    search.value = seller


}
const searchBlur = () => {
    showSearch.value = false
}
const searchFocus = () => {
    if (search.value != '') {
        showSearch.value = true
    }
}

// 清空筛选条件
const remake = () => {
    productList.data = copy
}
// 获取商品列表
const getTrade = async () => {
    try {
        loading.value = true
        let res = await Trade({ id: userInfo.id, page: 'trade' })
        if (res.data.status == 0) {

            const { data }: { data: [] } = res.data
            // 不展示卖完的商品
            productList.data = data.filter((item: any) => item.remain > 0)
            // 备份数组
            copy.push(...data)
            loading.value = false
        }
        else {
            ElMessage.error(res.data.message)
        }
    } catch (error) {
        ElMessage.error(error)
    }
}

// 智能选择
const smartChoose = () => {

}


const handleCountChange = (val) => {
    totalMoney.value = val * currentRow.data.price
    totalMoney.value = parseFloat(totalMoney.value.toFixed(1))
}
// 对话框最后选择时
const confirm = (type: string) => {
    switch (type) {
        case ('cancle'):
            handleClose()
            break
        case ('confirm'):
            Buy(currentRow.data, count.value)
            handleClose()
            break
    }
}
const Buy = async (row: TradeRow, count: number) => {
    let repertory = await getRepertory(userInfo.id)
    let { id: buyid, nickname: buyer } = userInfo
    const id = row.id

    // 购买之后剩余的数量
    const remain = currentRow.data.remain - count

    const { sellid, seller, id: orderid } = currentRow.data
    const totalmoney = totalMoney.value
    // 购买后当前用户碳配额增长
    repertory = repertory + count
    const info = { id, remain, buyid, buyer, count, totalmoney, sellid, seller, repertory, orderid }
    const res = await Purchase(info)
    if (res.data.status == 0) {
        await getRepertory(userInfo.id)
        // 重新获取商品信息
        await getTrade()
        ElMessage.success('购买成功')

    }

}
// 通过失去焦点关闭
const handleClose = () => {
    dialogVisible.value = false
    count.value = 1
    totalMoney.value = 0

}

const currentChange = (page) => {


}


</script>

<style scoped lang="scss">
.container {
    width: 100%;
    height: 100%;

    .filter-header {
        display: flex;
        align-items: center;
        padding: 0 20px;
        width: 100%;
        height: 48px;
        border-bottom: 1px solid #eee;
        justify-content: space-between;

        .fuzzy-search {
            position: relative;
            width: 275px;


            .fuzzy-box {
                position: absolute;
                width: 100%;
                max-height: 200px;
                overflow: auto;
                z-index: 10000;
                background-color: #fff;
                border: 1px solid #eee;
                border-bottom-left-radius: 10px;
                border-bottom-right-radius: 10px;

                .success {
                    width: 100%;

                    .fuzzy-item {
                        width: 100%;
                        height: 40px;
                        line-height: 40px;
                        cursor: pointer;
                        transition: all 0.5s;
                        padding: 0 20px;
                        color: gray;

                        &:hover {
                            background-color: #F5F7FA;
                        }
                    }
                }

                .fail {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    height: 100%;
                    min-height: 190px;
                    color: gray;
                }
            }
        }

        .count {
            color: gray;
        }
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