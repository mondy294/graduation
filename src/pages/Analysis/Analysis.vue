<template>
    <div class="container">
        <div class="showData">
            <div class="dataPart" v-for="(item, index) in dataList.data" :key="index">
                <div class="header">
                    <span>{{ item.title }}</span>
                    <span class="date" :style="{ color: item.datacolor, backgroundColor: item.datacolor + '0D' }">{{
                        item.date }}</span>
                </div>
                <div class="screen">
                    <div class="screen-data">
                        <span v-if="item.title != '成交率'">
                            <AnimatedNumber class="number" :from="0" :to="item.data"></AnimatedNumber>
                        </span>
                        <span class="number" v-else>{{ item.data }}%</span>
                        <span v-html="item.logo" :style="{ color: item.color }" class="iconfont"></span>
                    </div>
                    <div class="screen-data">
                        <span>{{ item.subtitle }}</span>
                        <span>
                            <AnimatedNumber :from="0" :to="item.subdata"></AnimatedNumber>
                        </span>

                    </div>
                </div>
            </div>
        </div>
        <div class="charts">
            <!-- 标签头 -->
            <div class="tabs-container">
                <el-tabs v-model="activeName" class="demo-tabs" @tab-change="handleClick">
                    <el-tab-pane label="User" :name="index" v-for="(item, index) in chartList.data" :key="index">
                        <template #label>
                            <div class="chart-name">
                                {{ item.tag }}
                            </div>
                        </template>
                    </el-tab-pane>
                </el-tabs>
            </div>
            <!--折线图 -->
            <div class="charts-container">
                <div v-for="(item, index) in chartList.data" :key="index"
                    :style="{ visibility: activeName == index ? 'visible' : 'hidden' }" :id="item.id" class="myChart">
                </div>
            </div>
        </div>
        <!-- 饼状图 -->
        <div class="piechart-container">
            <div class="pie-chart" v-for="(item, index) in pieChartList.data" :key="index">
                <div class="title">{{ item.header }}</div>
                <div class="chart">
                    <div :id="item.id" class="mypie-chart"></div>
                </div>
            </div>

        </div>
    </div>

</template>

<script setup lang="ts">
import { getCurrentInstance, onMounted, reactive, ref, watch } from 'vue';
import { MyOrder, Trade } from '@/api/index'
import { color } from 'echarts';

const dataList = reactive({
    data: []
})
const chartList: any = reactive({ data: [] })

const pieChartList: any = reactive({ data: [] })


const activeName = ref(0)
const userInfo = reactive(JSON.parse(localStorage.getItem('user')))

const totalCount = ref(0)
const monthCount = ref(0)



// 通过 internalInstance.appContext.config.globalProperties 获取全局属性或方法

let internalInstance = getCurrentInstance();
let echarts = internalInstance.appContext.config.globalProperties.$echarts;

const chartData = reactive([])
const pieChartData = reactive([])

onMounted(async () => {
    // 判断用户是否为管理员
    if (userInfo.authority == 0) {
        await initData({})
    }
    else {
        await initData({})
    }

    // 生成容器数组
    chartList.data.forEach((item, idx) => {
        chartData.push(ref())
        draw(chartData[idx], item.id, item.option)
    });
    // 生成容器数组
    pieChartList.data.forEach((item, idx) => {
        pieChartData.push(ref())
        draw(pieChartData[idx], item.id, item.option)
    });


})


const handleClick = (tabName) => {
    // 排他算法
    chartData.forEach(element => {
        element.value.clear()
    });
    // 重绘
    draw(chartData[tabName], chartList.data[tabName].id, chartList.data[tabName].option)


}
//绘画函数
const draw = (chart, id, option) => {

    const dom = document.getElementById(id);
    chart.value = echarts.init(dom); // 初始化echarts实例

    // 设置实例参数
    chart.value.setOption(option);

}

const initData = async (obj) => {
    const res = await MyOrder(obj)


    if (res.data.status == 0) {
        let { data } = res.data
        const copy = data
        data = data.filter(item => item.sellid == userInfo.id)

        let timer = new Date()
        // 生成当前时间字符串
        let date = timer.toLocaleDateString()
        let month = date.split('/')[1]
        initCount(data, month)
        initTotalMoney(data, month)
        initTotalBuyMoney(copy, month)
        await initTurnover(data, month)
        initChart(data, month)
        initPieChart(copy)
    }
}
const initCount = (data: any, month: string) => {
    // 总交易数
    let total = 0
    // 月交易数
    let monthTotal = 0
    data.forEach(item => {
        total += item.count
        if (item.date.split(' ')[0].split('/')[1] == month) {
            monthTotal += item.count
        }
    });
    totalCount.value = total
    monthCount.value = monthTotal
    const countObj = {
        title: '交易数',
        date: '月',
        data: monthTotal,
        logo: '&#xe607;',
        datacolor: '#389e0d',
        subtitle: '总交易数',
        subdata: total,
        color: 'rgb(48, 150, 234)'
    }
    dataList.data.push(countObj)

}
const initTotalMoney = (data: any, month: string) => {

    // 总交易金额
    let total = 0
    // 月交易金额
    let monthTotal = 0
    data.forEach(item => {
        total += item.totalmoney
        if (item.date.split(' ')[0].split('/')[1] == month) {
            monthTotal += item.totalmoney
        }
    });
    totalCount.value = total
    monthCount.value = monthTotal
    const totalMoneyObj = {
        title: '交易额',
        date: '月',
        data: monthTotal.toFixed(2) + '￥',
        logo: '&#xe62d;',
        datacolor: '#389e0d',
        subtitle: '总交易额',
        subdata: total + '￥',
        color: 'rgb(250, 183, 39)'
    }
    dataList.data.push(totalMoneyObj)

}
const initTurnover = async (data: any, month: string) => {
    let res: any
    // 判断用户是否为管理员
    if (userInfo.authority == 0) {
        res = await Trade({ id: userInfo.id, page: 'products' })
    } else {
        res = await Trade({})
    }

    if (res.data.status == 0) {
        // 总交易数
        let total = 0
        // 月交易数
        let monthTotal = 0
        // 总发布数
        let totalPublish = 0
        // 月发布数
        let monthPublish = 0
        data.forEach(item => {
            total += item.count
            totalPublish += item.count
            if (item.date.split(' ')[0].split('/')[1] == month) {
                monthTotal += item.count
                monthPublish += item.count
            }
        });
        // 除数不为0
        if (monthPublish == 0) monthPublish = Infinity
        totalCount.value = total
        monthCount.value = monthTotal


        const countObj = {
            title: '成交率',
            date: '月',
            data: (100 * monthTotal / monthPublish).toFixed(2),
            logo: '&#xe638;',
            datacolor: '#389e0d',
            subtitle: '总成交率',
            subdata: total / totalPublish,
            color: 'rgb(250, 183, 39)'
        }
        dataList.data.push(countObj)
    }



}
const initTotalBuyMoney = (data: any, month: string) => {

    // 总交易金额
    let total = 0
    // 月交易金额
    let monthTotal = 0
    data.filter(item => item.buyid == userInfo.id)
    data.forEach(item => {
        total += item.totalmoney
        if (item.date.split(' ')[0].split('/')[1] == month) {
            monthTotal += item.totalmoney
        }
    });
    totalCount.value = total
    monthCount.value = monthTotal
    const totalMoneyObj = {
        title: '支出成本',
        date: '月',
        data: monthTotal.toFixed(2) + '￥',
        logo: '&#xe70c;',
        datacolor: '#389e0d',
        subtitle: '总交易额',
        subdata: total + '￥',
        color: 'rgb(56, 158, 13)'
    }
    dataList.data.push(totalMoneyObj)

}

// 计算数据函数
const calculateData = (data, month) => {
    const map = new Map()
    // 上一月的数据
    const lastMonthMap = new Map()
    data.forEach((item) => {
        let date = item.date.split(' ')[0]
        let nowMonth = date.split('/')[1]
        if (nowMonth == month) {
            if (!map.has(date)) {
                map.set(date, { price: [item.price], count: item.count, total: item.totalmoney })
            }
            else {
                let today = map.get(date)
                today.price.push(item.price)
                today.count += item.count
                today.total += item.totalmoney
            }
        } else {
            if (!lastMonthMap.has(date)) {
                lastMonthMap.set(date, { price: [item.price], count: item.count, total: item.totalmoney })
            }
            else {
                let today = lastMonthMap.get(date)
                today.price.push(item.price)
                today.count += item.count
                today.total += item.totalmoney
            }
        }
    })
    // const xAxis = Array.from(map.keys())
    const xAxis = []
    for (let i = 1; i < 31; i++) {
        xAxis.push(month + '/' + i)
    }

    // 数量折线图
    let yAxisCount = new Array(31).fill(0)
    // 交易额折线图
    let yAxisTotalMoney = new Array(31).fill(0)
    // 上个月交易量
    let yAxisLastCount = new Array(31).fill(0)
    // 上个月交易额
    let yAxisLatTotalMoney = new Array(31).fill(0)
    Array.from(map.keys()).forEach(item => {
        const idx = item.split('/')[2]
        yAxisCount[idx] = map.get(item).count
        yAxisTotalMoney[idx] = map.get(item).total
    })
    Array.from(lastMonthMap.keys()).forEach(item => {
        const idx = item.split('/')[2]
        yAxisLastCount[idx] = lastMonthMap.get(item).count
        yAxisLatTotalMoney[idx] = lastMonthMap.get(item).total
    })

    return {
        yAxisCount,
        yAxisTotalMoney,
        yAxisLastCount,
        yAxisLatTotalMoney,
        xAxis
    }
}

// 按人计算
const calculatePieData = (data) => {
    const map = new Map()
    data = data.filter(item => item.sellid = userInfo.id)
    data.forEach((item: any) => {
        let buyer = item.buyer
        if (!map.has(buyer)) map.set(buyer, { count: 0, total: 0 })
        if (map.has(buyer)) {
            let newTotal: string | number = parseFloat(map.get(buyer).total)
            let newCount = map.get(buyer).count
            newTotal += item.totalmoney
            newCount += item.count
            newTotal = newTotal.toFixed(2)
            map.set(buyer, { count: newCount, total: newTotal })
        }

    })
    return map
}
// 我的购买分布
const calculateBuyPieData = (data) => {
    data = data.filter(item => {
        return item.buyid == userInfo.id
    })

    const map = new Map()
    data.forEach((item: any) => {
        let seller = item.seller
        if (!map.has(seller)) map.set(seller, { count: 0, total: 0 })
        if (map.has(seller)) {
            let newTotal: string | number = parseFloat(map.get(seller).total)
            let newCount = map.get(seller).count
            newTotal += item.totalmoney
            newCount += item.count
            newTotal = newTotal.toFixed(2)
            map.set(seller, { count: newCount, total: newTotal })
        }

    })

    return map
}

const initChart = (data, month: string) => {
    const { yAxisCount,
        yAxisTotalMoney,
        yAxisLastCount,
        yAxisLatTotalMoney,
        xAxis } = calculateData(data, month)
    let countObj = {
        data: yAxisCount,
        type: 'line',
        smooth: true,
        areaStyle: {
            color: '#90D2FD',
            opacity: 0.5
        },
        itemStyle: {
            normal: {
                label: {
                    show: true, //开启显示
                    position: 'right', //在上方显示
                    textStyle: { //数值样式
                        color: 'black',
                        fontSize: 16
                    },
                    formatter: function (params) {
                        if (params.value == 0) return ''
                    }
                }
            }
        },

    }
    let totalMoneyObj = {
        data: yAxisTotalMoney,
        type: 'line',
        smooth: true,
        areaStyle: {
            color: '#90D2FD',
            opacity: 0.5
        },
        itemStyle: {
            normal: {
                label: {
                    show: true, //开启显示
                    position: 'right', //在上方显示
                    textStyle: { //数值样式
                        color: 'black',
                        fontSize: 16
                    },
                    formatter: function (params) {
                        if (params.value == 0) return ''
                    }
                }
            }
        },

    }
    let lastCountObj = {
        data: yAxisLastCount,
        type: 'line',
        smooth: true,
        areaStyle: {
            color: '#90D2FD',
            opacity: 0.5
        },
        itemStyle: {
            normal: {
                label: {
                    show: true, //开启显示
                    position: 'right', //在上方显示
                    textStyle: { //数值样式
                        color: 'gray',
                        fontSize: 16
                    },
                    formatter: function (params) {
                        if (params.value == 0) return ''
                    }
                }
            }
        },
    }
    let lastTotalMoneyObj = {
        data: yAxisLatTotalMoney,
        type: 'line',
        smooth: true,
        areaStyle: {
            color: '#90D2FD',
            opacity: 0.5
        },
        itemStyle: {
            normal: {
                label: {
                    show: true, //开启显示
                    position: 'right', //在上方显示
                    textStyle: { //数值样式
                        color: 'gray',
                        fontSize: 16
                    },
                    formatter: function (params) {
                        if (params.value == 0) return ''
                    }
                }
            }
        },

    }
    const chartCountObj: any = {
        id: 'mychart1',
        tag: '交易量',
        option: {
            xAxis: {
                type: 'category',
                data: xAxis
            },
            yAxis: {
                type: 'value',
            },
            grid: {
                // show: true,
                containLabel: true,
                left: '3%',
                top: '5%',
                bottom: '5%',
                right: '3%'
            },
            tooltip: {
                trigger: 'item',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                }

            },
            series: [

            ]
        }
    }
    chartCountObj.option.series.push(countObj, lastCountObj)
    const chartMoneyObj: any = {
        id: 'mychart2',
        tag: '交易额',
        option: {
            xAxis: {
                type: 'category',
                data: xAxis
            },
            yAxis: {
                type: 'value',
            },
            grid: {
                // show: true,
                containLabel: true,
                left: '3%',
                top: '5%',
                bottom: '5%',
                right: '3%'
            },
            tooltip: {
                trigger: 'item',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                },

            },
            series: [
            ]
        }
    }
    chartMoneyObj.option.series.push(totalMoneyObj, lastTotalMoneyObj)


    chartList.data = [chartCountObj, chartMoneyObj]






}

const initPieChart = (data) => {
    const map = calculatePieData([...data])
    const mapBuy = calculateBuyPieData([...data])
    console.log(mapBuy);


    const povit = 5
    // 4展示前五名
    const optionCount = Array.from(map.keys()).slice(0, povit).map((name) => {
        return {
            value: map.get(name).count,
            name: name
        }
    })
    const optionTotalMoney = Array.from(map.keys()).slice(0, povit).map((name) => {
        return {
            value: map.get(name).total,
            name: name
        }
    })
    const optionBuyCount = Array.from(mapBuy.keys()).slice(0, povit).map((name) => {
        return {
            value: mapBuy.get(name).count,
            name: name
        }
    })
    let remainCount = { value: 0, name: '其他' }
    Array.from(map.keys()).slice(povit).forEach((name) => {
        remainCount.value += map.get(name).count
    })
    let remainTotalMoney = { value: 0, name: '其他' }
    Array.from(map.keys()).slice(povit).forEach((name) => {
        remainTotalMoney += map.get(name).total
    })
    let remainBuyCount = { value: 0, name: '其他' }
    Array.from(mapBuy.keys()).slice(povit).forEach((name) => {
        remainCount.value += map.get(name).count
    })
    if (remainCount.value) optionCount.push(remainCount)
    if (remainTotalMoney.value) optionTotalMoney.push(remainTotalMoney)
    if (remainBuyCount.value) optionBuyCount.push(remainTotalMoney)


    const countObj = {
        header: '数量分布',
        id: 'piechart1',
        option: {
            tooltip: {
                formatter: "{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'horizontal',
                x: 'center',
                y: '335',
                data: Array.from(map.keys())
            },
            series: [
                {
                    type: 'pie',
                    data: optionCount,
                    radius: '45%',
                    label: {
                        show: true,
                        position: 'outside',
                        formatter: '{b} {c}吨'
                    },
                    itemStyle: {
                        normal: {
                            color: function (colors) {
                                var colorList = [
                                    '#fc8251',
                                    '#5470c6',
                                    '#91cd77',
                                    '#ef6567',
                                    '#f9c956',
                                    '#75bedc'
                                ];
                                return colorList[colors.dataIndex];
                            }
                        },
                    }

                },
                {
                    name: '购买比例',
                    type: 'pie',
                    data: optionCount,
                    label: {
                        show: true,
                        position: 'inside',
                        formatter: '{d}%'
                    },
                    itemStyle: {
                        normal: {
                            color: function (colors) {
                                var colorList = [
                                    '#fc8251',
                                    '#5470c6',
                                    '#91cd77',
                                    '#ef6567',
                                    '#f9c956',
                                    '#75bedc'
                                ];
                                return colorList[colors.dataIndex];
                            }
                        },
                    }

                },

            ]
        }
    }
    const totalMoneyObj = {
        header: '金额分布',
        id: 'piechart2',
        option: {
            tooltip: {
                formatter: "{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'horizontal',
                x: 'center',
                y: '335',
                data: Array.from(map.keys())
            },
            series: [
                {
                    type: 'pie',
                    data: optionTotalMoney,
                    radius: '40%',
                    label: {
                        show: true,
                        position: 'outside',
                        formatter: '{b} {c}吨'
                    },
                },
                {
                    name: '购买比例',
                    type: 'pie',
                    data: optionTotalMoney,
                    label: {
                        show: true,
                        position: 'inside',
                        formatter: '{d}%'
                    },

                }
            ]
        }
    }
    const countBuyObj = {
        header: '购买分布',
        id: 'piechart3',
        option: {
            tooltip: {
                formatter: "{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'horizontal',
                x: 'center',
                y: '335',
                data: Array.from(mapBuy.keys())
            },
            series: [
                {
                    type: 'pie',
                    data: optionBuyCount,
                    radius: '40%',
                    label: {
                        show: true,
                        position: 'outside',
                        formatter: '{b} {c}吨'
                    },
                },
                {
                    name: '购买比例',
                    type: 'pie',
                    radius: '75%',
                    data: optionBuyCount,
                    label: {
                        show: true,
                        position: 'inside',
                        formatter: '{d}%'
                    },

                }
            ]
        }
    }
    pieChartList.data = [countObj, totalMoneyObj, countBuyObj]

}



</script>

<style scoped lang="scss">
.container {
    text-align: center;
    padding-bottom: 50px;
    width: 100%;
    height: 100%;
    background-color: #F5F5F5;
    overflow: auto;

    .showData {
        position: relative;
        display: flex;
        justify-content: space-between;
        margin: 0 auto;
        align-items: center;
        margin-top: 20px;
        border-radius: 10px;
        width: 95%;
        height: 170px;

        .dataPart {
            position: relative;
            display: flex;
            flex-direction: column;
            border-radius: 10px;
            width: 24%;
            height: 100%;
            background-color: #fff;
            overflow: hidden;


            .header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 14px;
                padding: 0 15px;
                width: 100%;
                height: 50px;
                border-bottom: 1px solid #eee;
                font-weight: bold;

                .date {
                    font-weight: normal;
                    text-align: center;
                    line-height: 22px;
                    width: 28px;
                    height: 22px;
                    font-size: 12px;
                    border-radius: 4px;
                    border: 1px solid;

                }

            }

            .screen {
                position: absolute;
                top: 50px;
                display: flex;
                flex-direction: column;
                padding: 12px;
                width: 100%;
                height: 120px;

                .screen-data {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16px;
                    height: 50%;

                    span {
                        display: flex;
                        align-items: center;
                    }

                    .number {
                        font-size: 28px;
                        font-weight: 500;
                    }

                    .iconfont {
                        font-size: 36px;
                    }

                }
            }
        }
    }

    .charts {
        margin: 0 auto;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        width: 95%;
        height: 400px;
        border-radius: 10px;
        background-color: #fff;
        margin-top: 20px;


        .tabs-container {
            width: 100%;
            height: 60px;

            .chart-name {
                font-size: 16px;
            }

            .demo-tabs {
                width: 100%;
                height: 60px;
                padding: 0 20px;
                font-size: 26px;
            }
        }

        .charts-container {
            position: relative;
            width: 100%;
            height: 100%;

            .myChart {
                position: absolute;
                width: 100%;
                height: 100%;
                // background-color: red;
            }

        }





    }

    .piechart-container {
        margin: 0 auto;
        margin-top: 20px;
        border-radius: 10px;
        height: 420px;
        width: 95%;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .pie-chart {
            width: 31%;
            height: 100%;
            display: flex;
            flex-direction: column;
            border-radius: 10px;
            background-color: #fff;

            .title {
                width: 100%;
                height: 56px;
                display: flex;
                font-size: 16px;
                font-weight: bold;
                padding: 0 24px;
                align-items: center;
                border-bottom: 1px solid #eee
            }

            .chart {
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;

                .mypie-chart {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    height: 100%;

                }
            }
        }
    }

}
</style>