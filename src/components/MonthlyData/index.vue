<template>
    <div v-if="show" class="box">
        <div class="item">您这个月总计购买了
            <span>{{ totalBuy }}</span>
            吨
        </div>
        <div class="item">
            总计花费
            <span>{{ totalCost }}</span>
            ￥
        </div>
        <div class="item">
            平均
            <span>{{ perMoney }}</span>
            ￥/吨
        </div>
    </div>

</template>

<script setup lang="ts">
import { defineProps, ref, computed, onMounted, watch } from 'vue'
import { orderItem } from '@/utils/index'

const totalBuy = ref(0)
const totalCost = ref(0)
const perMoney = computed(() => {
    return totalBuy.value == 0 ? 0 : (totalCost.value / totalBuy.value).toFixed(1)
})

const props = defineProps(['orderList'])
const show = ref(false)

//   异步获取的数据 需要监听父组件
watch(props.orderList, (newValue, oldValue) => {
    const orderList = newValue
    show.value = true
    computeData(orderList.data)
})

function computeData(data: []) {
    const date = new Date()
    let month = date.toLocaleDateString()
    // 获取现在的月份
    const currentMonth = month.split('/')[1]
    // 筛出本月数据
    const MonthlyData = data.filter((item: orderItem) => {
        return item.date.split('/')[1] === currentMonth
    })

    // 求和算购买量
    MonthlyData.forEach((item: orderItem) => {
        totalBuy.value += item.count
        totalCost.value += item.totalmoney
    })

}


</script>

<style scoped lang="scss">
.box {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: start;

    .item {
        margin-right: 20px;
        color: gray;
        font-size: 14px;

        span {
            font-weight: 700;
            font-size: 18px;
        }
    }
}
</style>