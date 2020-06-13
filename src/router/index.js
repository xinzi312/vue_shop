import Vue from 'vue'
import VueRouter from 'vue-router'

import login from '../components/Login.vue'
import home from '../components/Home.vue'


Vue.use(VueRouter)

const router= new VueRouter({
  routes: [
     {path:'/',redirect:"/login"},
    {path:"/login",component:login},
    {path:"/home",component:home}
  ]
})

//挂载路由导航守卫
router.beforeEach((to,from,next)=>{
  //to 将要访问的路径
  //from 代表从那个路径跳转而来
  //next 是一个函数 表示放行
  //next() 放行 next('/login') 强制跳转
  if(to.path==='/login') return next();//如果访问的是登录页那么直接放行
  //获取token 根据是否有token值来判断知否已经登录
  const tokenStr=window.sessionStorage.getItem('token')
  //如果没有token则强制跳转登录页
  if(!tokenStr) return next('/login')
  next()
})

export default router