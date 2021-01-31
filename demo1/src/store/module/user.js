import types from '../types.js'
import Vue from 'vue'
const vue = new Vue();

const state = {
    token:null,
    user:null,
    hasName:true,//用户名校验
    message:'',
    cart:null,
    carthistory:null,
}

const getters = {
    token(state){
        return state.token;
    },
    user(state){
        return state.user;
    },
    hasName(state){
        return state.hasName;
    },
    message(state){
        return state.message;
    },
    cart(state){
        return state.cart;
    },
    carthistory(state){
        return state.carthistory;
    },
}

const actions = {
    login({commit,state},val){  
        //点击登录后将val封装为user,检查cookie有没有没过期的token,有就取得并给state,提交，没有就生成token存入cookie
        
        let the_token =null;
        let the_userName =val.userName;
        let the_userPass =val.userPass;
        // if (document.cookie.length > 0) {
        //     var arr = document.cookie.split(';'); //这里显示的格式需要切割一下自己可输出看下
        //     for (var i = 0; i < arr.length; i++) {
        //         var arr2 = arr[i].split('='); //再次切割
        //         if(arr2[0] == 'token'){
        //             the_token = arr2[1];
        //         }else if(arr2[0] == 'userName'){
        //             the_userName = arr2[1];
        //         }else if(arr2[0] == 'userPass'){
        //             the_userPass = arr2[1];
        //         }
        //     }
        // }

        
        
        //登录后往cookie存token和username ,userpass,并传递值
        //登录判断用户名和密码，从data.json里取  userlist  {userName userPass}
        vue.$http.post('/login',val,{
            //转换函数传params
            transformRequest:[ 
                function(data) {
                    let params='';
                    for(var i in data){
                        params += i + '='+data[i]+'&';
                    }
                    return params;
                }
            ]
        }).then(resp=>{
            if(resp.data.errno==0){ //登录成功，返回该账户的购物车
                

                
                //设置cookie token到cookie
                var exdate = new Date(); //获取时间
                exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * 7); //保存的天数 7
                    //字符串拼接cookie
                the_token = parseInt((Math.random() * (200000 - 100000) + 100000))+''+exdate.getTime();
                window.document.cookie = "token" + "=" + the_token + ";path=/;expires=" + exdate.toGMTString();
                window.document.cookie = "userName" + "=" + the_userName + ";path=/;expires=" + exdate.toGMTString();
                window.document.cookie = "userPass" + "=" + the_userPass + ";path=/;expires=" + exdate.toGMTString();
                
                commit(types.LOGINOK,{"cart":resp.data.data,"token":the_token,"user":val});

            }else{
                
                
            }
        }).catch(resp=>{
            console.log(resp);
        });

    },
    //检查用户名
    checkuser({commit,state},val){
        vue.$http.get('/checkuser',{
            params:{
                checkName:val,
            }
        }).then(resp=>{
            if(resp.data.errno==1){//不存在该用户名
                commit(types.HASNAME,false);
            }else{
                commit(types.HASNAME,true);
            }
        }).catch(resp=>{
            commit(types.HASNAME,true);
        });
    },
    //注册
    register({commit,state},form){
        console.log(form);
        vue.$http.post('/register',form,{
            //转换函数传params
            transformRequest:[ 
                function(data) {
                    let params='';
                    for(var i in data){
                        params += i +'='+ data[i]+'&';
                    }
                    return params;
                }
            ]
        }).then(resp=>{

        }).catch(resp=>{

        });
    }
}

const mutations = {
    [types.HASNAME](state,data){
        state.hasName = data;
    },
    [types.LOGINOK](state,data){
        state.cart = data.cart;
        state.token = data.token;
        state.user = data.user;
    },
    [types.UPDATECART](state,data){
        state.cart = data;
    },
    [types.UPDATECARTHISTORY](state,data){
        state.carthistory = data;
    }
}

export default{
    namespaced:true,
    state,
    getters,
    actions,
    mutations
}