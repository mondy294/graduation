<template>
    <div class="collapse">
        <div class="collapse-list">
            <div class="collapse-item" v-for="(item, index) in layOutList" :key="index">
                <div class="collapse-header" :class="{ arrowDown: arr.includes(index) }"
                    @click="currentCollapse(index)">
                    <i class="iconfont icon" v-html="item.logo"></i>
                    <div class="collapse-title"> {{ item.text }}</div>
                    <span class="iconfont arrow">&#xe65f;</span>
                </div>

                <transition :name="test(item.children)">
                    <div class="content" v-if="arr.includes(index)">
                        <slot name="content" v-for="(child, idx) in item.children" :key="idx">
                            <div @click="cuttentOne(index, idx, child, item)"
                                :class="{ currentContent: index == now[0] && idx == now[1] }">
                                {{ child.text }}
                            </div>
                        </slot>
                    </div>
                </transition>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { LayOutItem } from '@/utils/layout'


const props = defineProps(['layOutList'])
const { layOutList } = props


const route = useRoute()
const router = useRouter()
// 现在打开的面板route
const arr = reactive([route.meta.id[0]])
const now = reactive([...route.meta.id as any])

const currentCollapse = (index: number) => {
    let povit = arr.indexOf(index)
    povit >= 0 ? arr.splice(povit, 1) : arr.push(index)

}

const cuttentOne = (i: number, j: number, child: LayOutItem, father: LayOutItem) => {
    // 切换高亮目标
    now[0] = i
    now[1] = j
    const path = '/home' + father.path + child.path
    router.push(path)
}


const test = (children) => {
    return `collapse${children.length}`
}


</script>

<style lang="scss" scoped>
.collapse {
    width: 210px;
    height: 100%;
    overflow: auto;

    .collapse-list {
        width: 210px;
        height: 100%;
        // background-color: #001529;

        .collapse-item {
            cursor: pointer;
            transition: all 0.5s;

            .collapse-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 14px;

                i {
                    margin-left: 15px;
                }

                .arrow {
                    color: #fff;
                    font-size: 10px;
                    margin-right: 15px;
                    transition: all 0.5s;
                }


            }

            .arrowDown {
                span {
                    transform: rotate(90deg);
                    color: #fff
                }

                .collapse-title {
                    color: #fff;
                }
            }



            .icon {
                color: #fff;
                width: 20px;
                height: 20px;
                text-align: center;
                line-height: 20px;
                font-size: 20px;
            }

            .collapse-title {
                width: 100%;
                height: 45px;
                display: flex;
                align-items: center;
                padding: 0 10px;
                width: 100%;
                color: #ffffffb3;
                background-color: #001529;
                transition: all 0.5s;

                &:hover {
                    color: #fff;
                }
            }



        }



    }

}

.content {
    width: 100%;
    background-color: #0C2135;
    height: 100%;
    color: #ffffffb3;
    font-size: 14px;

    div {
        padding: 0 45px;
        display: flex;
        align-items: center;
        height: 45px;

        &:hover {
            color: #fff;
        }
    }
}

.currentContent {
    transition: all 0.2s;
    background-color: #0960BD;
    color: #fff;
}



.collapse3-enter-active {
    transition: all 0.05s ease;
}

.collapse3-leave-active {
    transition: all 0.1s ease;
}

.collapse3-enter-from,
.collapse3-leave-to {
    height: 0px;
}

.collapse3-enter-to,
.collapse3-leave-from {
    height: 135px;
}

// 2
.collapse2-enter-active {
    transition: all 0.2s ease;
}

.collapse2-leave-active {
    transition: all 0.05s ease;
}

.collapse2-enter-from,
.collapse2-leave-to {
    height: 0px;
}

.collapse2-enter-to,
.collapse2-leave-from {
    height: 90px;
}

// 1
.collapse1-enter-active {
    transition: all 0.5s ease;
}

.collapse1-leave-active {
    transition: all 0.2s ease;
}

.collapse1-enter-from,
.collapse1-leave-to {
    height: 0px;
}

.collapse1-enter-to,
.collapse1-leave-from {
    height: 45px;
}
</style>