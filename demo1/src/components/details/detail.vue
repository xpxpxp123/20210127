<template>
    <keep-alive>
        <transition enter-active-class="animated slideInRight"  leave-active-class="animated slideOutRight">
            <div class="detail" v-show="rightside">
                <button class="btn" @click="hideRightside">
                
                关闭
                
                </button>
                
                <div class="detail-main">
                    <ul>
                        <li v-for="v in seller.supports">
                            <span>{{v.description}}</span>
                        </li>
                    </ul>

                </div>



            </div>
        </transition>
    </keep-alive>
    
    
</template>

<script>
import {mapGetters} from 'vuex'
import 'animate.css/animate.css'


export default {
    computed:mapGetters([
        "rightside",
        "seller"
    ]),
    methods:{
        hideRightside(){
            this.$store.dispatch('hideRightside');
        }
    },
    
}
</script>

<style lang='less' scoped>
    .detail{
        
        border-radius: 20px 0 0 20px;
        z-index: 666;
        position: fixed;
        right: 0;
        top: 0;
        width: 70%;
        height: 100%;
        background-color: rgb(177, 190, 177);
       opacity: 0.8;
       overflow: hidden;
       @btnwidth : 40px;
       float: left;
       box-sizing: border-box;
        .btn{
            height: 100%;
            width: @btnwidth;
            text-align: 100%;
            font-size: 24px;
            background-color: rgba(221, 46, 7, 0.8);
            box-sizing: border-box;
            border-top: none;
            border-bottom: none;
            word-wrap:break-word;
           
            
        }
        .detail-main{
            position: absolute;
           width: calc(100%-@btnwidth);
           height: 100%;
           display: inline-block;
            box-sizing: border-box;
        }
        li span{
            padding: 10px;
            margin: 10px 20px 0 0;
            background: rgb(223, 152, 85);
            display: inline-block;
            width: 100%;
            box-sizing: border-box;
            
        }
    }
</style>