import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

//导入全局样式表
import './assets/css/global.css'

//导入字体图标样式
import './assets/fonts/iconfont.css'

import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table',TreeTable)

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
Vue.use(VueQuillEditor)
// 富文本编辑器对应的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css'

//全局配置axios
import axios from 'axios'
// import { config } from 'vue/types/umd'
//设置请求根路径
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
//设置拦截器
axios.interceptors.request.use(config=>{
  // console.log(config)
  //为请求对象 添加token验证的 Authorization字段
  //Authorization字段的值为曾今保存在seeionStorage的token值
  config.headers.Authorization=window.sessionStorage.getItem('token')
  //在最后必须return config
  return config
})
Vue.prototype.$http=axios

Vue.config.productionTip = false

Vue.filter('dataFormat',function(originVal){
  const dt=new Date(originVal)

  const y=dt.getFullYear()
  const m=(dt.getMonth()+1+'').padStart(2,'0')
  const d=(dt.getDate()+'').padStart(2,'0')

  const hh=(dt.getHours()+'').padStart(2,'0')
  const mm=(dt.getMinutes()+'').padStart(2,'0')
  const ss=(dt.getSeconds()+'').padStart(2,'0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
