import types from '../types.js'
import Vue from 'vue'
const vue = new Vue();

const state = {
    goods:[],
    goods_foods:[],
    cart:{
        totolPrice:0,
        commodity:[],
    },
}

const getters = {
    goods(state){
        return state.goods;
    },
    goods_foods(state){
        return state.goods_foods;
    },
    cart(state){
        return state.cart;
    },
}

const actions = {
    createGoods({commit,state}){
        vue.$http.get('/goods').then(resp=>{
            if(resp.data.errno==0){
                commit(types.CREATEGOODS,resp.data.data);
            }else{
                console.log(resp);
            }
        }).catch((error)=>{
            console.log(error);
            console.log('222');
            
        })
    },
    getFoods({commit,state},val){
        state.goods.forEach((element,index) => {
            if(element.name==val){
                commit(types.SETTYPESHOP,element.foods);//传该商品介绍
                return;
            }
        });
    }
}

const mutations = {
    [types.CREATEGOODS](state,data){
        state.goods = data;
        
    },
    [types.SETTYPESHOP](state,data){
        
        
    }
}

export default{
    state,
    getters,
    actions,
    mutations
}