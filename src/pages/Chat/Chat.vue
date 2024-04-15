<template>
    <div class="container">
        <div class="friend-list">
            <div class="search">
                <div class="friend-apply">
                    <span @click="panelShow = !panelShow" class="iconfont friend-ask">&#xe604;</span>
                    <span v-if="friendAskList.data.length" class="tips"></span>
                </div>
            </div>
            <div class="friends" v-show="friendList.data.length && panelShow">
                <div @click="toFriend(item)" class="friend" v-for="(item, index) in friendList.data" :key="index">
                    <div class="avatar">
                        <img :src="PORT + item.user_pic" alt="">
                    </div>
                    <div class="abstract">
                        <div class="name">
                            {{ item.nickname }}
                        </div>
                        <div class="message">
                            <div class="text" v-if="item.newMessage">
                                {{ item.newMessage }}
                                <span>1</span>
                            </div>
                            <div class="text" v-else>你好我是{{ item.nickname }}</div>
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
                            <el-button @click="handleAsk('agree', item)" size="small" type="primary">同意</el-button>
                            <el-button @clcik="handleAsk('refuse', item)" size="small">拒绝</el-button>
                        </div>
                    </div>
                </div>
                <div v-if="!friendAskList.data.length" class="panel-blank">暂无好友申请</div>
            </div>
        </div>
        <div class="main">
            <ChatBox :friend="member" :history="history"></ChatBox>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, computed } from 'vue';
import { getFriend, getUserInfo, addFriend, cancleFriend, getHistory, addHistory } from '@/api/index'
import { PORT, ADD_FRIEND, LOGIN, FINISH_FRIEND, TEXT, CONTRACT } from '@/constant'
import { ElMessage } from 'element-plus';
import { TradeRow, MessageBox } from '@/utils/index'
import ChatBox from '@/components/ChatBox/index.vue'



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

const member = reactive({ person: {} as any })

const history = reactive({
    data: []
})

const socket = window.socket

socket.addEventListener('message', async (e) => {

    const message = JSON.parse(e.data)
    // 收到好友请求
    if (message.type == ADD_FRIEND) {
        // 获取好友申请

        await getFriendAsk()
        // 获取好友申请列表
        await getFriendAskList(friendAsk.data)
    }
    // 如果是好友申请通过了
    else if (message.type == FINISH_FRIEND) {

        // 获取好友列表
        await getFriendList()

    } else if (message.type == TEXT || message.type == CONTRACT) {

        // 获取好友列表
        await getFriendList()
        // 如果当前正好停留在与此人的聊天页面那么更新数据
        if (member.person.id == message.id) {
            history.data.push(message)

        }
        // 是其他人发来的信息
        else {
            friendList.data.forEach((item) => {
                if (item.id == message.id) {
                    item.newMessage = message.text
                    return
                }

            })
        }

    }




})


onMounted(async () => {
    // 获取好友列表
    await getFriendList()
    // 获取好友申请
    await getFriendAsk()
    // 获取好友申请列表
    await getFriendAskList(friendAsk.data)

    member.person = friendList.data[0]

    await gethistory(member.person)
})
const gethistory = async (item: any) => {
    if (!item) return

    // id排序
    const idArr = [userInfo.id, item.id]
    idArr.sort((a, b) => a - b)
    const id = idArr.join('-')

    const res = await getHistory({ id })
    if (res.data.status == 0) {
        let { data } = res.data
        if (!data) data = []
        if (data.length == 0) {
            history.data = []
            return
        }
        history.data = JSON.parse(data.textHistory)
    }

}

// 获取最后一条信息
const getNewMessage = (id: number) => {

}

// 去聊天
const toFriend = async (item: any) => {
    member.person = item
    await gethistory(item)
}
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
        friendAsk.data = prefriends == null ? [] : JSON.parse(prefriends).friends
    }
}
// 获取好友申请列表
const getFriendAskList = async (data: any) => {
    // 好友列表没有人员
    if (data.length == 0) {
        friendAskList.data = data = []
        return
    }
    const res = await getUserInfo({ id: data })
    if (res.data.status === 0) {
        // 获取该账号的所有申请
        let { data } = res.data
        data = Array.isArray(data) ? data : [data]
        friendAskList.data = data
    }
}


// 申请的处理
const handleAsk = (type: string, item) => {
    const actions = {
        'agree': agree(item),
        'refuse': refuse(item)
    }
    return actions[type]
}

// 同意好友申请
const agree = async (item: any) => {
    const targetId = item.id
    const res = await getUserInfo({ id: [userInfo.id, targetId] })
    if (res.data.status == 0) {
        const { data: dataArr } = res.data

        dataArr.forEach(async (item) => {

            // 追加当好友 当前账号和目标张好都要追加
            // 代表当前对象时本账号
            if (item.id == userInfo.id) {
                // 获取当前已有的好友
                let { friends: currentFriend } = item
                // 获取当前已有的好友申请
                currentFriend = currentFriend == null ? [] : JSON.parse(currentFriend).friends

                if (!currentFriend.includes(targetId + '')) {
                    currentFriend.push(targetId + '')
                }
                // 删除当前申请
                let { prefriends: currentPreFriend } = item
                currentPreFriend = currentPreFriend == "null" ? [] : JSON.parse(currentPreFriend).friends
                currentPreFriend.splice(currentPreFriend.indexOf(targetId), 1)

                // 正式添加好友
                const response = await addFriend({ friends: currentFriend, id: item.id, type: 1 })
                if (response.data.status == 0) {
                    ElMessage.success('通过申请，快去聊聊吧~')
                    // 重新加载好友列表
                    await getFriendList()
                    // 删除这个好友申请
                    const res = await cancleFriend({ id: userInfo.id, friends: [] })
                    if (res.data.status == 0) {
                        // 成功新获取申请列表
                        await getFriendAskList(currentPreFriend)

                        const messageBox: MessageBox = {
                            id: userInfo.id,
                            targetId: targetId,
                            type: 1
                        }
                        // 通知对方 更新好友列表和申请列表
                        socket.send(JSON.stringify(messageBox))
                    }

                }
            }
            else {
                // 获取当前已有的好友
                let { friends: currentFriend } = item
                // 获取当前已有的好友申请
                // 追加当好友 当前账号和目标张好都要追加

                currentFriend = currentFriend == null ? [] : JSON.parse(currentFriend).friends

                if (!currentFriend.includes(userInfo.id + '')) {
                    currentFriend.push(userInfo.id + '')
                }
                // 正式添加好友
                const response = await addFriend({ friends: currentFriend, id: item.id, type: 1 })
                if (response.data.status == 0) {


                }
            }

        });
    }


}
// 拒绝好友申请
const refuse = async (item: any) => {


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

            .panel-blank {
                height: 45px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: gray;
                font-size: 16px;
            }

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
                        width: 100%;
                        display: flex;
                        align-items: center;
                        line-height: 30px;
                        text-align: start;

                        .text {
                            width: 100%;
                            display: flex;
                            align-items: center;
                            justify-content: space-between;

                            span {
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                border-radius: 10px;
                                width: 20px;
                                height: 20px;
                                background-color: red;
                                color: #fff;
                            }
                        }
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


    }
}
</style>