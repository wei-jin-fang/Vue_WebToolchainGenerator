import { createRouter, createWebHistory } from 'vue-router'
import {useStore} from "@/stores";



import oneone from '@/pages/Chapter1/1.1.vue'
import onetwo from '@/pages/Chapter1/1.2.vue'
import threeone from '@/pages/Chapter3/3.1.vue'
import threetwo from '@/pages/Chapter3/3.2.vue'
import threethree from '@/pages/Chapter3/3.3.vue'
import threefour from '@/pages/Chapter3/3.4.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    
    {
      path: '/',
      name: 'index',
      component: () => import('@/components/index/admin.vue'),
      children:[
      {
        path:"/menu/oneone/information",
        component:oneone,
        meta:{
            title:"oneone"
        }, 
    },{
      path:"/menu/onetwo/information",
      component:onetwo,
      meta:{
          title:"onetwo"
      }, 
    },{
      path:"/menu/onetwo/information",
      component:onetwo,
      meta:{
          title:"onetwo"
      }, 
    },{
      path:"/menu/threeone",
      component:threeone,
      meta:{
          title:"threeone"
      }, 
    },{
      path:"/menu/threetwo",
      component:threetwo,
      meta:{
          title:"threetwo"
      }, 
    },{
      path:"/menu/threethree",
      component:threethree,
      meta:{
          title:"threethree"
      }, 
    },{
      path:"/menu/threefour",
      component:threefour,
      meta:{
          title:"threefour"
      }, 
    }
































]








    }
    ,
    // 这里捕获所有未定义的路由，重定向到 404 页面
    {
      path: '/:pathMatch(.*)*', // 捕获所有未匹配的路由
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue') // 404 页面组件
    }
  ]
})


// beforeEach 路由守卫（router.beforeEach）的作用是在每次路由切换之前拦截路由
// router.beforeEach((to, from, next) => {
//   const store = useStore(); // 获取 Pinia store，用于检查用户的登录状态

//   // 检查用户是否已登录，并且目标路由是否是 welcome 页面的子页面（登录、注册、忘记密码）
//   if (store.auth.user != null && to.name.startsWith('welcome-')) {
//     next('/index'); // 如果用户已登录，且目标是 welcome 页面相关路由，则重定向到 /index
//   } 
//   // 如果用户未登录并且试图访问 /index 开头的路由
//   else if (store.auth.user == null && to.fullPath.startsWith('/index')) {
//     next('/'); // 重定向到登录页面（/），因为用户未登录
//   }
//   // 如果没有匹配的路由（通常意味着 404）
//   else if (to.matched.length === 0) {
//     next('/index'); // 重定向到 /index 页面
//   }
//   // 正常情况下允许导航到目标路由
//   else {
//     next(); // 继续导航，允许用户访问该路由
//   }
// });




export default router
