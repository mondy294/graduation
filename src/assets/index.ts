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
        text: '交易中心',
        path: '/trade',
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
        children: [
            {
                text: '行情面板',
                path: '/panel'
            },
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

const toolList: ToolList = [
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
        tag: '访问量',
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
        tag: '交易额',
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

const pieChartList: any = [
    {
        header: '转化率',
        id: 'piechart1',
        option: {
            title: {
                text: '圆环图的例子',
                left: 'center',
                top: 'center'
            },
            legend: {
                orient: 'horizontal',
                x: 'center',
                y: '335',
                data: ['A', 'B', 'C']
            },
            series: [
                {
                    type: 'pie',
                    data: [
                        {
                            value: 335,
                            name: 'A'
                        },
                        {
                            value: 234,
                            name: 'B'
                        },
                        {
                            value: 1548,
                            name: 'C'
                        }
                    ],
                    radius: ['40%', '70%']
                }
            ]
        }
    },
    {
        header: '转化率',
        id: 'piechart2',

        option: {
            title: {
                text: '圆环图的例子',
                left: 'center',
                top: 'center'
            },
            series: [
                {
                    type: 'pie',
                    data: [
                        {
                            value: 335,
                            name: 'A'
                        },
                        {
                            value: 234,
                            name: 'B'
                        },
                        {
                            value: 1548,
                            name: 'C'
                        }
                    ],
                    radius: ['40%', '70%']
                }
            ]
        }
    },
    {
        header: '转化率',
        id: 'piechart3',

        option: {
            legend: {
                orient: 'horizontal',
                x: 'center',
                y: '335',
                data: ['A', 'B', 'C', 'D', 'E']
            },
            series: [
                {
                    type: 'pie',
                    radius: ['50%', '70%'],
                    avoidLabelOverlap: true,
                    label: {
                        show: false,
                        position: 'center'
                    },
                    labelLine: {
                        show: false
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '30',
                            fontWeight: 'bold'
                        }
                    },
                    data: [
                        { value: 335, name: 'A' },
                        { value: 310, name: 'B' },
                        { value: 234, name: 'C' },
                        { value: 135, name: 'D' },
                        { value: 1548, name: 'E' }
                    ]
                }
            ]
        }
    },
]
export { layOutList, toolList, dataList, chartList, pieChartList }