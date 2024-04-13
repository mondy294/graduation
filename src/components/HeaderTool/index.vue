<template>
    <div class="header">
        <div class="path-name">
            <span>{{ route.name }} / {{ route.meta.pageName }}</span>
        </div>
        <div class="toolList">
            <div @click="toIcon(item.path)" class="toolItem" v-for="(item, index) in toolList" :key="index">
                <el-tooltip class="box-item" effect="dark" :content="item.tips" placement="bottom">
                    <div v-if="item.icon" class="toolIcon iconfont" v-html="item.icon"></div>
                    <img v-else class="toolIcon" :src="item.image"></img>
                </el-tooltip>
                <span class="red" v-if="item.tips == '聊天' && props.flag"></span>
            </div>


        </div>
    </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { toolList } from '@/assets/index'
import { ref, defineProps } from 'vue'

const route = useRoute()
const router = useRouter()

const props = defineProps(['flag'])

const toIcon = (path) => {
    console.log(path);

    router.push(path)
}




</script>

<style scoped lang="scss">
.header {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 48px;
    padding: 0 20px;
    border-bottom: 1px solid #eee;

    .path-name {
        color: gray;
        font-size: 14px;
    }


    .toolList {
        cursor: pointer;
        display: flex;
        align-items: center;
        height: 100%;
        padding: 0 20px;

        .toolItem {
            position: relative;
            display: flex;
            align-items: center;
            height: 100%;
            padding: 0 10px;
            transition: all 0.3s;

            .toolIcon {

                font-size: 16px
            }

            &:hover {
                background-color: #F1F1F1;
            }

            .red {
                position: absolute;
                right: 5px;
                top: 10px;
                width: 8px;
                height: 8px;
                border-radius: 4px;
                background-color: red;
            }
        }
    }

}
</style>