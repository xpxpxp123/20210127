<template>
  <div class="totol" > 
   
    <div class="banner"></div>
    <div id="app" >
          <v-header></v-header>
          <div class="mainbody">
              <div class="tab">
                <div class="tab-item"><router-link to="/goods">商品</router-link></div>
                <div class="tab-item"><router-link to="/ratings">购物车</router-link></div>
                <div class="tab-item"><router-link to="/userMain">个人</router-link></div>
              </div>
              <router-view></router-view>
          </div>
      </div>
  </div>

 
</template>

<script>




import header from '@/components/header/header'
import {mapGetters,mapActions} from 'vuex'

export default {
  name: 'App',
  components:{
    "v-header":header
  },
  methods:{
    ...mapGetters([
      
    ])
  }
}



</script>

<style lang='less' scoped>
.totol{
  overflow-x: hidden;
  overflow-y: auto;
  width: 100%;
   /*隐藏滚动条，当IE下溢出，仍然可以滚动*/
    -ms-overflow-style:none;
    /*火狐下隐藏滚动条*/
    overflow:-moz-scrollbars-none;
 
}
.banner{
  // height: 140px;
  // background: red;
  // display: flex;
  // width: 100%;
}


#app {
  visibility: initial;
  
 
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  .mainbody{
    height:100%;
    position: relative;
  }
  .mainbody .tab{
    width: 100%;
    position: relative;
    display: flex;
    @height:50px;
   height: @height;
    .tab-item{
      flex: 1;
      line-height: @height;
      text-align: center;
      &>a{
        display: block;
        &.active{
          color: chocolate;
        }
      }
    }
    
  }
  &::-webkit-scrollbar{
        display:none;
  }    
  
} 
 
   


</style>
