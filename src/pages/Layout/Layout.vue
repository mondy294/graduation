<template>
    <div class="box">
        <!-- <Analysis></Analysis> -->
        <!-- <Collapse :layOutList="layOutList"></Collapse> -->
        <div class="demo-collapse">
            <div class="title_box">
                <img src="../../assets//logo-C4i4nT_7.png" alt="">
                <div class="title">供应链碳配额协同系统</div>
            </div>
            <Collapse :layOutList="layOutList"></Collapse>

        </div>
        <div class="main_container">
            <HeaderTool></HeaderTool>
            <div class="main">
                <router-view></router-view>
            </div>
        </div>
    </div>

</template>

<script setup lang="ts">

import Collapse from '@/components/Collapse/index.vue'
import HeaderTool from '@/components/HeaderTool/index.vue'
import { layOutList } from '@/assets/index'




</script>

<style scoped lang="scss">
.box {
    width: 100%;
    height: 100%;

    // background-color: #001529;

    .demo-collapse {
        float: left;
        width: 210px;
        height: 100%;

        background-color: #001529;

        .el-collapse {
            button {
                background-color: purple !important;
            }
        }

        .title_box {
            padding: 0 10px;
            display: flex;
            align-items: center;
            width: 210px;
            height: 48px;
            background-color: #001529;
            color: #fff;
            font-size: 14px;

            img {
                width: 32px;
                height: 32px;
            }

            .title {
                margin-left: 8px;
                font-size: 14px;
            }

        }

        .children-item {
            width: 100%;
            height: 45px;
            line-height: 45px;

        }
    }

    .main_container {
        height: 100%;
        overflow: hidden;

        .main {
            overflow: auto;
            width: 100%;
            height: 100%;
        }
    }

}
</style>