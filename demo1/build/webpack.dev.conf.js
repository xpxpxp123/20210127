'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

/**
 * 使用express框架启动一个服务器
 */
const express = require('express')
const app = express(); //express类的实例作为HTTP服务器

//在处理post的接口时需要特定的数据处理程序（若只是get接口则不需要。）
// const bodyParser = require('body-parser')
// app.use(bodyParser.json());//解析json数据
// app.use(bodyParser.urlencoded({ //解析表单数据
//   extended: true
// }));

const querystring = require('querystring');



//1.读取数据
var appData = require('../static/data.json');

var seller = appData.seller;
var goods = appData.goods;
var ratings = appData.ratings;

//2.使用express配置路由，知道接口请求
var apiRouters = express.Router(); //定义一个路由

// //multiparty是nodejs框架express推荐的中间件。 接收formdata
// var multiparty = require("multiparty");




const fs = require('fs');
var allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*'); //自定义中间件，设置跨域需要的响应头。
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE'); //允许任何方法
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,X-Session-Token'); //允许任何类型
  next();
};
app.use(allowCrossDomain);




const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
      module: {
        rules: utils.styleLoaders({
          sourceMap: config.dev.cssSourceMap,
          usePostCSS: true
        })
      },
      // cheap-module-eval-source-map is faster for development
      devtool: config.dev.devtool,

      // these devServer options should be customized in /config/index.js
      devServer: {





        clientLogLevel: 'warning',
        historyApiFallback: {
          rewrites: [{
            from: /.*/,
            to: path.posix.join(config.dev.assetsPublicPath, 'index.html')
          }, ],
        },
        hot: true,
        contentBase: false, // since we use CopyWebpackPlugin.
        compress: true,
        host: HOST || config.dev.host,
        port: PORT || config.dev.port,
        open: config.dev.autoOpenBrowser,
        overlay: config.dev.errorOverlay ? {
          warnings: false,
          errors: true
        } : false,
        publicPath: config.dev.assetsPublicPath,
        proxy: config.dev.proxyTable,
        quiet: true, // necessary for FriendlyErrorsPlugin
        watchOptions: {
          poll: config.dev.poll,
        },


        before(apiRouters) {
          //配置请求路由和响应
          apiRouters.get('/seller', function (req, res) {
            res.json({
              errno: 0, //错误码
              data: seller
            });
          });

          apiRouters.get('/goods', function (req, res) {
            res.json({
              errno: 0, //错误码
              data: goods
            });
          });


          // carts:[
          //   {


          //   userName:''
          //   cart:{
          //     totolPrice:0,
          //     commodity:[
          //             {
          //     name:'',   //这里以name为主键
          //     price:0,
          //     sumPrice:0,        
          //     num:0,
          //     img:'',
          //             }
          //        ],
          //   },

          //   },
          // ]

          //商品结算
          apiRouters.get('/ratings', function (req, res) {
              var the_userName = null;
              var the_cart = null; //传入的cart
              var old_cart = null; //将要返回的cart
              var cartsIndex = 0;//carts里第几个购物车是当前用户的
              var jsonData = null;//data.json

              fs.readFile(path.join(__dirname.substring(0, __dirname.lastIndexOf('\\')), '/static/data.json'), 'utf8', function (err, data) {
                  if (err) {
                    console.log("出错了", err);

                  } else {
                    jsonData = JSON.parse(data);//读取的字符串转为json

                    the_userName = req.query.userName;
                    the_cart = JSON.parse(req.query.cart);//cart转json
                    console.log(req.query.cart);

                    if (the_userName) {

                      //
                      //找到操作目的cart
                      jsonData.carts.forEach((ele, index) => {
                        if (ele.userName == the_userName) { //找到了userName对应  carts
                          old_cart = ele.cart; //返回的购物车=旧的购物车
                          cartsIndex = index;
                        }
                      });
                      
                      if (old_cart !=null) { //有该用户的购物车，就更新购物车，没有就新增插入,操作对象为old_cart
                        //更新目的cart商品列表

                        let hasthecom = false;//判断原购物车有没有该商品
                        let changeNum = 0;//商品变化数量新-旧   旧+变化量
                        the_cart.commodity.forEach(the_cartItem => { //把传入的cart与目的cart对比，更新,插入
                          hasthecom = false; //每个商品默认目的购物车里没有
                          for (let i = 0; i < old_cart.commodity.length; i++) { //以新购物车为主,合并或插入到旧购物车
                            if (old_cart.commodity[i].name == the_cartItem.name) {
                              hasthecom = true; //有该商品，合并
                              //该商品的数量变化影响旧的购物车
                              changeNum=the_cartItem.num - old_cart.commodity[i].num;
                              old_cart.commodity[i].num += changeNum;//将要返回的购物车
                              old_cart.commodity[i].sumPrice += changeNum*the_cartItem.price;
                              old_cart.totolPrice += changeNum*the_cartItem.price;
                             
                            }
                          }
                          if (!hasthecom) { //没有该商品,添加
                            old_cart.commodity.push(the_cartItem);
                            old_cart.totolPrice += the_cartItem.sumPrice;
                          }
                          
                        });

                        //原来购物车有该商品,现在没有了,咋搞？,以旧购物车为主,删除新购物车里没有的
                        // let delit = true;
                        // old_cart.commodity.forEach((ele,index)=>{
                        //   delit = true;
                        //   for(let j=0;j<the_cart.commodity.length;j++){
                        //     if(the_cart.commodity[j].name == ele.name){
                        //       delit=false;//旧购物车里的该商品只要在新购物车里有，就不做操作
                        //     }
                        //   }

                        //   //遍历完后,若没匹配到该商品，则删除旧购物车里的该商品
                        //   if(delit){
                        //     old_cart.totolPrice -= ele.sumPrice;
                        //     old_cart.commodity.splice(index,1);
                        //   }


                        // });





                        jsonData.carts[cartsIndex].cart = old_cart; //更新到data.json
                        //写文件  转string
                        jsonData = JSON.stringify(jsonData); //string
                        //data.json写回
                        fs.writeFile(path.join(__dirname.substring(0, __dirname.lastIndexOf('\\')), '/static/data.json'), jsonData, function (err, data) {
                          if (err) {
                            console.error(err);
                          } else { //写回后
                           
                            res.json({
                              errno: 1, //cart修改成功
                              data: old_cart, //返回合并后的cart
                            });
                          }
                        });
                      } else { //该用户没有购物车，新增插入  
                        
                        let cart = {
                          userName:the_userName,
                          cart:the_cart,
                        };
                        

                        jsonData.carts.push(cart); //插入到data.json
                        //写文件  转string
                        jsonData = JSON.stringify(jsonData); //string
                        //data.json写回
                        fs.writeFile(path.join(__dirname.substring(0, __dirname.lastIndexOf('\\')), '/static/data.json'), jsonData, function (err, data) {
                          if (err) {
                            console.error(err);
                          } else { //写回后
                            
                            
                            res.json({
                              errno: 1, //cart修改成功
                              data: the_cart, //返回传过来的购物车
                            });
                          }
                        });
                      }


                    } else {
                      console.log(12345);
                      
                      res.json({
                        errno: 0, //没穿用户名,提交失败
                        data: the_cart, //返回合并后的cart
                      });
                    }
                  }
              });

              
                  
        });



        //付款,清空购物车,插入订单历史记录,并返回更新
        apiRouters.get('/pay', function (req, res) {
          var the_userName = null;
              var the_cart = null; //传入的cart
              var re_cart = {
                totolPrice:0,
                commodity:[]
              }
              var cartsIndex = 0;//carts里第几个购物车是当前用户的
              var jsonData = null;//data.json
              function toDB(num){
                return num<10?`0${num}`:num;
              }

              fs.readFile(path.join(__dirname.substring(0, __dirname.lastIndexOf('\\')), '/static/data.json'), 'utf8', function (err, data) {
                  if (err) {
                    console.log("出错了", err);

                  } else {
                    jsonData = JSON.parse(data);//读取的字符串转为json

                    the_userName = req.query.userName;
                    the_cart = JSON.parse(req.query.cart);//cart转json  ,包括总价和商品清单

                    
                    let in_order = null; //要插入的order记录
                    let re_orders = null;//返回的该用户order数组
                    let hascarthistory = false;//默认没有该用户的订单记录
                    let nowdate = new Date();

                    let cre_order = { //carthistory the_userName 0->1
                      userName:the_userName,
                      order:[{
                        orderdate:`${nowdate.getFullYear()}-${toDB(nowdate.getMonth()+1)}-${toDB(nowdate.getDate())} ${toDB(nowdate.getHours())}:${toDB(nowdate.getMinutes())}:${toDB(nowdate.getSeconds())}`,
                        cart:the_cart,
                      }]
                    }
                    
                    if (the_userName) {

                      //
                      //找到操作目的cart,清除掉
                      jsonData.carts.forEach((ele, index) => {
                        if (ele.userName == the_userName) { //找到了userName对应  carts
                          jsonData.carts.splice(index,1);
                        }
                      });
                      jsonData.carthistory.forEach((ele, index) => {
                        if (ele.userName == the_userName) { //找到了userName对应  carthistory
                          hascarthistory = true;
                          in_order = {
                            orderdate:`${nowdate.getFullYear()}-${toDB(nowdate.getMonth()+1)}-${toDB(nowdate.getDate())} ${toDB(nowdate.getHours())}:${toDB(nowdate.getMinutes())}:${toDB(nowdate.getSeconds())}`,
                            cart:the_cart,
                          }
                          ele.order.push(in_order);//插入
                          re_orders = ele.order;//返回
                        }
                      });
                      
                      if(!hascarthistory){//该用户没有订单记录,插入一条
                        jsonData.carthistory.push(cre_order);
                        re_orders = cre_order.order;
                      }
                      
                      jsonData=JSON.stringify(jsonData);
                      fs.writeFile(path.join(__dirname.substring(0, __dirname.lastIndexOf('\\')), '/static/data.json'), jsonData, function (err, data) {
                        if (err) {
                          console.error(err);
                        } else { //写回后
                          res.json({
                            errno: 1, //付款成功
                            cart:re_cart,
                            orders: re_orders, //返回订单历史记录
                            
                          });
                        }
                      });

                    }else{ //没传用户名
                      res.json({
                        errno: 0, //付款失败
                      });
                    }













                  }
        });


      });











                  // “userlist”:[
                  //   {
                  //     userName:"admin",
                  //     userPass:"123456",
                  //   }
                  //     ],

                  //登录
                  apiRouters.post('/login', function (req, res) {
                    var the_userName = null;
                    var the_userPass = null;
                   

                    var old_cart = {//将要返回的cart
                      totolPrice:0,
                      commodity:[
                              
                        ],
                    }; 
                    var jsonData =null;
                    
                    //读文件
                    fs.readFile(path.join(__dirname.substring(0, __dirname.lastIndexOf('\\')), '/static/data.json'), 'utf8', function (err, data) {
                        if (err) {
                          console.log("读取文件出错了", err);
      
                        } else {
                           jsonData = JSON.parse(data);//读取的字符串转为json
    
                           var arr=[];
                           req.on('data',buffer=>{
                             arr.push(buffer);	//创建一个数组，把每次传递过来的数据保存
                           });
                           let buf=null;
                           let post=null;
                           req.on('end',()=>{
                                buf = Buffer.concat(arr);	//使用concat把数据连接起来
                                post = querystring.parse(buf.toString());//解析数据
                           
       
                                the_userName = post.userName;
                                the_userPass = post.userPass;

                                //登录正确判断
                                let flag = false;
                                jsonData.userlist.forEach(ele=>{
                                  if(ele.userName==the_userName && ele.userPass==the_userPass){
                                    flag=true;
                                  }
                                });
                               
                                if(flag){ //用户名和密码都正确，根据userName取得购物车和历史购买记录返回
                                    jsonData.carts.forEach(ele => {
                                        if (ele.userName == the_userName) { //找到了对应  carts
                                         
                                          old_cart = ele.cart; //旧的购物车
                                        }
                                      });

                                      res.json({
                                        errno: 0, //登录成功
                                        data: old_cart, //返回对应的购物车
                                        
                                      });
                                   
                                    
                                  
                                }else{ //该用户名不存在或密码错误
                                  res.json({
                                    errno: 1, //登陆失败
                                  });
                                }
       
       
                           });
                        
                        
                        
                        
                        }

                    });

                    

                    
                });



                //登录验证用户名是否存在
                apiRouters.get('/checkuser', function (req, res) {
                  let the_Name = null;
                  fs.readFile(path.join(__dirname.substring(0, __dirname.lastIndexOf('\\')), '/static/data.json'), 'utf8', function (err, data) {
                      if (err) {
                        console.log("出错了", err);
                      } else {
                         the_Name = req.query.checkName;
                        let haveName = false;//默认没有该用户名

                        var jsonData = JSON.parse(data);//读取的字符串转为json
                        if (req.query.checkName) { //有传值
                            jsonData.userlist.forEach(ele => {
                              if (ele.userName == the_Name) { //找到了对应username
                                haveName=true;//有
                              }
                            });


                            if(haveName){
                              res.json({
                                errno: 0, //找到了
                              });
                            }else{
                              res.json({
                                errno: 1, //不存在该用户名
                              });
                            }
                        } else { //没有传值checkName
                            res.json({
                              errno: 1, //不存在该用户名
                            });
                          }
                        }
                      });
                });


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
                //获取该用户的所有订单
                apiRouters.get('/getcarthistory', function (req, res) {
                  let the_Name = null;
                  let re_order = [];
                  fs.readFile(path.join(__dirname.substring(0, __dirname.lastIndexOf('\\')), '/static/data.json'), 'utf8', function (err, data) {
                      if (err) {
                        console.log("出错了", err);
                      } else {
                         the_Name = req.query.userName;
                        let haveName = false;//默认没有该用户名

                        var jsonData = JSON.parse(data);//读取的字符串转为json
                        if (the_Name) { //有传值
                            jsonData.carthistory.forEach(ele => {
                              if (ele.userName == the_Name) { //找到了对应username
                                haveName=true;//有
                                re_order = ele.order;

                              }
                            });

                            if(haveName){ //有该用户的订单记录
                              res.json({
                                errno: 0, //找到了
                                data:re_order,
                              });
                            }else{ //没有该用户的订单记录
                              res.json({
                                errno: 1, 
                                data:re_order,
                              });
                            }
                        } else { //没有传值userName
                            res.json({
                              errno: 2, //不存在该用户名
                            });
                          }


                    }
                      });
                });

                //注册
                apiRouters.post('/register', function (req, res) {
                  let the_Name = null;
                  let the_Pass = null;
                  fs.readFile(path.join(__dirname.substring(0, __dirname.lastIndexOf('\\')), '/static/data.json'), 'utf8', function (err, data) {
                      if (err) {
                        console.log("出错了", err);
                      } else {
                            var jsonData = JSON.parse(data);//读取的字符串转为json
                            let haveName = false;//默认没有该用户名
                            var arr=[];
                           req.on('data',buffer=>{
                             arr.push(buffer);	//创建一个数组，把每次传递过来的数据保存
                           });
                           let buf=null;
                           let post=null;
                           req.on('end',()=>{
                                buf = Buffer.concat(arr);	//使用concat把数据连接起来
                                post = querystring.parse(buf.toString());//解析数据

                                the_Name = post.userName;
                                the_Pass = post.userPass;
                                console.log(the_Name);

                            if (the_Name) { //有传值
                                jsonData.userlist.forEach(ele => {
                                  if (ele.userName == the_Name) { //找到了对应username
                                    haveName=true;//有
                                  }
                                });


                                if(haveName){//找到了,不能注册
                                  res.json({
                                    errno: 0, 
                                  });
                                }else{//不存在该用户名,可以注册
                                  jsonData.userlist.push(
                                    {
                                      "userName": the_Name,
                                      "userPass": the_Pass
                                   }
                                  )
                                  jsonData=JSON.stringify(jsonData);
                                  fs.writeFile(path.join(__dirname.substring(0, __dirname.lastIndexOf('\\')), '/static/data.json'), jsonData, function (err, data) {
                                    if (err) {
                                      console.error(err);
                                    } else { //写回后
                                      res.json({
                                        errno: 1, 
                                      });
                                    }
                                  });

                                }
                            } else { //没有传值checkName
                                res.json({
                                  errno: 0, //不存在该用户名
                                });
                            }
                            
                          });

                          }
                        });
                });


                apiRouters.post('/seller', function (req, res) {
                  res.json({
                    errno: 0, //错误码
                    data: seller
                  });
                });

                apiRouters.post('/goods', function (req, res) {
                  res.json({
                    errno: 0, //错误码
                    data: goods
                  });
                });

                apiRouters.post('/ratings', function (req, res) {
                  res.json({
                    errno: 0, //错误码
                    data: ratings
                  });
                });
              
            },
          },
       




            plugins: [
              new webpack.DefinePlugin({
                'process.env': require('../config/dev.env')
              }),
              new webpack.HotModuleReplacementPlugin(),
              new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
              new webpack.NoEmitOnErrorsPlugin(),
              // https://github.com/ampedandwired/html-webpack-plugin
              new HtmlWebpackPlugin({
                filename: 'index.html',
                template: 'index.html',
                inject: true
              }),
              // copy custom static assets
              new CopyWebpackPlugin([{
                from: path.resolve(__dirname, '../static'),
                to: config.dev.assetsSubDirectory,
                ignore: ['.*']
              }]),


            ]
          });

        module.exports = new Promise((resolve, reject) => {
          portfinder.basePort = process.env.PORT || config.dev.port
          portfinder.getPort((err, port) => {
            if (err) {
              reject(err)
            } else {
              // publish the new Port, necessary for e2e tests
              process.env.PORT = port
              // add port to devServer config
              devWebpackConfig.devServer.port = port

              // Add FriendlyErrorsPlugin
              devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
                compilationSuccessInfo: {
                  messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
                },
                onErrors: config.dev.notifyOnErrors ?
                  utils.createNotifierCallback() : undefined
              }))

              resolve(devWebpackConfig)
            }
          })
        })
