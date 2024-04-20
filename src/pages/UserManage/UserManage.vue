<template>
    <div class="container">
        <div class="tool-header">
            <el-button @click="distribution" type="primary">一键分配</el-button>
        </div>
        <el-table v-loading="loading" element-loading-text="Loading..."
            :data="orderList.data.slice(10 * (currentPage - 1), 10 * currentPage)" style="width: 100%" height="1200"
            :default-sort="{ prop: 'date', order: 'descending' }" empty-text="您暂未发布任何商品~">
            <el-table-column label="头像">
                <template #default="scope">
                    <img style="width: 40px;height: 40px;border-radius: 20px;" :src="PORT + scope.row.user_pic" alt="">
                </template>
            </el-table-column>
            <el-table-column prop="nickname" label="昵称">
            </el-table-column>
            <el-table-column prop="account" label="账号">
            </el-table-column>
            <el-table-column prop="password" label="密码">
            </el-table-column>
            <el-table-column label="是否管理员">
                <template #default="scope">
                    <span>{{ scope.row.authority == 1 ? '是' : '否' }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="repertory" label="吨" sortable>
            </el-table-column>

            <el-table-column label="操作">

                <template #default="scope">
                    <el-button @click="canle" size="small" type="danger">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination :page-size="10" layout="prev, pager, next" :total="orderList.data.length"
                v-model:current-page="currentPage" hide-on-single-page />
        </div>
    </div>
</template>

<script setup lang="ts">
import { getUserInfo, updateUserInfo } from '@/api/index'
import { onMounted, reactive, ref, computed, onBeforeMount } from 'vue';
import { ElMessage } from 'element-plus';
import { PORT } from '@/constant'



const currentPage = ref(1)
const userInfo = reactive(JSON.parse(localStorage.getItem('user')))
const loading = ref(true)


const orderList = reactive({
    data: []
})

onMounted(async () => {
    await getAllUser()
})

const getAllUser = async () => {
    loading.value = true
    const res = await getUserInfo()

    if (res.data.status == 0) {
        const { data } = res.data
        orderList.data = data.filter(item => {
            return item.authority == 0
        })

        setTimeout(() => {
            loading.value = false
        }, 500);

    }
}
const canle = async () => {
    const res = await updateUserInfo({ type: 'cancle' })
    if (res.data.status == 0) {
        ElMessage.success('删除用户成功')
    }
}
// 核心分配算法
const distribution = () => {

}


</script>

<style scoped lang="scss">
.container {
    .tool-header {
        width: 100%;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: end;
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

}
</style>