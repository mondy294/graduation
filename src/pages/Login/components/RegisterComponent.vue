<template>
    <div class="register_model">
        <div class="register">
            <h2>注册</h2>
        </div>
        <div class="inputGroup" v-for="(item, idx) in inputGroup" :key="idx">
            <div class="tag">{{ item.text }}</div>
            <el-input v-model=item.flag :type="item.type ? 'password' : ''" class="account"
                :placeholder="item.placeholder" clearable @blur="inputBlur(item)" @input="inputing(item)" />
            <div v-show="item.eventFlag" class="warning">{{ item.warning }}</div>
        </div>

        <div class="remember">
            <a @click="toLogin">已有账号？返回登录</a>
        </div>

        <div class="register_btn">
            <el-button type="primary" class="btn" :loading="loading" @click="register">注册</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Register } from '../../../api/index'
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';

import { inputGroup, inputItem } from '../../../utils/login'



let account = ref('')
let password = ref('')
let password_2 = ref('')
let nickname = ref('')

let accountBlur = ref(false)
let passwordBlur = ref(false)
let nicknameBlur = ref(false)
let password_2Blur = ref(false)

let loading = ref(false)
const model = defineModel()

const inputGroup = reactive([
    {
        text: '昵称',
        flag: nickname,
        eventFlag: nicknameBlur,
        placeholder: 'Please input nickname',
        warning: '请输入昵称',
        type: false
    },
    {
        text: '用户名',
        flag: account,
        eventFlag: accountBlur,
        placeholder: 'Please input username',
        warning: '请输入账号',
        type: false
    },
    {
        text: '密码',
        flag: password,
        eventFlag: passwordBlur,
        placeholder: 'Please input password',
        warning: '请输入密码',
        type: true
    },
    {
        text: '确认密码',
        flag: password_2,
        eventFlag: password_2Blur,
        placeholder: 'Please input password again',
        warning: '请确认密码',
        type: true
    },
])

const toLogin = () => {
    model.value = !model.value
}

const inputBlur = (item: inputItem) => {
    item.eventFlag = !item.flag ? true : false
    if (item.text == '确认密码' && item.flag !== password.value) {
        item.eventFlag = true
    }
}
const inputing = (item: inputItem) => {
    item.eventFlag = false
}


async function register(): Promise<void> {
    if (!account.value || !password.value || !nickname.value || !password_2.value) {
        ElMessage.error('请填写所有字段！')
        return
    }
    const userInfo = {
        account,
        password,
        nickname
    }
    loading.value = true
    let res = await Register(userInfo)
    if (res.data.status == 1) {
        loading.value = false
    }
    else {

        loading.value = false
        account.value = ''
        password.value = ''
        nickname.value = ''
        toLogin()
        setTimeout(() => {
            ElMessage.success("注册成功！请登录")
        }, 1000);

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

.register_model {
    position: absolute;
    text-align: center;
    box-sizing: border-box;
    padding: 20px;
    width: 500px;

    .register {
        margin-bottom: 22px;
    }

    .inputGroup {
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
</style>../../../utils