<template>
    <div class="container">
        <div class="friend-list">
            <div class="search">
                <div class="friend-apply">
                    <span @click="panelShow = !panelShow" class="iconfont friend-ask">&#xe604;</span>
                    <span v-if="friendAsk.data.length" class="tips"></span>
                </div>
            </div>
            <div class="friends" v-show="friendList.data.length && panelShow">
                <div class="friend" v-for="(item, index) in friendList.data" :key="index">
                    <div class="avatar">
                        <img :src="PORT + item.user_pic" alt="">
                    </div>
                    <div class="abstract">
                        <div class="name">
                            {{ item.nickname }}
                        </div>
                        <div class="message">
                            {{ '你好我是sqy' }}
                        </div>
                    </div>
                </div>
            </div>
            <div v-show="!panelShow" class="friends">
                <div class="friend" v-for="(item, index) in friendAskList.data" :key="index">
                    <div class="avatar">
                        <img :src="PORT + item.user_pic" alt="">
                    </div>
                    <div class="abstract">
                        <div class="name">
                            {{ item.nickname }}
                        </div>
                        <div class="choose">
                            <el-button @click="handleAsk('agree')" size="small" type="primary">同意</el-button>
                            <el-button @clcik="handleAsk('refuse')" size="small">拒绝</el-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="main">
            <div class="chat"></div>
            <div class="input"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, computed } from 'vue';
import { getFriend, getUserInfo } from '@/api/index'
import { PORT } from '@/constant'

const userInfo = reactive(JSON.parse(localStorage.getItem('user')))
const show = ref(false)

const panelShow = ref(true)
const friendList = reactive({
    data: []
})

const friendAsk = reactive({
    data: []
})
const friendAskList = reactive({
    data: []
})



const socket = window.socket

socket.addEventListener('message', (e) => {
    const message = JSON.parse(e.data)


    console.log('收到服务端信息：' + e.data);

})

onMounted(async () => {
    // 获取好友列表
    await getFriendList()
    // 获取好友申请
    await getFriendAsk()
    // 获取好友申请列表
    await getFriendAskList()
})

// 获取好友列表
const getFriendList = async () => {
    const res = await getFriend({ id: userInfo.id })

    if (res.data.status === 0) {
        const { data } = res.data
        friendList.data = data

        if (friendList.data.length == 0) {
            show.value = true
        }

    }
}
// 获取好友申请
const getFriendAsk = async () => {
    const res = await getUserInfo({ id: userInfo.id })
    if (res.data.status === 0) {
        // 获取该账号的所有申请
        const { data: { prefriends } } = res.data
        friendAsk.data = JSON.parse(prefriends).friends
    }
}
// 获取好友申请列表
const getFriendAskList = async () => {
    const res = await getUserInfo({ id: friendAsk.data })
    if (res.data.status === 0) {
        // 获取该账号的所有申请
        const { data } = res.data
        friendAskList.data = data
    }
}


// 申请的处理
const handleAsk = (type: string) => {
    const actions = {
        'agree': agree(),
        'refuse': refuse()
    }
    return actions[type]
}

// 同意好友申请
const agree = () => {


}
// 拒绝好友申请
const refuse = () => {


}


</script>

<style scoped lang="scss">
.container {
    width: 100%;
    height: 100%;



    .friend-list {
        float: left;
        width: 25%;
        height: 100%;
        border-right: 1px solid #eee;
        display: flex;
        flex-direction: column;


        .search {
            flex-shrink: 0;
            padding: 0 10px;
            width: 100%;
            height: 45px;
            border-bottom: 1px solid #eee;
            display: flex;
            align-items: center;


            .friend-apply {
                position: relative;

                .friend-ask {
                    cursor: pointer;
                    font-size: 28px;
                    transition: all 0.3s;

                    &:hover {
                        color: #0960BD;
                    }
                }

                .tips {
                    position: absolute;
                    right: -5px;
                    top: 0;
                    width: 10px;
                    height: 10px;
                    border-radius: 5px;
                    background-color: red;
                }
            }
        }

        .friends {
            width: 100%;
            height: 100%;
            overflow: auto;

            .friend {
                width: 100%;
                height: 60px;
                border-bottom: 1px solid #eee;
                cursor: pointer;

                .avatar {
                    float: left;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 60px;
                    height: 100%;

                    img {
                        border-radius: 25px;
                        width: 50px;
                        height: 50px;
                        background-color: blue;
                    }

                }

                .abstract {
                    overflow: hidden;
                    height: 100%;
                    padding: 0 10px;

                    .name {
                        height: 30px;
                        line-height: 30px;
                        text-align: start;
                    }

                    .message {
                        line-height: 30px;
                        text-align: start;
                    }

                    .choose {
                        display: flex;
                        justify-content: center;
                    }
                }
            }
        }
    }

    .main {
        overflow: hidden;
        height: 100%;

        .chat {
            width: 100%;
            height: 75%;
            border-bottom: 1px solid #eee;

        }

        .input {
            width: 100%;
            height: 25%;
        }
    }
}
</style>