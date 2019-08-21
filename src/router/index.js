import Vue from 'vue'
import Router from 'vue-router'
import {getStore} from '@/common/util.js'

const _import = (file) => import('@/pages/' + file + '.vue')

Vue.use(Router)

const router = new Router({
    mode: 'history',
    routes: [
      {
        path: '/',
        name: 'Login',
        component: () => _import('login/login')
      }
    ]
  })

router.beforeEach((to, from, next) => {

  if (!getStore('userToken')) {
      if (!to.meta.requireAuth) {
          // true 就是不需要路由的  false要验证
          next()
      } else {
          
          next({
              // redirect: to.fullPath // 将跳转的路由path作为参数，登录成功后跳转到该路由
              redirect: '/login' // 将跳转的路由path作为参数，登录成功后跳转到该路由
          })
      }
      // 未登录的状态
  } else {
      // store.commit('SET_REDIRECT', '/')
      // false 代表不是黑名单。true代表是
      // 是黑名单的话不能访问即时通讯。购物车下单。采购。销售。询价。报价。客服中心都不能操作
      // console.log(getStore('hmd'), to.meta.hmd)
      // 如果是admin用户不给访问人员管理页面
      // if (getStore('hmd') === true && to.meta.hmd === true) {
      //     Alert({
      //         title: '',
      //         content: '黑名单用户不能访问！',
      //         close: '取消',
      //         submit: '确定',
      //         flag: true
      //     }).then(res => {
      //         console.log(res)
      //     })
      // } else {
      next()
          // }
  }
})
export default router