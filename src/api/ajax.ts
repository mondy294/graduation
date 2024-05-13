import axios from 'axios'
import qs from 'qs'
import { ElMessage } from 'element-plus'
import { PORT } from '../HttpConfig'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { error } from 'console'

let token = localStorage.getItem('token')

const requests = axios.create({
    baseURL: `${PORT}api`,
    timeout: 5000,
    headers: {
        'Authorization': token,
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})
// 参数格式化
requests.defaults.transformRequest = (data, headers) => {
    const contentType = headers['Content-Type'];
    if (contentType === "application/x-www-form-urlencoded") return qs.stringify(data);

    return data;
};

// 响应拦截器
requests.interceptors.response.use((res: AxiosResponse) => {
    if (res.data.status == 1) {
        ElMessage.error(res.data.message)
    }
    return res
}, error => {
    ElMessage.error(error)
})



export default requests