<template>
    <div class="container">
        <div class="left">
            <div class="left_content">
                <img src="../../assets/login_logo.svg">
                <div class="welcome">欢迎使用本系统</div>
                <div class="system_name">供应链企业碳配额协同管理系统</div>
            </div>
        </div>
        <div class="right">
            <transition name="animate__animated animate__bounce" enter-active-class="animate__flipInX"
                leave-active-class="animate__flipOutX">
                <LoginComponent v-show="!status" key="1" v-model="status"></LoginComponent>
            </transition>
            <transition name="animate__animated animate__bounce" enter-active-class="animate__flipInX"
                leave-active-class="animate__flipOutX ">
                <RegisterComponent v-show="status" key="2" v-model="status"></RegisterComponent>
            </transition>
        </div>
    </div>
</template>

<script setup lang="ts">
import LoginComponent from './components/LoginComponent.vue'
import RegisterComponent from './components/RegisterComponent.vue'
import { ref } from 'vue'

// 处于登录还是注册状态
let status = ref(false)





</script>

<style scoped lang="scss">
.animate__animated {
    --animate-duration: 800ms !important;
}

.container {
    display: flex;
    position: relative;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    box-sizing: border-box;

    .left {

        display: flex;
        justify-content: center;
        align-items: center;
        width: 50%;
        height: 100%;
        background-color: #353E54;

        .left_content {
            color: white;

            img {
                width: 350px;
            }

            .welcome {
                font-size: 1.875rem;
                line-height: 2.25rem;

            }

            .system_name {
                font-size: 14px;
                margin-top: 1.25rem;
            }
        }
    }

    .right {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 50%;
        height: 100%;
        background-color: #fff;
        padding: 30px;
        box-sizing: border-box;


    }

}
</style>