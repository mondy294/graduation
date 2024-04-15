<template>
    <div class="chat" ref="chat">
        <div class="chatbox" v-for="(item, index) in history.data" :key="index">
            <div v-if="item.id == userInfo.id" class="right">
                <div class="avatar">
                    <img :src="PORT + person.data.user_pic" alt="">
                </div>
                <div v-if="item.type == 3" class="content">{{ item.text }}</div>
                <div @click="toContract(item)" v-else class="contract-container">
                    <div class="mask">点击跳转</div>
                    <div class="contract">
                        <div class="item">
                            <span>提出者</span>
                            <span>{{ item.seller }}</span>
                        </div>
                        <div class="item">
                            <span>接收者</span>
                            <span>{{ item.buyer }}</span>
                        </div>
                        <div class="item">
                            <span>碳配额数量</span>
                            <span>{{ item.count }}</span>
                        </div>
                        <div class="details">
                            <span>协议详情</span>
                            <div>{{ item.text }}</div>
                        </div>
                    </div>

                </div>
            </div>
            <div v-else class="left">
                <div class="avatar">
                    <img :src="PORT + person.data.user_pic" alt="">
                </div>
                <div v-if="item.type == 3" class="content">{{ item.text }}</div>
                <div @click="toContract(item)" v-else class="contract-container">
                    <div class="mask">点击跳转</div>
                    <div class="contract">
                        <div class="item">
                            <span>提出者</span>
                            <span>{{ item.seller }}</span>
                        </div>
                        <div class="item">
                            <span>接收者</span>
                            <span>{{ item.buyer }}</span>
                        </div>
                        <div class="item">
                            <span>碳配额数量</span>
                            <span>{{ item.count }}</span>
                        </div>
                        <div class="details">
                            <span>协议详情</span>
                            <div>{{ item.text }}</div>
                        </div>
                    </div>

                </div>


            </div>

        </div>
    </div>
    <div class="input-area">
        <div @click="inputClick" ref="input" class="input" contenteditable="true" :placeholder="placeholder">

        </div>
        <el-button @click="send" @keyup="send" class="send" type="primary">发送</el-button>
        <div @click="dialogVisible = !dialogVisible" class="iconfont contract">&#xe98f;</div>
    </div>
    <el-dialog v-model="dialogVisible" title="契约详情" width="400" :before-close="handleClose">
        <div class="contract-main">
            <div class="contract-item">
                <div class="left">契约提出方:</div>
                <div class="right">{{ userInfo.nickname }}</div>
            </div>
            <div class="contract-item">
                <div class="left">契约接受方:</div>
                <div class="right">{{ person.data.nickname }}</div>
            </div>
            <div class="contract-item">
                <div class="left">预转让碳配额:</div>
                <div class="right">
                    <el-input-number v-model="count" :min="0" :max="repertory" />/吨
                </div>
            </div>
            <div class="text">
                <textarea v-model="contract" placeholder="请输入详细内容..." class="textarea" cols="20" rows=""></textarea>
            </div>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="confirm('cancle')">取消</el-button>
                <el-button type="primary" @click="confirm('confirm')">
                    确认契约
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, computed, defineProps, watch, } from 'vue';
import { getHistory, addHistory, addContract } from '@/api/index'
import { getRepertory } from '@/api/utils'
import { PORT, TEXT } from '@/constant'
import { ElMessage } from 'element-plus';
import { TradeRow, MessageBox } from '@/utils/index'
import { useRouter } from 'vue-router'

const router = useRouter()
const placeholder = ref('请输入...')
const input = ref()

const userInfo = reactive(JSON.parse(localStorage.getItem('user')))

const props = defineProps(['friend', 'history'])
const person = reactive({ data: props.friend.person as any })



const history = reactive(props.history)

const chat = ref()
const count = ref(0)
const repertory = ref(userInfo.repertory)

const dialogVisible = ref(false)

const contract = ref('')
const socket = window.socket
onMounted(async () => {
    setTimeout(() => {
        chat.value.scrollTop = chat.value.scrollHeight
    }, 200);
    window.addEventListener('keyup', e => {
        if (e.keyCode && e.keyCode !== 13) return
        if (e.keyCode == 13) {
            e.preventDefault();
            e.stopPropagation();//阻止事件冒泡
        }
        send()
    })

    repertory.value = await getRepertory(userInfo.id)


})
onUnmounted(() => {
    //销毁事件
    window.removeEventListener('keyup', send, false)
})
watch(props.friend, (newValue) => {
    person.data = newValue.person
    console.log(person.data);


})
// 有新消息就拉到底部
watch(history, (newValue) => {
    setTimeout(() => {
        chat.value.scrollTop = chat.value.scrollHeight
    }, 200);


})
const inputClick = () => {



}
const send = async () => {
    // id排序
    const idArr = [userInfo.id, person.data.id]
    idArr.sort((a, b) => a - b)
    const id = idArr.join('-')
    let text = input.value.innerText

    if (!text) return
    const messageBox: MessageBox = {
        text: text,
        id: userInfo.id,
        targetId: person.data.id,
        type: 3
    }
    input.value.innerText = ''
    // 展示新消息
    history.data.push(messageBox)
    const res = await addHistory({ text: messageBox, id })
    socket.send(JSON.stringify(messageBox))

    // 滚动条滚到底部
    chat.value.scrollTop = chat.value.scrollHeight




}

const confirm = (type: string) => {
    switch (type) {
        case ('cancle'):
            handleClose()
            break
        case ('confirm'):
            sendContract()
            break
    }
}

const sendContract = async () => {
    // id排序
    const idArr = [userInfo.id, person.data.id]
    idArr.sort((a, b) => a - b)
    const id = idArr.join('-')
    const messageBox: MessageBox = {
        text: contract.value,
        id: userInfo.id,
        targetId: person.data.id,
        count: count.value,
        seller: userInfo.nickname,
        buyer: person.data.nickname,
        type: 5
    }
    history.data.push(messageBox)
    // 增加消息记录
    await addHistory({ text: messageBox, id })

    let timer = new Date()
    // 生成当前时间字符串
    let date = timer.toLocaleDateString() + ' ' + timer.toLocaleTimeString()
    // 增加契约记录
    const obj = {
        sellid: userInfo.id,
        buyid: person.data.id,
        date,
        content: contract.value,
        count: count.value,
        seller: userInfo.nickname,
        buyer: person.data.nickname
    }
    const res = await addContract(obj)

    socket.send(JSON.stringify(messageBox))
    handleClose()
}

// 通过失去焦点关闭
const handleClose = () => {
    dialogVisible.value = false

}

const toContract = (item: any) => {
    router.push('/home/contract/details')

}
</script>

<style scoped lang="scss">
.chat {
    width: 100%;
    height: 75%;
    border-bottom: 1px solid #eee;
    overflow: auto;
    padding-bottom: 30px;


    &::-webkit-scrollbar {
        display: none;
    }

    .chatbox {
        padding: 10px 10px;
        width: 100%;


        .left {
            position: relative;
            margin-top: 10px;
            min-height: 50px;

            width: 100%;


            .avatar {
                position: absolute;
                width: 45px;
                height: 45px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 8px;

                img {
                    width: 40px;
                    height: 40px;
                    border-radius: 20px;
                }


            }

            .content {
                color: #fff;
                position: relative;
                left: 50px;
                top: 10px;
                padding: 5px 5px;
                display: inline-block;
                border-radius: 4px;
                max-width: 200px;
                min-height: 0;
                background-color: #7fa9d6;
                word-wrap: break-word;
            }

            .contract-container {
                position: relative;
                cursor: pointer;
                width: 250px;
                height: 300px;
                position: relative;
                left: 50px;
                top: 10px;
                padding: 5px 5px;
                display: inline-block;
                border-radius: 4px;
                min-height: 0;
                border: 1px solid #eee;
                color: #fff;
                background-color: rgba($color: #000000, $alpha: 0.2);

                &:hover {
                    color: skyblue;
                }

                .mask {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    letter-spacing: 5px;
                    font-size: 24px;
                    transition: all 0.5s;


                }

                .contract {
                    width: 100%;
                    height: 100%;
                    display: inline-block;
                    border-radius: 4px;
                    min-height: 0;
                    filter: blur(2.5px);

                    .item {
                        display: flex;
                        height: 45px;
                        padding: 10px 10px;
                        justify-content: space-between;

                        span {
                            font-size: 20px;
                            color: gray;
                        }
                    }

                    .details {
                        margin-top: 10px;
                        width: 100%;
                        word-break: break-all;
                        padding: 10px 10px;
                        color: gray;

                        div {
                            overflow: hidden;
                            width: 100%;
                            word-break: break-all;
                            text-overflow: ellipsis;
                            font-size: 18px;
                        }
                    }
                }

            }



        }

        .right {
            position: relative;
            margin-top: 10px;
            min-height: 50px;
            width: 100%;
            text-align: right;

            .avatar {
                position: absolute;
                right: 0px;
                width: 45px;
                height: 45px;
                display: flex;
                align-items: center;
                justify-content: center;


                img {
                    width: 40px;
                    height: 40px;
                    border-radius: 20px;
                }
            }

            .content {
                color: #fff;
                position: relative;
                right: 50px;
                top: 10px;
                padding: 5px 5px;
                display: inline-block;
                border-radius: 4px;
                max-width: 200px;
                min-height: 0;
                background-color: #7fa9d6;
                word-wrap: break-word;
            }

            .contract-container {
                display: inline-block;
                position: relative;
                cursor: pointer;
                width: 250px;
                height: 300px;

                right: 50px;
                top: 10px;
                padding: 5px 5px;
                padding-bottom: 10px;
                border-radius: 4px;
                min-height: 0;
                border: 1px solid #eee;
                color: #fff;
                background-color: rgba($color: #000000, $alpha: 0.2);

                &:hover {
                    color: skyblue;
                }

                .mask {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    letter-spacing: 5px;
                    font-size: 24px;
                    transition: all 0.5s;


                }

                .contract {
                    overflow: hidden;
                    width: 100%;
                    height: 100%;
                    display: inline-block;
                    border-radius: 4px;
                    min-height: 0;
                    filter: blur(2.5px);
                    text-align: left;


                    .item {
                        display: flex;
                        height: 45px;
                        padding: 10px 10px;
                        justify-content: space-between;
                        color: gray;


                        span {
                            &:nth-child(1) {
                                font-size: 16px;
                            }

                            &:nth-child(2) {
                                font-size: 20px;
                            }
                        }
                    }

                    .details {
                        margin-top: 10px;
                        width: 100%;
                        word-break: break-all;
                        padding: 10px 10px;
                        color: gray;


                        div {

                            width: 100%;
                            word-break: break-all;
                            text-overflow: ellipsis;
                            font-size: 18px;
                        }
                    }
                }

            }
        }
    }

}

.input-area {
    position: relative;
    width: 100%;
    height: 25%;
    padding: 10px;

    .input {
        width: 100%;
        height: 100%;
        outline: none;
        padding: 10px;

        &:empty:before {
            content: attr(placeholder);
            color: gray;
        }

        &:focus:before {
            content: ''

        }
    }

    .send {
        position: absolute;
        right: 10px;
        bottom: 60px;
        z-index: 100;
    }

    .contract {
        position: absolute;
        right: 20px;
        top: 10px;
        font-size: 24px;
        color: #0960BD;
        cursor: pointer;

    }

}

.contract-main {
    width: 100%;


    .contract-item {
        margin-top: 10px;
        width: 100%;
        height: 45px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .left {
            margin-left: 20px;
        }

        .right {
            margin-right: 20px;
            font-size: 20px;
        }


    }

    .text {

        width: 100%;
        padding: 0 20px;
        height: 75px;

        .textarea {
            width: 308px;

            outline: none;
            padding: 5px 10px;

            height: 100%;
        }
    }
}
</style>