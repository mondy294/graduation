<template>
    <div class="login_model">
        <div class="login">
            <h2>登录</h2>
        </div>
        <div class="username">
            <div class="tag">用户名</div>
            <el-input v-model="account" class="account" placeholder="Please input account" clearable @blur="aBlur" />
            <div v-show="!account && accountBlur" class="warning">该项为必填项</div>
        </div>
        <div class="password">
            <div class="tag">密码</div>
            <el-input v-model="password" class="account" placeholder="Please input password" clearable @blur="pBlur" />
            <div v-show="!password && passwordBlur" class="warning">
                该项为必填项</div>
        </div>

        <div class="remember">
            <el-checkbox v-model="remember" label="记住我" size="large" />
            <a>忘记密码</a>
        </div>

        <div class="login_btn">
            <el-button type="primary" class="btn" @click="login" :loading="loading">登录</el-button>
        </div>
        <div class="register_btn">
            <el-button class="btn">注册</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Login } from '../api/index'
import { useRouter } from 'vue-router'


const router = useRouter()

let account = ref('')
let password = ref('')
let accountBlur = ref(false)
let passwordBlur = ref(false)
let remember = ref(false)
let loading = ref(false)

function aBlur(): void {
    accountBlur.value = true
}
function pBlur(): void {
    passwordBlur.value = true
}
const blank = () => {
    ElMessage.error('账号或密码未填写')
}

async function login() {
    if (!account.value || !password.value) {
        blank()
        return
    }
    const userInfo = {
        account,
        password
    }

    loading.value = true
    let res = await Login(userInfo)
    if (res.data.status == 0) {
        loading.value = false
        account.value = ''
        password.value = ''
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('user', JSON.stringify(res.data.user))
        router.push({ name: 'home' })
    } else {
        loading.value = false
    }
}

</script>

<style scoped lang="scss">
.warning {
    position: absolute;
    height: 0px;
    text-align: left;
    padding-top: 4px;
    font-size: 12px;
    color: #f56c6c;
    transition: all 0.5s;
}

.login_model {
    text-align: center;
    box-sizing: border-box;
    padding: 20px;
    width: 500px;

    .login {
        margin-bottom: 22px;
    }

    .username {
        padding: 0 10px;
        margin-bottom: 25px;

        .tag {
            text-align: left;
            font-size: 14px;
            margin-bottom: 12px;
            color: #606266;
        }

        .account {
            width: 100%;
            height: 40px;
        }
    }

    .password {
        padding: 0 10px;

        .tag {
            text-align: left;
            font-size: 14px;
            margin-bottom: 12px;
            color: #606266;
        }

        .account {
            width: 100%;
            height: 40px;
        }
    }

    .remember {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 10px;
        margin-top: 20px;

        a {
            font-size: 14px;
            line-height: 14px;
        }
    }

    .login_btn {
        width: 100%;
        padding: 0 10px;
        margin-top: 20px;

        .btn {
            width: 100%;
            height: 40px;
        }
    }

    .register_btn {
        width: 100%;
        padding: 0 10px;
        margin-top: 20px;

        .btn {
            width: 100%;
            height: 40px;
        }
    }
}
</style>