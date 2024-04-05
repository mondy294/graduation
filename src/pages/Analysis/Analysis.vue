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
            <!--图标区域 -->
            <div class="charts-container">
                <div v-for="(item, index) in chartList" :key="index" :style="{ opacity: activeName == index ? 1 : 0 }"
                    :id="item.id" class="myChart">
                </div>
            </div>


        </div>
    </div>

</template>

<script setup lang="ts">
import { getCurrentInstance, onMounted, reactive, ref } from 'vue';
import { dataList, chartList } from '@/assets/index.ts';

const activeName = ref(0)

// 通过 internalInstance.appContext.config.globalProperties 获取全局属性或方法

let internalInstance = getCurrentInstance();
let echarts = internalInstance.appContext.config.globalProperties.$echarts;

const chartData = reactive([])

onMounted(() => {
    // 生成容器数组
    chartList.forEach((item, idx) => {
        chartData.push(ref())
        draw(chartData[idx], item.id, item.option)
    });

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