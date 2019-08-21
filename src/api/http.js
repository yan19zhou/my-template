import axios from 'axios'
import qs from 'qs'
import store from '@/store'
import router from '@/router'
import { ERR_OK } from '@/api/config'
import {
    Message
} from 'element-ui';
const service = axios.create({
        baseURL: process.env.API_HOST, // api的base_url
        // withCredentials: false, // 允许携带cookie
        timeout: 6000, // request timeout
        // headers: { 'Content-Type': 'application/json;charset=UTF-8' }
        // headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        // headers: {'Content-Type': 'multipart/form-data'}
    })


// 隐藏loading
export function hideLoading() {
    setTimeout(store.commit("SET_LOADING", false, ""), 600);
}
// 弹窗包装
export function message(message, type, showClose) {
    Message({
        showClose: showClose || true,
        message: message,
        type: type
    });
}

// 请求拦截
service.interceptors.request.use(config => {
    const token = store.state.token;
        token && (config.headers.Authorization = token);
        return config
    }, error => {
        // Do something with request error
        return Promise.error(err)
    })
    // 接口状态列表：
    // 1 操作成功
    // -1 操作失败
    // -2 接口参数Sign错误
    // -3 非法请求
    // -4 接口参数数据验证失败
    // -5 接口参数AppToken过期或不存在
    // -6 重复请求
    // -7 用户无权限访问
    // -8 App无权限访问
    // -9 用户未登录
    // 返回拦截
service.interceptors.response.use(
    response => {
        const res = response.data
        hideLoading()
        if (res.status !== 1 && res.msg) {
            message(res.msg, "error")
            if (res.status === -5 || res.status === -6 || res.status === -9) {
                router.push({ name: "login" })
            }
            return Promise.reject(res.msg)
        } else {
            return res.data
        }


    },
    error => {
        hideLoading()
        store.commit('UPDATE_LOADING', false)
        if (error.response) {
            let res = error.response.status;
            console.log(error.response)
            switch (res) {
                case 404:
                    message("请求类型错误或未找到接口！", "error")
                    break;

                default:
                    break;
            }
        } else {
            // message("网络超时异常！", "error")
            throw new Error("网络异常！", error);
        }
        return Promise.reject(error)
    })

export default service