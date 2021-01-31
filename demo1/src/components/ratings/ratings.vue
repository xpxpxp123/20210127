<template>
  <div class="ratings">
        <div class="topbg"></div>
         
        <div class="shopcard">
            <div class="head">{{seller.name}}<span>美团专送</span></div>
            <div class="the_cart">
             <ul>
                 <li v-for="(item,index) in  cart.commodity" class="food">
                     <div class="itemcart">
                        <img :src="item.img" alt="">
                        <div class="detail">
                            <div>名称：{{item.name}}</div>
                            <div>单价:{{item.price}}</div>
                            <div>数量：{{item.num}}</div>
                            <div>总价：{{item.sumPrice}}</div>
                        </div>
                     </div>
                     
                 </li>
             </ul>
         </div>
        </div>
         
    <div class="footer">
          <span class="cart_totolprice">合计: {{cart.totolPrice}}</span>
          <div class="calculator"><span class="toCalcu" @click="pay">付款</span></div>
      </div>
     
  </div>
</template>

<script>
//   cart:{
              //     totolPrice:0,
              //     commodity:[
              //             {
                            // name:'',   //这里以name为主键
                              //     price:0,
                              //     sumPrice:0,        
                              //     num:0,
                              //     img:'',
              //             }
              //        ],
              //   },
import {mapGetters,mapActions,mapMutations} from 'vuex'
import types from '../../store/types.js'

export default {
    
    mounted(){
        
    },
   
    
    computed:{
        ...mapGetters([
            "seller"
        ]),
        ...mapGetters('user',[
            "cart",
        ])

    },
    methods:{
        ...mapMutations('user',{
                paycart:types.UPDATECART,
                getcarthistory:types.UPDATECARTHISTORY
            },
        ),
        pay(){  //接收到了选择页的商品，去后台取该用户的旧购物车合并展示，传新购物车，登录用户
            
            this.$http.get('/pay',{ //没有token就为该token新建购物车,有token就将该token的数据加入到老cart
                params:{
                    "userName":this.$store.getters['user/user'].userName, //index.js -> state user
                    "cart":this.cart
                }
            }).then(resp=>{
                if(resp.data.errno==1){//成功
                    this.paycart(resp.data.cart);//vuex购物车也清空
                    this.getcarthistory(resp.data.orders);//vuex订单历史记录更新

                    this.$message({
                          message: '结算成功',
                          type: 'success'
                    });
                }else{//没传用户名
                    alert("请先登录")
                    console.log(22);
                }
            }).catch((error)=>{
                console.log(error);
            });

            
        }
    }
}
</script>

<style lang="less" scoped>
    .ratings{
        /*隐藏滚动条，当IE下溢出，仍然可以滚动*/
        -ms-overflow-style:none;
        /*火狐下隐藏滚动条*/
        overflow:-moz-scrollbars-none;
        
        position: relative;
        width: 100vw;
        background: rgb(223, 218, 206);
        display: flex;
        justify-content: center;
        padding-bottom: 100px;
        & .topbg{
            width: 100%;
            height: 200px;
            background: url('./../../../static/img/back.jpg') repeat-x;
            position: absolute;
            z-index: 1;

        }
        & .shopcard{
            margin-top: 10px;
            background: white;
            width: 90vw;
            padding: 10px;
            position: relative;
            z-index: 10;
            border-radius: 10px;
          
         
            & .head{
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: space-between;
                height: 80px;
                border-bottom: 1px solid rgb(143, 139, 139);
                & span{
                    background: rgb(231, 187, 66);
                    text-align: center;
                    display: inline-block;
                    position: relative;
                    right: 0;
                    width: 80px;
                    height: 20px;
                    line-height: 20px;
                }
            }
            & .food{
                padding-top: 10px;
                padding-bottom: 10px;
                border-bottom: 1px solid darkgrey;
            }
            & .itemcart{
                
                
                width: 100%;
                display: flex;
                justify-content: space-around;
                & img{
                    width: 100px;
                    height: 100px;
                }
                & .detail{
                    padding-top: 20px;
                    font-size: 14px;
                    width: 40%;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
            }
        }


        .footer{
            position: fixed;
            z-index: 100;
            bottom: 0;
            height: 50px;
            display: flex;
            background: #3b3b3c;
            width: 100%;

             & .cart_totolprice{
                position: relative;
                margin-top: 20px;
                border-radius: 10px 10px;
                width: 100px;
                height: 20px;
                font-size: 16px;
                color: white;
                background: rgb(187, 52, 28);
                line-height: 20px;
            }
            & i{
                display: inline-block;
                width: 50px;
                height: 100%;
                font-size: 40px;
                line-height: 50px;
                text-align: center;
                color: white;
                position: relative;
                top: -10px;
                border-radius: 50%;
                background-color: rgb(212, 167, 17);
                margin-left: 20px;
            }
           
            & .calculator{
                height: 100%;
                width: 100px;
                position: absolute;
                right: 0;
                background-color: rgb(172, 132, 3);
                font-family: "微软雅黑";
                text-align: center;
                line-height: 50px;
                & .toCalcu{
                    text-decoration: none;
                    color: white;
                }
            }
        }
        
    }
</style>