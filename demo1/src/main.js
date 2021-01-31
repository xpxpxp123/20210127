// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import $ from 'jquery'
import router from './router/index.js'
import store from './store/index.js'
import eleui, { Form } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axiosPlugin from './components/util/axiosPlugin'
import echarts from 'echarts'


Vue.use($);
Vue.use(eleui);
Vue.use(axiosPlugin);//全局注入axios到Vue的原型链上$http
Vue.prototype.$echarts = echarts;

Vue.config.productionTip = false;//开发消息


//路由导航守卫,实际可用封装axios的方式来替代,发送请求时验证token是否过期。
router.beforeEach((to, from ,next) => {
  const token = store.getters['user/token'];
 
      if(token){ //登录后会有token
     
          if(Object.keys(from.query).length === 0){
              next()
          }else{
              let redirect = from.query.redirect
              if(to.path === redirect){
                  next()
              }else{
                  next({path:redirect})
              }
          }
      }else{
          if(to.path==="/login" || to.path==="/toReg"){
              next()
          }else{
            next({
                path:"/login",
              
            })
        }
          
      }
  
  
})


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
