import { createRouter, createWebHistory } from "vue-router";
import { ElMessage } from 'element-plus';

import routes from './routes'

const router = createRouter({
    history: createWebHistory(),
    routes
});
router.beforeEach((to, from, next) => {
    // 未登录 重定向至login
    if (to.fullPath !== '/login' && !localStorage.getItem('token')) {
        next({ name: 'login' })
        ElMessage.warning('token已更新 请重新登录')
    }
    else {
        next()
    }

})

export default router;



