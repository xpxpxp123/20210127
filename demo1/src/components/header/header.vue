<template>
  <div class="header">
    <div class="header-mian">
      {{seller.name}}
      <img :src="seller.avatar" :alt="seller.name"  @click="setRightside">
    </div>
    

    <detail></detail>
  </div>
</template>

<script>
import {mapGetters,mapActions} from 'vuex'
import detail from '../details/detail'

export default {
    
    created(){
      this.$store.dispatch('getSeller');//调用action方法访问网站给seller.js 里state里的seller赋值
    },
    computed:{
        ...mapGetters([
          'seller'
        ]),
    },
    methods:{
      setRightside(){
        this.$store.dispatch('setRightside')
      }
    },
    components:{
      detail
    }
}
</script>

<style lang="less"  scoped>
  .header{
    
    width: 100%;
		height: 134px;
		background-color: rgba(8,112,27,0.1);
    font-size: 14px;
    .header-mian{
      z-index: 1;
      opacity: 0.7;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
    }
		img{
			width: 64px;
			height:64px;
			border-radius: 2px;
    }
    
	}
</style>