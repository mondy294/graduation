import { RouteRecordRaw } from 'vue-router'

import Home from '../pages/Home.vue'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/home',
        name: 'home',
        component: Home
    }
]


export default routes