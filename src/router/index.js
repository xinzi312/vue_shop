import Vue from 'vue'
import VueRouter from 'vue-router'

import login from '../components/Login.vue'
import home from '../components/Home.vue'
import welcome from '../components/Welcome.vue'
import users from '../components/user/Users.vue'
import rights from '../components/power/Rights.vue'
import roles from '../components/power/Roles.vue'
import cates from '../components/goods/Cates.vue'
import params from '../components/goods/Params.vue'
import list from '../components/goods/List.vue'
import add from '../components/goods/Add.vue'
import order from '../components/order/Order.vue'
import report from '../components/report/Report.vue'

Vue.use(VueRouter)

const router= new VueRouter({
  routes: [
     {path:'/',redirect:"/login"},
     {path:"/login",component:login},
     {path:"/home",
      component:home,
      // 重定向到所嵌套的子组件
      redirect:'/Welcome',
      children:[
        {path:'/welcome',component:welcome},
        {path:'/users',component:users},
        {path:'/rights',component:rights},
        {path:'/roles',component:roles},
        {path:'/categories',component:cates},
        {path:'/params',component:params},
        {path:'/goods',component:list},
        {path:'/goods/add',component:add},
        {path:'/orders',component:order},
        {path:'/reports',component:report}
      ] }

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