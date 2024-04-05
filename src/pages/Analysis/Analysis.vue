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
                    <div>
                        <span>{{ item.data }}</span>
                        <span>{{ item.logo }}</span>
                    </div>
                    <div>
                        <span>{{ item.subtitle }}</span>
                        <span>{{ item.subdata }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="charts">
            <div class="tabs-container">
                <el-tabs v-model="activeName" class="demo-tabs" @tab-change="handleClick">
                    <el-tab-pane label="User" name="1">
                        <template #label>
                            <div class="chart-name">
                                1111
                            </div>
                        </template>
                    </el-tab-pane>
                    <el-tab-pane label="Config" name="2"></el-tab-pane>
                </el-tabs>
            </div>
            <div class="charts-container">
                <div :style="{ opacity: activeName == 'first' ? 1 : 0 }" ref="myChart1" id="myChart1" class="myChart">
                </div>
                <div :style="{ opacity: activeName == 'first' ? 0 : 1 }" ref="myChart2" id="myChart2" class="myChart">
                </div>
            </div>


        </div>
    </div>

</template>

<script setup lang="ts">
import { getCurrentInstance, onMounted, ref } from 'vue';
import { dataList, chartList } from '@/assets/index.ts';



const activeName = ref('first')



// 通过 internalInstance.appContext.config.globalProperties 获取全局属性或方法

let internalInstance = getCurrentInstance();
let echarts = internalInstance.appContext.config.globalProperties.$echarts;

let Chart1: any = ref()

let Chart2: any = ref()

onMounted(() => {
    draw(Chart1, 'myChart1')
    draw(Chart2, 'myChart2')
})

const handleClick = () => {

    Chart1.value.clear()
    Chart2.value.clear()

    draw(Chart1, 'myChart1')
    draw(Chart2, 'myChart2')


}
const draw = (chart, id) => {

    const dom = document.getElementById(id);
    chart.value = echarts.init(dom); // 初始化echarts实例

    const option = {
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
            type: 'value',

        },
        grid: {
            show: true,
            containLabel: true,
            left: '5%',
            top: '5%',
            bottom: '5%',
            right: '3%'
        },
        series: [
            {
                data: [820, 932, 901, 934, 1290, 1330, 1320],
                type: 'line',
                smooth: true,
                areaStyle: {
                    color: '#90D2FD',
                    opacity: 0.5
                }
            }
        ]
    };
    // 设置实例参数
    chart.value.setOption(option);
    // chat.clear()

}


</script>

<style scoped lang="scss">
.container {
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background-color: #F5F5F5;

    .showData {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 20px;
        border-radius: 10px;
        width: 95%;
        height: 170px;

        .dataPart {
            display: flex;
            flex-direction: column;
            border-radius: 10px;
            width: 340px;
            height: 100%;
            overflow: hidden;
            background-color: #fff;


            .header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 12px;
                padding: 0 15px;
                width: 100%;
                height: 50px;
                border-bottom: 1px solid #eee;

                .date {
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
                width: 100%;
                height: 100%;
                padding: 12px;

                div {
                    display: flex;
                    justify-content: space-between;
                    padding: 16px;
                    height: 50%;
                    width: 100%;

                    span {
                        display: flex;
                        align-items: center;
                    }
                }
            }
        }
    }

    .charts {
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



}
</style>