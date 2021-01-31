<template>
  <div class="goods">
      <div class="goods-menu">
          <ul>
                <li v-for="(v,index) in goods" @click="getFoods(v.name,index)" v-bind:class="index==0?'active':''">
                  <a href="javascript:;">{{v.name}}</a><span class="typeFoods_Num">0</span>
                </li>
          </ul>
      </div>
      <div class="goods-body" @scroll="hidebanner">
          <div v-for="(v,index) in goods">
            <h3>{{v.name}}</h3>
            <ul class="foods_ul">
                <li v-for="(foodItem,foods_index) in v.foods">
                    <div class="imgd"><img :src="foodItem.image" /></div>
                    <div class="foodsText">
                        <span>{{foodItem.name}}</span>
                        <span ><label>{{foodItem.price}}</label>元</span>
                    </div>
                    <div class="setNum">
                            <button id="delNum"  @click.prevent="reduceNum(index,foods_index,foodItem.price)">-</button>
                                <input 
                                class="Num"
                                type="number"
                                disabled="false"
                                placeholder=0
                                clearable/>
                            <button id="addNum" @click.prevent="addNum(index,foods_index,foodItem.price)">+</button>
                    </div>
                </li>
            </ul>
          </div>
          
      </div>
      <div class="footer">
          <i class="el-icon-shopping-cart-full"></i>
          <span class="cart_totolprice">￥ {{cart.totolPrice}}</span>
          <div class="calculator"><span class="toCalcu" @click="sendcart">立即结算</span></div>
      </div>
  </div>
</template>

<script>

import $ from 'jquery'
import {mapGetters,mapActions} from 'vuex'

export default {
    data(){
        return {
            curentGoodsIndex:0,    //当前第几个商品类
            initFoodsType_OffsetTop:[],  //初始右侧商品类 offsetTop
            // cart:{
            //     totolPrice:0,
            //     commodity:[],
            // },
        }
        
    },
    watch:{
        goods:{
            handler:function(newv){ //取得数据后，初始化initFoodsType_OffsetTop
                this.init_initFoodsType_OffsetTop();
            },
            immediate:true
        },

        // $route:{
        //     handler:function(newv,oldv){
        //         //vue实例是化 这个操作需要使用随数据改变而改变的DOM结构
        //         this.$nextTick(function(){
        //             console.log($('.goods-body>div'));
        //                 ////初始记录每种商品类的offsetTop
        //                 for(let i=0;i<this.goods.length;i++){  //几种类
        //                     this.initFoodsType_OffsetTop[i] =   document.querySelectorAll('.goods-body>div')[i].offsetTop;
        //                 }  
        //             console.log(this.initFoodsType_OffsetTop);
                        
        //         })
        //     },
        //     immediate:true
        // }

        the_cart:{
            handler:function(newv){ //根据购物车渲染Dom 
                this.renderCart();
            },
            deep: true,   //这是个对象，监测对象属性改变
            
        },
        $route:{
            handler:function(newv){ //根据购物车渲染Dom 
            
                this.$nextTick(function(){
                    this.renderCart();
                })
            },
            immediate:true
        }

    },
    created(){
        this.$store.dispatch('createGoods');
        
    },
    mounted(){
      
    },
    computed:{
        ...mapGetters([
            'goods',
        ]),
        ...mapGetters('user',[
            "cart"
        ])
    },
    methods:{
        renderCart(){//DOM渲染
            
            let allSpan =   $('.foodsText>span:first-child');
         
            let arrFoodsType = new Array(this.goods.length);//装类商品数
            
            
            for(let q=0;q<arrFoodsType.length;q++){//赋初值
                arrFoodsType[q]=0;
            }

            let typeIndex = 0;
            for(let i=0;i<allSpan.length;i++){
                for(let j=0;j<this.cart.commodity.length;j++){
                    
                    
                    if(allSpan.eq(i).text()==this.cart.commodity[j].name){
                       
                        allSpan.eq(i).parent(".foodsText").next().children(`input`)[0].value=this.cart.commodity[j].num;
                        typeIndex = allSpan.eq(i).parents(".foods_ul").parent('div').index();//当前是第几类商品
                        //该类商品数量更新
                        
                        if(arrFoodsType[typeIndex]==0){
                            arrFoodsType[typeIndex] = this.cart.commodity[j].num;
                        }else{
                            arrFoodsType[typeIndex] += this.cart.commodity[j].num;
                        }
                        
                        
                        
                        //  console.log($(`.goods-menu>ul>li:eq(${typeIndex})>span`)[0].innerHTML);

                         
                    }


                }
                
            }
            for(let q=0;q<arrFoodsType.length;q++){//赋初值
                   $(`.goods-menu>ul>li:eq(${q})>span`)[0].innerHTML =  arrFoodsType[q];
                   if(arrFoodsType[q]!=0){
                       $(`.goods-menu>ul>li:eq(${q})>span`)[0].style.display = 'block';
                   }else{
                       $(`.goods-menu>ul>li:eq(${q})>span`)[0].style.display = 'none';
                   }
            }
        },
        sendcart(){//路由跳转,更新存购物车
            
            this.$http.get('/ratings',{ 
                params:{
                    "userName":this.$store.getters['user/user'].userName, //index.js -> state user
                    "cart":this.cart
                }
            }).then(resp=>{
                if(resp.data.errno==1){//购物车更新成功
                //    this.$store.commit(types.UPDATECART,resp.data.data);
                    this.$router.push({name:'ratings'});
                }else{//没传用户名
                    console.log(22);
                }
            }).catch((error)=>{
                console.log(error);
            });

            

        },
        settlement(){//结算

        },
        init_initFoodsType_OffsetTop(){
            //vue实例是化 这个操作需要使用随数据改变而改变的DOM结构
    
            
            this.$nextTick(function(){
              
                    ////初始记录每种商品类的offsetTop
                    for(let i=0;i<this.goods.length;i++){  //几种类
                        this.initFoodsType_OffsetTop[i] =   document.querySelectorAll('.goods-body>div')[i].offsetTop;
                    }  
                    
                    
                    
            })
        },
        getFoods(val,index){  //点击左侧，scrollTop到对饮div
            
           
            // requestAnimationFrame(this.scrollBar.bind(this,index));//1px运动太慢舍弃

           //对应类商品所在offsetTOP,scroll过去
            
            let offsetTop = this.initFoodsType_OffsetTop[index];
          
           
            
            $('.goods-body').eq(0).stop().animate({
                'scrollTop':offsetTop
            },1000);



            this.curentGoodsIndex = index;//设置类型index
            let allli = document.querySelectorAll('.goods-menu li');
           
            for(let i=0;i<allli.length;i++){
                allli[i].classList.remove('active');
            }
            allli[index].classList.add('active');
        },
        // scrollBar(index){//导航条滚动,运动太慢了
        //     let toDiv = document.querySelectorAll('.goods-body>div')[index];
        //     let offsetTop = toDiv.offsetTop;
        //     let goodsbody = document.querySelector('.goods-body');
        //     let toScroll = goodsbody.scrollTop;
     
        //     if( offsetTop-toScroll >0){ //往下滑动
        //         goodsbody.scrollTop +=1;
        //         requestAnimationFrame(this.scrollBar.bind(this,index));
        //     }else if(offsetTop-toScroll <0){
        //         goodsbody.scrollTop -=1;
        //         requestAnimationFrame(this.scrollBar.bind(this,index));
        //     }else{
        //         return;
        //     }
        // },
        hidebanner(){//右侧滑动时,改变整体的scrollTop = 右侧第一个商品类的scrollTop
            
            //console.log(this.initFoodsType_OffsetTop);//初始商品类的offsetTop
            
            for(let i=0;i<this.initFoodsType_OffsetTop.length;i++){
                if(document.querySelector('.goods-body').scrollTop +100  > this.initFoodsType_OffsetTop[i] ){
                    this.curentGoodsIndex = i;//设置类型index
                    let allli = document.querySelectorAll('.goods-menu li');
                
                    for(let j=0;j<allli.length;j++){
                        allli[j].classList.remove('active');
                    }
                    allli[i].classList.add('active');
                }
            }
            
            

             document.querySelector('#app').scrollTop=document.querySelectorAll('.goods-body')[0].scrollTop;
             document.querySelectorAll('.totol')[0].scrollTop =document.querySelectorAll('.goods-body')[0].scrollTop;
            
            
        },
        reduceNum(foodstype_Index,foods_Index,foods_price){ //商品类index,商品index,商品价格
            //取得对应按钮绑定的input
            let the_input =  $('.goods-body>div:eq('+foodstype_Index+')>ul>li:eq('+foods_Index+')>div[class="setNum"]>input')[0];
            let the_typeNum = $('.goods-menu li:eq('+foodstype_Index+') .typeFoods_Num')[0];//该商品选择数量
            let val = parseInt(the_typeNum.innerHTML);
            
            if(the_input.value>0){
                the_input.value--;
                if(val>0){
                    val--;
                    if(val==0){
                        the_typeNum.style.display = 'none';
                    }
                }
            }
            the_typeNum.innerHTML = val;

            //购物车


            // cart:{
            //     totolPrice:123.4,
            //     commodity:[],
            // },

            // {
            //     name:'',   //这里以name为主键
            //     price:0,
            //     sumPrice:0,        
            //     num:0,
            //     img:'',
            // }
            let flag = false;//判断购物车里有没有该商品
            this.cart.commodity.forEach((element,index) => {
                if(element.name==this.goods[foodstype_Index].foods[foods_Index].name && element.num>0){
                    flag = true;
                    element.num--;
                    element.sumPrice=element.num*foods_price;//该商品总价
                    if(element.num==0){
                        this.cart.commodity.splice(index,1);//该商品数量为0，删除该商品
                    }
                }
            });
            if(flag){
                this.cart.totolPrice -= foods_price;
            }
           
            
            
        },
        addNum(foodstype_Index,foods_Index,foods_price){
             //取得对应按钮绑定的input
            let the_input =  $('.goods-body>div:eq('+foodstype_Index+')>ul>li:eq('+foods_Index+')>div[class="setNum"]>input')[0];
            let the_typeNum = $('.goods-menu li:eq('+foodstype_Index+') .typeFoods_Num')[0];//该商品选择数量
            let val = parseInt(the_typeNum.innerHTML);
            
            

            the_input.value++;
            val++;
            if(val>0){
                the_typeNum.style.display = 'block';
            }
            the_typeNum.innerHTML = val;


            //购物车

            let findok = false;//用于判断购物车里有没有该商品

            this.cart.commodity.forEach((element,index) => {
                if(element.name==this.goods[foodstype_Index].foods[foods_Index].name){
                    findok=true;//购物车里有该商品
                    element.num++;//商品数量
                    element.sumPrice=element.num*foods_price;//该商品总价
                }
            });

            if(!findok){//购物车还没有该商品 没有该name   ,添加该商品
                var goods={
                        "name":this.goods[foodstype_Index].foods[foods_Index].name,   //这里以name为主键
                        "price":foods_price,
                        "sumPrice":foods_price,        
                        "num":1,
                        "img":this.goods[foodstype_Index].foods[foods_Index].image
                    }
                this.cart.commodity.push(goods);
            }

            this.cart.totolPrice += foods_price;
        }
    }
}
</script>

<style lang="less" scoped>
    .goods{
        /*隐藏滚动条，当IE下溢出，仍然可以滚动*/
        -ms-overflow-style:none;
        /*火狐下隐藏滚动条*/
        overflow:-moz-scrollbars-none;
        display: flex;
        flex: 0 0 auto;
        position: relative;
        width: 100%;


        .footer{
            position: fixed;
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


        .goods-menu{

            flex: 0 0 auto;
            width: 100px;
            height: calc(~"100vh - 50px");
            // 0存在剩余空间也不放大 1按比例分        1空间不足该缩小，0不缩小
			background-color: #f3f5f7;
            position: relative;
            display: flex;
            overflow: scroll;
            & .typeFoods_Num{
                position: absolute;
                right: 0;
                top: calc(~"50%-10px");
                display: none;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                color: white;
                font-size: 12px;
                background: brown;
                text-align: center;
                line-height: 20px;
            }
            &  li{
                position: relative;
                width: 100%;
                padding: 10px;
                padding-bottom: 22px;
                box-sizing: border-box;
                &.active{
                    background-color: white;
                }
               
            }
            & a{
                display: inline-block;
                width: 80%;
                height: 100%;
                
            }
        }
        
        
        &  .goods-body{
            flex: 1;// 1 1 0%
            position: relative;
            overflow: scroll;
            height: calc(~"100vh - 50px");
            padding-bottom: 100px;
            box-sizing: border-box;

            
            

            img{
                width: 100%;
            }
            & .foods_ul{
                    padding-bottom: 50px;
                    
            }
            & .foods_ul li{
                position: relative;
                display: flex;
                justify-content: center;
                padding-top: 20px;
                padding-bottom: 20px;
                
                & .setNum{
                    position: absolute;
                    right: 20px;
                    bottom: 0px;
                    width: 20%;
                    min-width: 100px;
                    height: 20px;
                    display: flex;
                    justify-content: space-between;

                    & button{
                        width: 20px;
                        height: 20px;
                        border-radius: 50%;
                        background: burlywood;
                        text-align: center;
                    }
                    & .Num{
                        display: inline-block;
                        width: calc(~"(100% - 60px)");
                        height: 20px;
                        line-height: 20px;
                        font-size: 12px;
                        border: 1px solid black;
                        box-sizing: border-box;
                    }
                }

                & .foodsText span{
                    display: block;
                    padding: 10px 10px;
                    & label{
                        color: #F56C6C;
                    }
                }
               

                & .imgd{
                     width: 40%;
                }
                & .foodsText{
                     width: 40%;
                }

                & .foodsText span:nth-child(1){
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }

        }

        
        
    }

    ::-webkit-scrollbar{
        display:none;
    }
    

</style>