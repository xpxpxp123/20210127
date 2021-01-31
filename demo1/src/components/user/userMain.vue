<template>
  <div class="usermain">
    <div class="order" @click="tocarthistory">
        <span>历史订单</span>
        <i class="el-icon-document"></i>
    </div>
  </div>
</template>

<script>
import {mapGetters,mapActions} from 'vuex'
import types from '../../store/types.js'

export default {
    computed:{
        
    },
    methods:{
        tocarthistory(){ //发送ajax获取carthistory赋值给user.carthistory并跳转
            this.$http.get('/getcarthistory',{
                params:{
                    "userName":this.$store.getters['user/user'].userName,
                }
            }).then(resp=>{ //commitcarthistory给user.carthistory
                if(resp.data.errno==0){//
                    this.$store.commit(`user/${types.UPDATECARTHISTORY}`,resp.data.data);

                    this.$router.push({name:"carthistory"});
                }else{//没传用户名,没有历史订单
                    this.$message.error('该用户没有过历史订单');
                }
            }).catch((error)=>{
                this.$message.error('服务出错');
                console.log(error);
            });

            
        }
    }
}
</script>

<style lang="less" scoped>
    .usermain{
        width: 100vw;
        display: flex;
        justify-content: center;
        & .order{
            width: 80vw;
            height: 40px;
            font-size: 14px;
            line-height: 40px;
            border: 1px solid skyblue;
            box-shadow: 0 0 5px darkgrey;
            border-radius: 5px;
            text-align: center;
            color: black;
            display: flex;
            justify-content: space-around;
            & i{
                font-size: 20px;
                line-height: 40px;
            }
        }
    }
</style>