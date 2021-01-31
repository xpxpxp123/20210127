import types from '../types.js'
import Vue from 'vue'


const state = {
    
    the_cart:null,

}

const getters = {
    the_token(state){
        return state.the_token;
    },
    the_cart(state){
        return state.the_cart;
    }
}

const actions = {
    
    
}

const mutations = {
    [types.CREATECART](state,data){
        state.the_cart= data;
        console.log(data);
        
    },
    

}

export default{

    state,
    getters,
    actions,
    mutations
}