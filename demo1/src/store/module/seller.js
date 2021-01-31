import types from '../types.js'
import Vue from 'vue'
const vue = new Vue();

const state = {
    seller:{},
    rightside:false
}

const getters = {
    seller(state){
        return state.seller;
    },
    rightside(state){
        return state.rightside;
    }
}

const actions = {
    getSeller({commit}){//访问网站取得json里的seller给state里赋值
        
        
        vue.$http.get('/seller').then((resp)=>{
            if(resp.data.errno==0){
                commit(types.GETSELLER,resp.data.data);
            }else{
                console.log(resp);
            }
        }).catch(()=>{
            return '访问失败'
        })
    },
    setRightside({commit,state}){
        commit(types.SETRIGHTSIDE);
    },
    hideRightside({commit}){
        commit(types.HIDERIGHTSIDE);
    }
}

const mutations = {
    [types.GETSELLER](state,data){
        state.seller = data;
    },
    [types.SETRIGHTSIDE](state){
        state.rightside = true;
    },
    [types.HIDERIGHTSIDE](state){
        state.rightside = false;
    }
}

export default{
    state,
    getters,
    actions,
    mutations
}