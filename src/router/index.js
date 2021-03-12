import Vue from 'vue'
import VueRouter from 'vue-router'

// 导入 router.js 因为是 有名导出，所以在导入时 需要解构
import {routes} from './router.js'

Vue.use(VueRouter)

// const routes = [
//   {
//     path: '/',
//     name: 'Home',
//     component: Home,
//     // 懒加载写法
//     // component: ()=>import("路径")
//   },
// ]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})
export default router
