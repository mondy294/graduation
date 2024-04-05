import { LayOutList, ToolList, DataList } from '@/utils/layout'


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
        tips: ''
    },
    {
        icon: '&#xe68d;',
        tips: '聊天'
    }
]

const dataList: DataList = [
    {
        title: '交易数',
        date: '月',
        data: '2000',
        logo: '',
        datacolor: '#389e0d',
        subtitle: '总交易数',
        subdata: '10000'
    },
    {
        title: '交易数',
        date: '月',
        data: '2000',
        logo: '',
        datacolor: '#0958d9',
        subtitle: '总交易数',
        subdata: '10000'
    },
    {
        title: '交易数',
        date: '月',
        data: '2000',
        logo: '',
        datacolor: '#d46b08',
        subtitle: '总交易数',
        subdata: '10000'
    },
    {
        title: '交易数',
        date: '月',
        data: '2000',
        logo: '',
        datacolor: '#531dab',
        subtitle: '总交易数',
        subdata: '10000'
    },
]

const chartList: any = [
    {
        id: 'myChat1',
        option: {
            xAxis: {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {
                type: 'value',

            },
            grid: {
                // show: true,
                containLabel: true,
                left: '3%',
                top: '5%',
                bottom: '5%',
                right: '3%'
            },
            series: [
                {
                    data: [820, 932, 901, 934, 1290, 1330, 1320],
                    type: 'line',
                    smooth: true,
                    areaStyle: {
                        color: '#90D2FD',
                        opacity: 0.5
                    }
                }
            ]
        }
    },
    {
        id: 'myChat2',
        option: {
            xAxis: {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {
                type: 'value',

            },
            grid: {
                // show: true,
                containLabel: true,
                left: '3%',
                top: '5%',
                bottom: '5%',
                right: '3%'
            },
            series: [
                {
                    data: [1500, 400, 850, 934, 1290, 1330, 1320],
                    type: 'line',
                    smooth: true,
                    areaStyle: {
                        color: '#90D2FD',
                        opacity: 0.5
                    }
                }
            ]
        }
    }
]

export { layOutList, ToolList, dataList, chartList }