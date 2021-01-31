<template>
  <div class="carthistory">
      <div id="echarts"></div>
      <div class="tab">
                <el-table
            :data="carthistory"
            height="250"
            style="width: 100%;font-size:12px">
            <el-table-column
            label="日期"
            min-width="160">
            <template slot-scope="scope">
                <i class="el-icon-time"></i>
                <span style="margin-left: 10px">{{ scope.row.orderdate }}</span>
            </template>
            </el-table-column>

            <el-table-column
            label="商品"
            min-width="80">
            <template slot-scope="scope">
                <el-popover trigger="click" placement="top">
                <p v-for="(v,index) in scope.row.cart.commodity">{{v.name}} {{v.price}}元 {{v.num}}份 </p>
                <div slot="reference" class="name-wrapper">
                    <el-tag size="small">查看详细</el-tag>
                </div>
                </el-popover>
            </template>
            </el-table-column>

            <el-table-column
            label="总价"
            min-width="50">
            <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.cart.totolPrice }}</span>
            </template>
            </el-table-column>

            <el-table-column label="操作" width="80">
            <template slot-scope="scope">
                <el-button
                size="mini"
                type="primary"
                @click="createEcharts(scope.row)">图形化</el-button>
                
            </template>
            </el-table-column>
        </el-table>
      </div>
      
  </div>
</template>

<script>

import {mapGetters,mapActions} from 'vuex'
import echarts from 'echarts'
// 下单后
// carthistory:[
//     {
//         userName:'',
//         order:[
//             {
//             orderdate:'',
//             cart: {  //对应user.cart,在付款后获取user.cart存入
//                     "totolPrice": 68,
//                     "commodity": [{
//                         "name": "VC无限橙果汁",
//                         "price": 8,
//                         "sumPrice": 8,
//                         "num": 1,
//                         "img": "http://fuss10.elemecdn.com/e/c6/f348e811772016ae24e968238bcbfjpeg.jpeg?imageView2/1/w/750/h/750"
//                     }]
//                 }
//             },
//         ]
        
//     },
// ]
export default {
    data(){
        return {
           the_orderdata:[],
           echar:null,
        }
    },
    computed:{
        ...mapGetters('user',[
            "carthistory"  //对应order
        ]),
    },
    methods:{
        
        createEcharts(the_order){  //对应订单图形化
            //orderdate  cart
            this.the_orderdata = [];
            this.echar=null;
            let in_shop = {};
            the_order.cart.commodity.map(ele=>{
                in_shop = {
                    name:ele.name,  
                    price:ele.sumPrice, //总消费额
                }
                this.the_orderdata.push(in_shop);
            });
            this.echar=echarts.init(document.querySelector('#echarts'))
            this.echar.setOption({
                title: {
                    text: the_order.orderdate,
                    subtext: '合计:'+the_order.cart.totolPrice+'元',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c}元 ({d}%)'
                },
                legend: {
                    type: 'scroll',
                    orient: 'vertical',
                    right: 10,
                    top: 20,
                    bottom: 20,
                    data: this.the_orderdata.map(json=>{
                        return json.name;
                    }),

                    
                },
                series: [
                    {
                        name: '商品名/消费额',
                        type: 'pie',
                        radius: '30%',
                        center: ['40%', '50%'],
                        data: this.the_orderdata.map(json=>{
                            return {name:json.name,value:json.price}
                        }),
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            })
        }
    }
    
}
</script>

<style lang="less" scoped>
    .carthistory{
        width: 100vw;
        font-size: 12px;
        & .tab{
            width: 100%;
        }
        & #echarts{
            width: 100%;
            height: 400px;
        }

    }
</style>