<template>
    <div class="chat" ref="chat">
        <div class="chatbox" v-for="(item, index) in history.data" :key="index">
            <div v-if="item.id == userInfo.id" class="right">
                <div class="avatar">
                    <img :src="PORT + person.data.user_pic" alt="">
                </div>
                <div class="content">{{ item.text }}</div>
            </div>
            <div v-else class="left">
                <div class="avatar">
                    <img :src="PORT + person.data.user_pic" alt="">
                </div>
                <div class="content">{{ item.text }}</div>

            </div>

        </div>
    </div>
    <div class="input-area">
        <div @click="inputClick" ref="input" class="input" contenteditable="true" :placeholder="placeholder">

        </div>
        <el-button @click="send()" class="send" type="primary">发送</el-button>
    </div>

</template>

<script setup lang="ts">
import { onMounted, reactive, ref, computed, defineProps, watch, toRef } from 'vue';
import { getHistory, addHistory } from '@/api/index'
import { PORT, TEXT } from '@/constant'
import { ElMessage } from 'element-plus';
import { TradeRow, MessageBox } from '@/utils/index'
import ChatBox from '@/components/ChatBox/index.vue'

const placeholder = ref('请输入...')
const input = ref()

const userInfo = reactive(JSON.parse(localStorage.getItem('user')))


const person = reactive({ data: {} as any })

const props = defineProps(['friend', 'history'])

const history = reactive(props.history)

const chat = ref()
const socket = window.socket
onMounted(() => {


})
watch(props.friend, (newValue) => {
    person.data = newValue.person
    console.log(person.data);

})
const inputClick = () => {



}
const send = async () => {
    // id排序
    const idArr = [userInfo.id, person.data.id]
    idArr.sort((a, b) => a - b)
    const id = idArr.join('-')


    let text = input.value.innerText

    const messageBox: MessageBox = {
        text: text,
        id: userInfo.id,
        targetId: person.data.id,
        type: 3
    }
    input.value.innerText = ''
    console.log(history);
    // 展示新消息
    history.data.push(messageBox)
    const res = await addHistory({ text: messageBox, id })
    socket.send(JSON.stringify(messageBox))

    // 滚动条滚到底部
    chat.value.scrollTop = chat.value.scrollHeight




}


</script>

<style scoped lang="scss">
.chat {
    width: 100%;
    height: 75%;
    border-bottom: 1px solid #eee;
    overflow: auto;


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


        }

        .right {
            position: relative;
            margin-top: 10px;
            min-height: 50px;

            width: 100%;


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
                float: right;
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
        bottom: 50px;
        z-index: 100;
    }
}
</style>