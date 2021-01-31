import Vue from 'vue'
import Vuex from 'vuex'

import getters from './getters'
import actions from './actions'
import seller from './module/seller'
import goods from './module/goods'
import ratings from './module/ratings'
import user from './module/user'

Vue.use(Vuex);



export default new Vuex.Store({
    
    getters,
    actions,
    modules:{
        seller,
        goods,
        ratings,
        user,
    }
})