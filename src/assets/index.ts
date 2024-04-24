import { LayOutList, ToolList, DataList } from '@/utils/layout'


const layOutList: LayOutList = [
    {
        text: 'Dashboard',
        path: '/dashboard',
        logo: '&#xe653;',
        children: [
            {
                text: '分析页',
                path: '/analysis'
            }
        ]
    },
    {
        text: '交易中心',
        path: '/trade',
        logo: '&#xe699;',
        children: [
            {
                text: '交易中心',
                path: '/trade'
            },
            {
                text: '购买记录',
                path: '/order'
            },
            {
                text: '商品交易',
                path: '/products'
            }
        ]
    },
    {
        text: '碳价行情',
        path: '/market',
        logo: '&#xe662;',
        children: [
            {
                text: '行情面板',
                path: '/panel'
            },
        ]
    },
    {
        text: '契约管理中心',
        path: '/contract',
        logo: '&#xe7f1;',
        children: [
            {
                text: '契约详情',
                path: '/details'
            },
        ]
    },

]

const adminLayOutList: LayOutList = [
    {
        text: 'Dashboard',
        path: '/dashboard',
        children: [
            {
                text: '分析页',
                path: '/analysis'
            }
        ]
    },
    {
        text: '碳价行情',
        path: '/market',
        children: [
            {
                text: '行情面板',
                path: '/panel'
            },
        ]
    },
    {
        text: '管理员操作',
        path: '/admin',
        children: [
            {
                text: '用户管理',
                path: '/usermanage'
            },
            {
                text: '碳分配',
                path: '/allocation'
            },
        ]
    },
]

const toolList: ToolList = [
    {
        icon: '&#xe86e;',
        tips: '搜索',
        path: ''
    },
    {
        icon: '&#xe650;',
        tips: '消息',
        path: ''
    },
    {
        icon: '&#xe68d;',
        tips: '聊天',
        path: '/home/chat'
    }
]

export { layOutList, toolList, adminLayOutList }