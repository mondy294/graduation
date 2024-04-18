<template>
    <div class="container">
        <div class="charts">
            <div class="chart" id="chart"></div>
            <div class="pie-chart" id="pie-chart"></div>
        </div>

        <el-table v-loading="loading" element-loading-text="Loading..."
            :data="props.orderDetails.data.slice(pageSize * (currentPage - 1), pageSize * currentPage)"
            style="width: 100%" :default-sort="{ prop: 'date', order: 'descending' }" empty-text="暂时还无人购买~">
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
            <el-table-column label="买家">
                <template #default="scope">
                    <el-popover effect="light" trigger="hover" placement="top" width="auto">
                        <template #default>
                            <div>name: {{ scope.row.buyer }}</div>
                        </template>
                        <template #reference>
                            <el-tag>{{ scope.row.buyer }}</el-tag>
                        </template>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column prop="count" label="总数 /吨" sortable>
            </el-table-column>
            <el-table-column prop="price" label="价格 CO2/吨" sortable>
            </el-table-column>
            <el-table-column prop="totalmoney" label="总价 /￥" sortable>
            </el-table-column>
        </el-table>

        <div class="pagination">
            <el-pagination :page-size="pageSize" layout="prev, pager, next" :total="props.orderDetails.data.length"
                v-model:current-page="currentPage" hide-on-single-page />
        </div>
    </div>

</template>

<script setup lang="ts">
import { Timer } from '@element-plus/icons-vue'
import { Trade, Cancle, Publish, getOrderDetails } from '@/api/index'
import { onMounted, reactive, ref, defineProps, getCurrentInstance } from 'vue';



const props = defineProps(['orderDetails', 'total', 'remain'])

const currentPage = ref(1)
const pageSize = ref(5)
const loading = ref(false)
const data = props.orderDetails.data as []
let count = props.total
const remain = props.remain
// 通过 internalInstance.appContext.config.globalProperties 获取全局属性或方法

let internalInstance = getCurrentInstance();
let echarts = internalInstance.appContext.config.globalProperties.$echarts;

onMounted(() => {
    const option = countTrend()
    var myChart = echarts.init(document.getElementById('chart'));
    myChart.setOption(option)

    const pieOptions = countSituation()

    var myPieChart = echarts.init(document.getElementById('pie-chart'));
    myPieChart.setOption(pieOptions)
})
const countTrend = () => {
    const map = new Map()
    data.forEach((item: any) => {
        //    处理日期
        let date = item.date.split(' ')[0]
        if (!map.has(date)) map.set(date, 0)
        if (map.has(date)) {
            let total = map.get(date)
            total += item.count
            map.set(date, total)
        }

    })
    const yAxisData = Array.from(map.values())
    for (let i = 0; i < map.size; i++) {
        count -= yAxisData[i]
        yAxisData[i] = count
    }
    return {
        title: {
            text: '数量趋势'
        },
        xAxis: {
            data: Array.from(map.keys())
        },
        yAxis: {},
        series: [
            {
                type: 'line',
                smooth: true,
                data: yAxisData,
                itemStyle: {
                    normal: {
                        label: {
                            show: true, //开启显示
                            position: 'top', //在上方显示
                            textStyle: { //数值样式
                                color: 'black',
                                fontSize: 16
                            }
                        }
                    }
                }
            }
        ]
    };




}
const countSituation = () => {
    const map = new Map()
    data.forEach((item: any) => {
        let buyer = item.buyer
        if (!map.has(buyer)) map.set(buyer, 0)
        if (map.has(buyer)) {
            let total = map.get(buyer)
            total += item.count
            map.set(buyer, total)
        }

    })

    const option = Array.from(map.keys()).map((name) => {
        return {
            value: map.get(name),
            name: name
        }
    })
    if (remain !== 0) {
        option.push({
            value: remain,
            name: '剩余'
        })
    }

    return {
        title: {
            text: '购买分布'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },

        series: [
            {
                name: '购买比例',
                type: 'pie',
                label: {
                    show: true,
                    position: 'outside',
                    formatter: '{b} {c}吨'
                },

                data: option
            },
            {
                name: '购买比例',
                type: 'pie',
                label: {
                    show: true,
                    position: 'inside',
                    formatter: '占比{d}%'
                },

                data: option
            }
        ],



    };

}

</script>

<style scoped lang="scss">
.container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;

    .charts {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-around;

        .chart {
            display: flex;
            justify-content: center;
            width: 700px;
            height: 300px;
        }

        .pie-chart {
            display: flex;
            justify-content: center;
            width: 450px;
            height: 300px;
        }
    }


    .pagination {
        margin-top: 20px;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>