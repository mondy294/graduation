<template>
    <div class="login_model">
        <div class="login">
            <h2>登录</h2>
        </div>
        <div class="inputGroup" v-for="(item, idx) in inputGroup" :key="idx">
            <div class="tag">{{ item.text }}</div>
            <el-input v-model=item.flag :type="item.type ? 'password' : ''" class="account"
                :placeholder="item.placeholder" clearable @blur="inputBlur(item)" @input="inputing(item)" />
            <div v-show="item.eventFlag" class="warning">{{ item.warning }}
            </div>
        </div>

        <div class="remember">
            <el-checkbox v-model="remember" label="记住我" size="large" />
            <a>忘记密码</a>
        </div>

        <div class="login_btn">
            <el-button type="primary" class="btn" @click="login" :loading="loading">登录</el-button>
        </div>
        <div class="register_btn">
            <el-button class="btn" @click="toRegister">注册</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { Login } from '../../../api/index'
import { useRouter } from 'vue-router'
import { inputGroup, inputItem } from '../../../utils/login'



const router = useRouter()

let account = ref('')
let password = ref('')
let accountBlur = ref(false)
let passwordBlur = ref(false)
let remember = ref(false)
let loading = ref(false)

const model = defineModel()

const inputGroup = reactive([
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
])
const blank = () => {
    ElMessage.error('账号或密码未填写')
}
const inputing = (item: inputItem) => {
    item.eventFlag = false
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

const toRegister = () => {
    model.value = !model.value
}
const inputBlur = (item: inputItem) => {
    item.eventFlag = !item.flag ? true : false
    if (item.text == '确认密码' && item.flag !== password.value) {
        item.eventFlag = true
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
    position: absolute;
    text-align: center;
    box-sizing: border-box;
    padding: 20px;
    width: 500px;

    .login {
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