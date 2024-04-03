
import Home from '@/pages/Layout/Layout.vue'
import Login from '@/pages/Login/Login.vue'
import Analysis from '@/pages/Analysis/Analysis.vue'
import Workbench from '@/pages/Workbench/Workbench.vue'


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
                path: 'analysis',
                component: Analysis,
                name: 'analysis',
                meta: {
                    pageName: '分析页'
                }
            },
            {
                path: 'workbench',
                component: Workbench,
                name: 'workbench',
                meta: {
                    pageName: '工作页'
                }
            }
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: Login
    }
]


export default routes