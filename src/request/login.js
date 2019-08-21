import http from '@/api/http.js'
import {api} from '@/api/config'
export function Login(data){
    return http({
        url: api + '/login',
        data:data,
        method: 'post',
    })  
}
export function Logout(data){
    return http({
        url: api + '/login',
        method: 'get',
    })  
}