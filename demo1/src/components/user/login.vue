<template>
  <div class="theform">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm theform">
        <el-form-item label="账号" prop="userName" >
          <el-input  v-model="ruleForm.userName" autocomplete="off" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="userPass">
          <el-input type="password" v-model="ruleForm.userPass" autocomplete="off" placeholder="请输入密码" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
          <el-button @click="toReg">注册</el-button>
        </el-form-item>
      </el-form>

      
    
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
                   callback(new Error('该用户名不存在!'));
                  }else{
                    callback();
                  }
                },1000);
                
              }
            };
        return {
          ruleForm: {
            userName: '',
            userPass: '',
          },
          rules: {
            userName: [
              {required: true, message: '用户名不能为空', trigger: 'blur'},
              {
              validator: validateUserName,
              trigger: 'blur'
            }],
            userPass: [
              {required: true, message: '密码不能为空', trigger: 'blur'},
             ],
          }
        }
    },
    watch:{ //此处监听的是user命名空间下的计算属性user
      user:function(newQuestion, oldQuestion){
        if(newQuestion){

          this.$router.push({name:'ratings'});//跳转到购物车结算页
          
        }
      }
      
    },
    computed:{
        ...mapGetters('user',[
            "hasName",
            "user",
            "cart",
            "token"
        ]),
    },
    methods:{
        checkuser(value){  //判断有没有该用户
           this.$store.dispatch('user/checkuser',value);
        },
        login(){
            this.$store.dispatch('user/login',this.ruleForm);
        },
        toReg(){
          this.$router.push({name:'toReg'});
        },
        submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.login();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
    }
}
</script>

<style lang="less" scoped>
  .theform{
    width: 80vw;
  }
</style>