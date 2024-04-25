<template>
    <div class="container">

        <el-table v-loading="loading" element-loading-text="Loading..."
            :data="contractList.data.slice(10 * (currentPage - 1), 10 * currentPage)" style="width: 100%" height="1200"
            :default-sort="{ prop: 'date', order: 'descending' }" empty-text="暂无任何契约" :cell-style="cellState">

            <el-table-column label="日期" sortable>
                <template #default="scope">
                    <div style="display: flex; align-items: center">
                        <el-icon>
                            <timer />
                        </el-icon>
                        <span style="margin-left: 10px">{{ scope.row.date }}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="提出者">
                <template #default="scope">
                    <el-popover effect="light" trigger="hover" placement="top" width="auto">
                        <template #default>
                            <div>name: {{ scope.row.seller }}</div>
                        </template>
                        <template #reference>
                            <el-tag>{{ scope.row.seller }}</el-tag>
                        </template>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column label="接收者">
                <template #default="scope">
                    <el-popover effect="light" trigger="hover" placement="top" width="auto">
                        <template #default>
                            <div>name: {{ scope.row.buyer }}</div>
                        </template>
                        <template #reference>
                            <el-tag>{{ scope.row.buyer }}</el-tag>
                        </template>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column prop="count" label="总数 /吨" sortable>
            </el-table-column>
            <el-table-column prop="content" label="契约详情">
            </el-table-column>
            <el-table-column label="契约状态">
                <template #default="scope">
                    <span style="margin-left: 10px">{{ getState(scope.row) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作">

                <template #default="scope">
                    <el-button v-if="scope.row.status == 0 && scope.row.buyid == userInfo.id" @click="check(scope.row)"
                        size="small" type="primary">审核</el-button>
                    <el-button v-else @click="check(scope.row)" size="small" type="primary">查看</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination :page-size="10" layout="prev, pager, next" :total="contractList.data.length"
                v-model:current-page="currentPage" hide-on-single-page />
        </div>

        <el-dialog v-model="dialogVisible" title="契约详情" width="400" :before-close="handleClose">
            <div class="contract-main">
                <div class="contract-item">
                    <div class="left">契约提出方:</div>
                    <div class="right">{{ contract.seller }}</div>
                </div>
                <div class="contract-item">
                    <div class="left">契约接受方:</div>
                    <div class="right">{{ contract.buyer }}</div>
                </div>
                <div class="contract-item">
                    <div class="left">预转让碳配额:</div>
                    <div class="right">
                        {{ contract.count }}/吨
                    </div>
                </div>
                <div class="text">
                    <div>{{ contract.content }}</div>
                </div>
            </div>
            <template #footer>
                <div v-if="contract.status == 0 && contract.buyid == userInfo.id" class="dialog-footer">
                    <el-button type="danger" @click="confirm('cancle')">驳回申请</el-button>
                    <el-button type="primary" @click="confirm('confirm')">
                        审核通过
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { getContract, addContract, editRepertory } from '@/api/index'
import { Timer } from '@element-plus/icons-vue'
import { getRepertory } from '@/api/utils'
import { MessageBox } from '@/utils/index'


import { onMounted, reactive, ref, computed, onBeforeMount } from 'vue';
import { ElMessage } from 'element-plus';
import { PORT, ADD_FRIEND, LOGIN, FINISH_FRIEND, TEXT, CONTRACT, REFRESH_CONTRACT } from '@/constant'



const currentPage = ref(1)
const userInfo = reactive(JSON.parse(localStorage.getItem('user')))
const loading = ref(true)

const dialogVisible = ref(false)

let contract = {} as any
const repertory = ref(userInfo.repertory)


const contractList = reactive({
    data: []
})


const socket = window.socket
socket.addEventListener('message', async (e) => {

    const message = JSON.parse(e.data)

    if (message.type == 6) {
        // 刷新契约状态
        await getMyContract()

    }





})
onMounted(async () => {
    await getMyContract()
})

const cellState = ({ columnIndex, row }) => {
    if (columnIndex == 5) {
        if (row.status == 1) {
            return {
                color: 'green'
            }
        }
        else if (row.status == 0) { }
        else {
            return {
                color: 'red'
            }
        }


    }

}

const getMyContract = async () => {
    const { id } = userInfo
    loading.value = true
    const res = await getContract({ id })

    if (res.data.status == 0) {
        const { data } = res.data
        contractList.data = data

        setTimeout(() => {
            loading.value = false
        }, 500);

    }
}

const getState = (row: any) => {
    if (row.status == 0) {
        if (row.sellid == userInfo.id) {
            return '待对方审核'
        } else {
            return '等待您审核'
        }
    } else if (row.status == 1) {
        if (row.sellid == userInfo.id) {
            return '审核通过'
        } else {
            return '审核通过'
        }
    } else {
        if (row.sellid == userInfo.id) {
            return '对方已拒绝'
        } else {
            return '您已拒绝'
        }
    }
}

const check = (row: any) => {
    dialogVisible.value = true
    contract = row
}
const confirm = async (type: string) => {
    switch (type) {
        case ('cancle'):
            await changeContractStatus(-1)
            break
        case ('confirm'):
            // 更改状态
            await changeContractStatus(1)
            await fiveForFree()
            break
    }
}
// 通过失去焦点关闭
const handleClose = () => {
    dialogVisible.value = false

}

const changeContractStatus = async (status: number) => {
    const id = contract.id
    const res = await addContract({ id, status })
    if (res.data.status == 0) {
        const { data } = res.data
        handleClose()
        await getMyContract()
        if (status == 1) {
            ElMessage.success('审核已通过！')
        }
        else {
            ElMessage.error('审核已驳回！')
        }


    }
}

// 转增碳配额
const fiveForFree = async () => {
    // 获取当前用户库存
    let sellRepertory = await getRepertory(contract.sellid) - parseInt(contract.count)
    // 获取对方库存
    let buyRepertory = await getRepertory(contract.buyid) + parseInt(contract.count)


    const res = await editRepertory({ id: contract.sellid, count: sellRepertory })
    if (res.data.status == 0) {
        const res = await editRepertory({ id: contract.buyid, count: buyRepertory })
        if (res.data.status == 0) {
            // 通知对方更新
            const messageBox: MessageBox = {
                id: userInfo.id,
                targetId: userInfo.id == contract.buyid ? contract.sellid : contract.buyid,
                type: 6
            }
            // 通知自己更新
            socket.send(JSON.stringify(messageBox))
            const messageBoxCopy: MessageBox = {
                id: userInfo.id,
                targetId: userInfo.id,
                type: 6
            }

            socket.send(JSON.stringify(messageBoxCopy))
        }
    }

}


</script>

<style scoped lang="scss">
.container {
    .tool-header {
        width: 100%;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: space-around;
        padding: 0 20px;
        border-bottom: 1px solid #eee;
    }

    .pagination {
        width: 100%;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
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

            div {
                overflow: auto;
                width: 100%;
                height: 100%;
                text-overflow: ellipsis;
                word-break: break-all;

                &::-webkit-scrollbar {
                    display: none;
                }

            }
        }
    }

}
</style>