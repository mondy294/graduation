import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

import ElementPlus from 'element-plus'
import 'animate.css'

import 'element-plus/theme-chalk/el-loading.css';
import 'element-plus/theme-chalk/el-message.css';

// 数字自增
import AnimatedNumber from 'animated-number-vue3'

// 引入 echarts
import * as echarts from 'echarts'

const app = createApp(App)
// 全局挂载 echarts
app.config.globalProperties.$echarts = echarts
app.use(router).use(ElementPlus).use(AnimatedNumber)

app.mount('#app')
