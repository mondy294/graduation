
import Home from '@/pages/Layout/Layout.vue'
import Login from '@/pages/Login/Login.vue'
import Analysis from '@/pages/Analysis/Analysis.vue'
import Workbench from '@/pages/Workbench/Workbench.vue'
import Trade from '@/pages/Trade/Trade.vue'
import Products from '@/pages/Trade/Products.vue'
import Order from '@/pages/Trade/Order.vue'


const routes: any[] = [
    {
        path: '/',
        redirect: '/home/dashboard'
    },
    {
        path: '/home/dashboard',
        name: 'home',
        component: Home,
        children: [
            {
                path: '/home/dashboard',
                redirect: '/home/dashboard/analysis'
            },
            {
                path: 'analysis',
                component: Analysis,
                name: 'analysis',
                meta: {
                    pageName: '分析页',
                    id: [0, 0]
                }
            },
            {
                path: 'workbench',
                component: Workbench,
                name: 'workbench',
                meta: {
                    pageName: '工作页',
                    id: [0, 1]
                }
            }
        ]
    },
    {
        path: '/home/trade',
        name: 'trade',
        component: Home,
        children: [
            {
                path: 'trade',
                component: Trade,
                name: 'trade',
                meta: {
                    pageName: '交易中心',
                    id: [1, 0]
                }
            },
            {
                path: 'order',
                component: Order,
                name: 'order',
                meta: {
                    pageName: '我的购买',
                    id: [1, 1]
                }
            },
            {
                path: 'products',
                component: Products,
                name: 'products',
                meta: {
                    pageName: '商品交易',
                    id: [1, 2]
                }
            },
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: Login
    },

]


export default routes