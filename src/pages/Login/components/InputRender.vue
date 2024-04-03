<script lang="tsx">
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import { InputItem } from '@/utils/login'


export default defineComponent({
    name: 'InputRender',
    props: {
        modelValue: {
            type: String,
            default: ''
        },
        inputArr: {
            type: [Object] as PropType<any>,
            default: []
        }
    },
    setup(props: any) {
        const { inputArr, modelValue } = props
        console.log(inputArr);
        console.log(modelValue);





        const inputBlur = (item: InputItem) => {
            return () => {
                item.eventFlag = !item.flag ? true : false
                if (item.text == '确认密码' && item.flag !== modelValue) {
                    item.eventFlag = true
                }
                console.log(1111);
            }

        }
        const inputing = (item: InputItem) => {
            return () => {
                item.eventFlag = false
            }

        }

        const inputRender = () => {
            return inputArr.map((item, index) => {
                return (
                    <div class="inputGroup" key={index}>
                        <div class="tag">{item.text}</div>
                        <el-input v-model={item.flag} type={item.type ? 'password' : ''} class="account"
                            placeholder={item.placeholder} clearable onBlur={inputBlur(item)} onInput={inputing(item)} />
                        <div v-show="item.eventFlag" class="warning">{item.warning}
                        </div>
                    </div>
                )
            })

        }

        return () => {
            return (
                inputRender()
            )
        }



    },

})
</script>

<style lang="scss" scoped>
.warning {
    position: absolute;
    height: 0px;
    text-align: left;
    padding-top: 4px;
    font-size: 12px;
    color: #f56c6c;
    transition: all 0.5s;
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
</style>