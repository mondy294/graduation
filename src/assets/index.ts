import { LayOutList, ToolList } from '@/utils/layout'


const layOutList: LayOutList = [
    {
        text: 'Dashboard',
        path: '/dashboard',
        children: [
            {
                text: '分析页',
                path: '/analysis'
            },
            {
                text: '工作页',
                path: '/workbench'
            }
        ]
    },
    {
        text: 'Dashboard',
        path: '/dashboard',
        children: [
            {
                text: '分析页',
                path: '/analysis'
            },
            {
                text: '工作页',
                path: '/workbench'
            }
        ]
    },
    {
        text: 'Dashboard',
        path: '/dashboard',
        children: [
            {
                text: '分析页',
                path: '/analysis'
            },
            {
                text: '工作页',
                path: '/workbench'
            }
        ]
    },
    {
        text: 'Dashboard',
        path: '/dashboard',
        children: [
            {
                text: '分析页',
                path: '/analysis'
            },
            {
                text: '工作页',
                path: '/workbench'
            }
        ]
    },

]

const ToolList: ToolList = [
    {
        icon: '&#xe86e;',
        tips: '搜索'
    },
    {
        icon: '&#xe650;',
        tips: '消息'
    },
    {
        icon: '&#xe68d;',
        tips: '聊天'
    }
]

export { layOutList, ToolList }