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

        </div>
        <el-table :data="productList.data" style="width: 100%" :default-sort="{ prop: 'date', order: 'descending' }"
            :cell-style="cellState">
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
            <el-table-column prop="count" label="数量 /吨" sortable>
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
    </div>

</template>

<script setup lang="ts">
import { Timer } from '@element-plus/icons-vue'
import { Trade } from '@/api/index'
import { onMounted, reactive, ref, } from 'vue';
import { ElMessage } from 'element-plus';

const productList = reactive({
    data: []
})
const copy = []
const search = ref('')
const showSearch = ref(false)
const nameList = reactive([])
const fuzzyList = reactive({ data: [] })


onMounted(async () => {

    // 获取商品列表
    await getTrade()
    // 获取卖家列表
    getNameList()

})
const handleBuy = (index: number, row: User) => {
    console.log(index, row)
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
        let res = await Trade()
        if (res.data.status == 0) {
            const { data } = res.data
            productList.data.push(...data)
            // 备份数组
            copy.push(...data)
        }
        else {
            ElMessage.error(res.data.message)
        }
    } catch (error) {
        ElMessage.error(error)
    }
}

const rowState = () => {
    return {
        // backgroundColor: 'pink',
        // color: '#fff',
        tableLayout: 'fixed'
        // display: 'flex',
        // alignItems: 'center',
        // justifyContent: 'center',
    }
}

const cellState = () => {
    return {
        overflow: 'visible',
        // width: '300px',
        // backgroundColor: 'red',
    }
}

interface User {
    date: string
    name: string
    address: string
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
    }

}
</style>