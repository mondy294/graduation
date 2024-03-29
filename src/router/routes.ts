import { RouteRecordRaw } from 'vue-router'

import Home from '../pages/Home.vue'
import Login from '../pages/Login.vue'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/home',
        name: 'home',
        component: Home
    },
    {
        path: '/login',
        name: 'login',
        component: Login
    }
]


export default routes