<template>
<div>
    <h3 class="zc"><strong>注册</strong></h3> 
    <div class="register">
         <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
           
        <el-form-item label="账号" prop="userName" >
          <el-input  v-model="ruleForm.userName" autocomplete="on" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="userPass">
          <el-input type="password" v-model="ruleForm.userPass" autocomplete="off" placeholder="请输入密码" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off" placeholder="请再次输入密码" show-password></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">注册</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>

    </div>
 </div>
</template>

<script>
import {mapGetters,mapActions} from 'vuex'

export default {
     data(){
            var validateUserName = (rule, value, callback) => {
              this.checkuser(value);
              if (value === '') {
                callback(new Error('请输入用户名'));
              } else {
                //发送ajax判断有没有该用户
                //没有该用户名hasName为false,mutation变化需要时间，定时器
                setTimeout(()=>{
                  if(!this.hasName){
                   callback();
                  }else{
                    callback(new Error('该用户名被占用!请重新输入'));
                  }
                },1000);
                
              }
            };
            var validateuserPass = (rule, value, callback) => {
              if (value === '') {
                callback(new Error('密码不能为空'));
              } else {
                  //8-16位   必须有数字  必须有字母  必须有特殊字符$#@^`~!%*()-=_+{}[]|\;':,./<>?  不能以数字和特殊字符开头
                let reg = /^(?=.{8,16}$)(?=.*\d+.*$)(?=.*[a-zA-Z]+.*$)(?=.*[$#@^`~!%*(-)=_+{}[|\]\\;':,./<>]+.*$)(?![0-9$#@^&\s]{1}.{7,15}$)[0-9a-zA-Z$#@^`~!%*(-)=_+{}[|\]\\;':,./<>]+$/;
                if(reg.test(value)){
                    callback();
                }else{
                     callback(new Error('密码为8-16位字母+数字+特殊字符组成!'));
                }
              }
            };
            var validatecheckPass = (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请再次输入密码'));
              } else {
                 if(value != this.ruleForm.userPass){
                    callback(new Error('两次输入密码不一致!'));
                }else{
                    callback();
                }
              }
            };

        return {
          ruleForm: {
            userName: '',
            userPass: '',
            checkPass: '',
          },
          rules: {
            userName: [{
              validator: validateUserName,
              trigger: 'blur'
            }],
            userPass: [{ 
                validator: validateuserPass, 
                trigger: 'blur' }
            ],
            checkPass: [{ 
                validator: validatecheckPass, 
                trigger: 'blur' }
            ],
          }
        }
    },
    computed:{
        ...mapGetters('user',[
            'hasName',
        ])
    },
    methods:{
        checkuser(value){  //判断有没有该用户
           this.$store.dispatch('user/checkuser',value);
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        submitForm(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) { //验证注册成功，跳转登录
                this.$http.post('/register',this.ruleForm,{
                  //转换函数传params
                  transformRequest:[ 
                      function(data) {
                          let params='';
                          for(var i in data){
                              params += i +'='+ data[i]+'&';
                          }
                                return params;
                      }
                  ]
                  }).then(resp=>{
                    if(resp.data.errno==1){//OK
                       this.$message({
                          message: '恭喜你，注册成功',
                          type: 'success'
                        });
                       this.$router.push({name:'login'});
                    }else{
                      this.$message.error('注册失败，该用户名已存在');
                    }
                  }).catch(resp=>{
                      this.$message.error('服务出错');
                      console.log(resp);
                  });
            } else {
              this.$message.error('服务出错');
              return false;
            }
          });
        }
    }
}
</script>

<style lang="less" scoped>
    .zc{
        text-align: center;
        height: 50px;
        line-height: 50px;
    }
    .register{
        width: 80vw;
        
    }

</style>