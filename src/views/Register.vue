<template>
  <div class="register">
    <section class="form_container">
      <div class="manage_tip">
        <span class="title">生物学会会员管理系统</span>
      </div>
      <el-form :model="registerUser" :rules="rules" class="registerForm" ref="registerForm"
               label-width="80px">
        <el-form-item label="用户名" prop="name">
          <el-input v-model="registerUser.name" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="registerUser.mail" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="registerUser.password" placeholder="请输入密码" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="password2">
          <el-input v-model="registerUser.password2" placeholder="请确认密码" type="password"></el-input>
        </el-form-item>
        <el-form-item label="学历背景">
          <el-select v-model="registerUser.background" placeholder="请选择身份">
            <el-option label="硕士" value="硕士"></el-option>
            <el-option label="博士" value="博士"></el-option>
            <el-option label="教授" value="教授"></el-option>
            <el-option label="院士" value="院士"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="简介"  prop="introduce">
          <el-input type="textarea"
                    :rows="3" v-model="registerUser.introduce"  auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="submit_btn" @click="submitForm('registerForm')">注 册
          </el-button>
        </el-form-item>
      </el-form>
    </section>
  </div>
</template>

<script>
  import Cookies from 'js-cookie'

  export default {

    name: 'register',
    data() {
      var validatePass2 = (rule, value, callback) => {
        if (value !== this.registerUser.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        registerUser: {
          name: '',
          mail: '',
          password: '',
          password2: '',
          background:'',
          introduce:'',
          level: ''
        },
        user:{
          level:'user',
          name:'',
          address:'北京',
          background:'',
          introduce:'',
          password:'',
          mail:'',
        },
        rules: {
          name: [{required: true, message: '用户名不能为空', trigger: 'change'}, {min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur'}],
          mail: [{type: 'email', required: true, message: '邮箱格式不正确', trigger: 'blur'}],
          password: [{required: true, message: '密码不能为空', trigger: 'blur'}, {min: 3, max: 30, message: '长度在 3 到 30 个字符', trigger: 'blur'}],
          password2: [{required: true, message: '确认密码不能为空', trigger: 'blur'}, {min: 3, max: 30, message: '长度在 3 到 30 个字符', trigger: 'blur'}, {validator: validatePass2, trigger: 'blur'}]
        }
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.user.name=this.registerUser.name
            this.user.background=this.registerUser.background
            this.user.introduce=this.registerUser.introduce
            this.user.password=this.registerUser.password
            this.user.mail=this.registerUser.mail

            this.$http.post('/api/SignUpServlet', this.user).then(function (res) {
              const jsonObj = JSON.parse(JSON.stringify(res.data))
              console.log(jsonObj.msg)
              if (jsonObj.code != 200) {
                this.$message({
                  type: 'warning',
                  message: jsonObj.msg

                });
                alert(jsonObj.msg)
              } else {
                this.$message({
                  type: 'success',
                  message: '注册成功!'

                });
                this.$router.push('/index')
              }
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    }
  }
</script>


<style scoped>
  .register {
    position: relative;
    width: 100%;
    height: 100%;
    background: url(../assets/bg.jpg) no-repeat center center;
    background-size: 100% 100%;
  }

  .form_container {
    width: 370px;
    height: 210px;
    position: absolute;
    top: 10%;
    left: 34%;
    padding: 25px;
    border-radius: 5px;
    text-align: center;
  }

  .form_container .manage_tip .title {
    font-family: "Microsoft YaHei";
    font-weight: bold;
    font-size: 26px;
    color: #fff;
  }

  .registerForm {
    margin-top: 20px;
    background-color: #fff;
    padding: 20px 40px 20px 20px;
    border-radius: 5px;
    box-shadow: 0px 5px 10px #cccc;
  }

  .submit_btn {
    width: 100%;
  }
</style>



