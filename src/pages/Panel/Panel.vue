<template>
    <div class="container">
        <div class="charts">
            <div class="main" id="chart"></div>
        </div>
        <el-table v-loading="loading" element-loading-text="Loading..."
            :data="OrderData.data.slice(10 * (currentPage - 1), 10 * currentPage)" style="width: 100%" height="800"
            :default-sort="{ prop: 'date', order: 'descending' }" empty-text="您暂未发布任何商品~">
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
            <el-table-column prop="open" label="开盘" sortable>
            </el-table-column>
            <el-table-column prop="over" label="收盘" sortable>
            </el-table-column>
            <el-table-column prop="updown" label="涨跌" sortable>
                <template #default="scope">
                    <div :style="{ color: scope.row.updown >= 1 ? 'green' : 'red' }">{{ scope.row.updown }}%</div>
                </template>
            </el-table-column>
            <el-table-column prop="high" label="最高" sortable>
            </el-table-column>
            <el-table-column prop="low" label="最低" sortable>
            </el-table-column>
            <el-table-column prop="count" label="成交量" sortable>
            </el-table-column>
            <el-table-column prop="total" label="成交额" sortable>
            </el-table-column>
            <el-table-column label="振幅" sortable>
                <template #default="scope">
                    <div>{{ scope.row.amplitude }}%</div>
                </template>
            </el-table-column>

        </el-table>
        <div class="pagination">
            <el-pagination :page-size="2" layout="prev, pager, next" :total="OrderData.data.length"
                v-model:current-page="currentPage" hide-on-single-page />
        </div>
    </div>
</template>

<script setup lang="ts">
import { MyOrder } from '@/api/index'
import { Timer } from '@element-plus/icons-vue'
import { getRepertory } from '@/api/utils'
import { MessageBox } from '@/utils/index'


import { onMounted, reactive, ref, computed, onBeforeMount, getCurrentInstance } from 'vue';
import { ElMessage } from 'element-plus';
import { log } from 'echarts/types/src/util/log.js';

const OrderData = reactive({ data: [] })
const currentPage = ref(1)
const loading = ref(true)
// 通过 internalInstance.appContext.config.globalProperties 获取全局属性或方法
let internalInstance = getCurrentInstance();
let echarts = internalInstance.appContext.config.globalProperties.$echarts;

onMounted(async () => {
    OrderData.data = await initChart()
})

const initChart = async () => {
    const map = new Map()
    const res = await MyOrder()
    if (res.data.status == 0) {
        setTimeout(() => {
            loading.value = false
        }, 500);
        const { data } = res.data
        data.forEach((item) => {
            let date = item.date.split(' ')[0]
            if (!map.has(date)) {
                map.set(date, { price: [item.price], count: item.count, total: item.totalmoney })
            }
            else {
                let today = map.get(date)
                today.price.push(item.price)
                today.count += item.count
                today.total += item.totalmoney
            }
        })


        const final = Array.from(map.keys())
        const chartData = []
        const market = final.map((item, idx) => {
            const info = map.get(item)
            // 开盘收盘
            const open = info.price[0]
            const over = info.price[info.price.length - 1]
            chartData.push(over)
            let updown
            // 涨跌
            if (idx >= 1) {
                // 前一天收盘价
                const befor = map.get(final[idx - 1]).price[map.get(final[idx - 1]).price.length - 1]
                updown = (over - befor) / befor
            }
            else {
                updown = 0.01
            }
            updown = (updown * 100).toFixed(2)

            let arr = info.price.sort((a, b) => a - b)
            return {
                date: item,
                open,
                over,
                updown,
                low: arr[0],
                high: arr[arr.length - 1],
                count: info.count,
                total: info.total,
                amplitude: (arr[arr.length - 1] / arr[0]).toFixed(2)
            }
        })

        // 计算最终瀑布图的数据
        const finalData = chartData.map((item, idx) => {
            if (idx == 0) return item
            else return item - chartData[idx - 1]
        })

        market.reverse()
        inintData(finalData)
        return market
    }
}


// 初始化图表数据
const inintData = (data) => {
    const help = [];
    const positive = [];
    const negative = [];


    for (var i = 0, sum = 0; i < data.length; ++i) {
        if (data[i] >= 0) {
            positive.push(data[i]);
            negative.push('-');
        } else {
            positive.push('-');
            negative.push(-data[i]);
        }

        if (i === 0) {
            help.push(0);
        } else {
            sum += data[i - 1];
            if (data[i] < 0) {
                help.push(sum + data[i]);
            } else {
                help.push(sum);
            }
        }
    }
    var myChart = echarts.init(document.getElementById('chart'));
    const option = {
        grid: {
            containLabel: true,
            left: '3%',
            top: '5%',
            bottom: '5%',
            right: '3%'
        },
        xAxis: {
            type: 'category',
            splitLine: { show: false },
            data: (function () {
                var list = [];
                for (var i = 1; i <= data.length; i++) {
                    list.push('Oct/' + i);
                }
                return list;
            })()
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                type: 'bar',
                stack: 'all',
                itemStyle: {
                    normal: {
                        barBorderColor: 'rgba(0,0,0,0)',
                        color: 'rgba(0,0,0,0)'
                    },
                    emphasis: {
                        barBorderColor: 'rgba(0,0,0,0)',
                        color: 'rgba(0,0,0,0)'
                    }
                },
                data: help
            },

            {
                name: 'positive',
                type: 'bar',
                stack: 'all',
                data: positive,
                itemStyle: {
                    color: 'red'
                }
            },
            {
                name: 'negative',
                type: 'bar',
                stack: 'all',
                data: negative,
                itemStyle: {
                    color: 'green'
                }
            }
        ]
    };
    myChart.setOption(option)
}

</script>

<style scoped lang="scss">
.container {
    width: 100%;
    height: 100%;
    padding-top: 20px;

    .charts {
        margin: 0 auto;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        width: 95%;
        height: 400px;
        border-radius: 10px;
        background-color: #fff;
        // margin-top: 20px;

        .main {
            width: 100%;
            height: 100%;
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