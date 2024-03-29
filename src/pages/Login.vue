<template>
    <div class="container">
        <div class="box"></div>
        <div class="login">
            <el-button type="primary">Primary</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.container {
    width: 100%;
    height: 100%;

    .box {
        width: 100%;
        height: 100%;
        background: no-repeat url('../assets/background.jpg');
        background-size: 100% 100%;
        filter: blur(5px);
    }

    .login {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 40%;
        height: 40%;
        background-color: #fff;
        border-radius: 10px;
    }

}
</style>