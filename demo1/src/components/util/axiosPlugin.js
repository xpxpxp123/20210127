import Axios from "axios";

const axiosPlugin = {
    createHttp(){
        const $http = Axios.create();
        $http.defaults.timeout = 100000;//最大响应时间

        // //请求拦截器,判断请求配置对象config的参数对象params里有没有名为token的参数
        // $http.interceptors.request.use(function(config){
        //     config.baseURL='http://localhost:8080/xpxp';
        //     if(config['params'] ){//有params参数,config为json，这里是数组写法，一样的效果
        //         config.params['token']= (Math.random()*(2000-1000)+1000);
        //     }else{
        //         config['params']={'token':"hahaha123456"};
        //     }
        //     return config;
        // },function(){
        //     //异常
        // });


        return $http;
    },

    
    install(Vue){//保证可以在main.js里用Vue.use(调用)
        Vue.prototype.$http = this.createHttp();
    }
    
}
export default axiosPlugin;