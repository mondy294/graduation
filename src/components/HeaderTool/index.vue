<template>
    <div class="header">
        <div class="path-name">
            <span>{{ route.name }} / {{ route.meta.pageName }}</span>
        </div>
        <div class="right">
            <div class="company">{{ userInfo.nickname }}</div>
            <div v-if="!userInfo.authority" class="repertory">当前余额：{{ repertory }}</div>
            <div v-if="!userInfo.authority" class="toolList">
                <div @click="toIcon(item.path)" class="toolItem" v-for="(item, index) in toolList" :key="index">
                    <el-tooltip class="box-item" effect="dark" :content="item.tips" placement="bottom">
                        <div v-if="item.icon" class="toolIcon iconfont" v-html="item.icon"></div>
                        <img v-else class="toolIcon" :src="item.image"></img>
                    </el-tooltip>
                    <span class="red" v-if="item.tips == '聊天' && props.flag"></span>
                </div>
            </div>
            <div class="user">
                <el-popover placement="top-start" :width="150" trigger="hover">
                    <template #reference>
                        <img class="avatar" :src="PORT + userInfo.user_pic" alt="">
                    </template>
                    <div class="user-center" style="width: 100%;border-radius: 5px;">
                        <div @click="action(item)" v-for="(item, index) in options" :key="index" class="item" style="width: 100%;height: 45px;display: flex;
                        align-items: center;font-size: 18px;justify-content: center;cursor: pointer;">
                            {{ item }}
                        </div>
                    </div>
                </el-popover>

            </div>
        </div>
        <el-drawer v-model="drawer" title="I am the title" :with-header="false">
            <div class="change-password">
                <div class="title">修改密码</div>
                <div class="main">
                    <div class="container">
                        <span>新密码：</span>
                        <el-input show-password class="new-password" v-model="newPassword" style="width: 240px"
                            placeholder="请输入新密码..." />
                    </div>

                    <div class="container">
                        <span>确认新密码：</span>
                        <el-input show-password class="new-password" v-model="newPassword1" style="width: 240px"
                            placeholder="确认新密码..." />
                    </div>

                    <el-button @click="changePassword" class="confirm" type="primary">确认更改</el-button>
                </div>
            </div>
        </el-drawer>
    </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { toolList } from '@/assets/index'
import { ref, defineProps, reactive, defineEmits, onMounted } from 'vue'
import { ElMessage } from 'element-plus';
import { getRepertory } from '@/api/utils'
import { getUserInfo, updateUserInfo } from '@/api/index'



import { PORT } from '@/constant'

const route = useRoute()
const router = useRouter()

const props = defineProps(['flag'])
const emits = defineEmits(['changeFlat'])

const userInfo = reactive(JSON.parse(localStorage.getItem('user')))

const options = ['修改密码', '退出登录']

const drawer = ref(false)

const newPassword = ref('')
const newPassword1 = ref('')

const repertory = ref(userInfo.repertory)
const socket = window.socket
socket.addEventListener('message', async (e) => {

    const message = JSON.parse(e.data)

    if (message.type == 6 || message.type == 4) {
        // 刷新契约状态
        repertory.value = await getRepertory(userInfo.id)

    }


})

onMounted(async () => {
    repertory.value = await getRepertory(userInfo.id)
})
const toIcon = (path) => {
    if (path == '/home/chat') {
        emits('changeFlat')
    }

    router.push(path)
}

const action = (item: string) => {
    if (item == '修改密码') {
        drawer.value = true
    } else {
        localStorage.clear()
        router.push('/login')
        ElMessage.success('退出登录成功')
    }
}

const changePassword = async () => {
    if (!newPassword.value || !newPassword1.value) {
        ElMessage.error('请输入完整的信息！')
        return
    }
    if (newPassword.value != newPassword1.value) {
        ElMessage.error('两次输入的密码不一致！')
        return
    } else {
        const res = await getUserInfo({ id: userInfo.id })
        if (res.data.status == 0) {
            const { data } = res.data
            if (newPassword.value == data.password) {
                ElMessage.error('新密码不能与旧密码相同！')
                return
            } else {
                const res = await updateUserInfo({ password: newPassword.value, id: userInfo.id, type: 'update' })
                if (res.data.status == 0) {
                    localStorage.removeItem('user')
                    localStorage.removeItem('token')
                    router.push('/home')
                    ElMessage.success('密码修改成功！')
                    return
                }
            }


        }
    }
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



    .right {
        display: flex;
        align-items: center;
        height: 100%;

        .company {
            width: 100px;
            margin-right: 10px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
        }

        .repertory {
            color: gray;
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

        .user {
            width: 45px;
            height: 100%;
            display: flex;
            align-items: center;
            cursor: pointer;

            .avatar {
                border-radius: 20px;
                width: 40px;
                height: 40px;
            }

            .user-center {
                width: 100%;

                .item {
                    width: 100%;
                    height: 45px;
                    border-bottom: 1px solid #eee;
                }
            }
        }
    }

    .change-password {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        // align-items: center;

        .title {
            font-size: 16px;
            letter-spacing: 4px;
        }

        .main {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;

            margin-top: 20px;

            .container {
                padding: 0 5px;
                width: 100%;
                height: 50px;
                display: flex;
                align-items: center;
                justify-content: space-between;

                span {
                    color: gray;
                    font-size: 14px;
                }

                // .new-password {
                //     margin-top: 20px;
                // }
            }

            .confirm {
                margin-top: 20px;
            }

        }
    }

}
</style>