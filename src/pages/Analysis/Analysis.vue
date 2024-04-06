<template>
    <div class="container">
        <div class="showData">
            <div class="dataPart" v-for="(item, index) in dataList" :key="index">
                <div class="header">
                    <span>{{ item.title }}</span>
                    <span class="date" :style="{ color: item.datacolor, backgroundColor: item.datacolor + '0D' }">{{
                item.date }}</span>
                </div>
                <div class="screen">
                    <div class="screen-data">
                        <span>
                            <AnimatedNumber :from="0" :to="item.data"></AnimatedNumber>
                        </span>
                        <span>{{ item.data }}</span>
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
                    <el-tab-pane label="User" :name="index" v-for="(item, index) in chartList" :key="index">
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
                <div v-for="(item, index) in chartList" :key="index" :style="{ opacity: activeName == index ? 1 : 0 }"
                    :id="item.id" class="myChart">
                </div>
            </div>
        </div>
        <!-- 饼状图 -->
        <div class="piechart-container">
            <div class="pie-chart" v-for="(item, index) in pieChartList" :key="index">
                <div class="title">{{ item.header }}</div>
                <div class="chart">
                    <div :id="item.id" class="mypie-chart"></div>
                </div>
            </div>

        </div>
    </div>

</template>

<script setup lang="ts">
import { getCurrentInstance, onMounted, reactive, ref } from 'vue';
import { dataList, chartList, pieChartList } from '@/assets/index.ts';

const activeName = ref(0)

// 通过 internalInstance.appContext.config.globalProperties 获取全局属性或方法

let internalInstance = getCurrentInstance();
let echarts = internalInstance.appContext.config.globalProperties.$echarts;

const chartData = reactive([])
const pieChartData = reactive([])

onMounted(() => {
    // 生成容器数组
    chartList.forEach((item, idx) => {
        chartData.push(ref())
        draw(chartData[idx], item.id, item.option)
    });
    // 生成容器数组
    pieChartList.forEach((item, idx) => {
        pieChartData.push(ref())
        draw(pieChartData[idx], item.id, item.option)
    });
    console.log(pieChartData);


})

const handleClick = (tabName) => {
    // 排他算法
    chartData.forEach(element => {
        element.value.clear()
    });
    // 重绘
    draw(chartData[tabName], chartList[tabName].id, chartList[tabName].option)


}
//绘画函数
const draw = (chart, id, option) => {

    const dom = document.getElementById(id);
    chart.value = echarts.init(dom); // 初始化echarts实例

    // 设置实例参数
    chart.value.setOption(option);

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