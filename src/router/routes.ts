import { RouteRecordRaw } from 'vue-router'

import Home from '../pages/home.vue'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/home',
        name: 'home',
        components: Home
    }
]


export default routes