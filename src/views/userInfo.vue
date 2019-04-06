<template>
  <div style="margin-left: 20%">
    <el-card v-model="form" class="box-card" >
      <div slot="header" class="clearfix">
        <span>个人资料</span>
        <el-button style="float: right; padding: 3px 0" @click="edit" type="text">更改信息</el-button>
      </div>
      <div  class="text item" style="margin-left: 10%">
        <p >姓名：&nbsp;{{form.name}}</p>
        <p>邮箱：&nbsp;{{form.mail}}</p>
        <p>地址：&nbsp;{{form.address}}</p>
        <p>学历：&nbsp;{{form.background}}</p>
        <p>权限:&nbsp;&nbsp;&nbsp;{{form.level}}</p>
        <p >简介：&nbsp;{{form.introduce}}</p>


      </div>
    </el-card>
    <el-dialog title="个人信息" :visible.sync="dialogFormVisible">
      <el-form :model="form"   :rules="rules"  ref="updateForm">
        <el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="form.mail" disabled auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="地址" :label-width="formLabelWidth" prop="address">
          <el-input v-model="form.address" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="学历" :label-width="formLabelWidth" prop="background">
          <el-select v-model="form.background" placeholder="请选择身份">
            <el-option label="硕士" value="硕士"></el-option>
            <el-option label="博士" value="博士"></el-option>
            <el-option label="教授" value="教授"></el-option>
            <el-option label="院士" value="院士"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="简介" :label-width="formLabelWidth" >
          <el-input type="textarea"
                    :rows="3" v-model="form.introduce" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit('updateForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import Cookies from 'js-cookie'

  export default {
    name: "infoShow",
    data() {
      return {
        dialogFormVisible: false,
        form: {
          name: '',
          mail: '',
          address: '',
          background: '',
          introduce: '',
          level: '',
          password:''
        },
        formLabelWidth: '120px',
        rules: {
          name:[  { required: true, message: "姓名不能为空", trigger: "blur" },
            { min: 1, max: 30, message: "长度在 1 到 30 个字符", trigger: "blur" }],
          address:[  { required: true, message: "地址不能为空", trigger: "blur" },
            { min: 1, max: 30, message: "长度在 1 到 30 个字符", trigger: "blur" }],
          background:[  { required: true, message: "学历不能为空", trigger: "blur" },
            { min: 1, max: 30, message: "长度在 1 到 30 个字符", trigger: "blur" }],
        },
      }

    },


    methods: {
      edit() {
        this.dialogFormVisible = true

      },
      submit(formName){
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.$http.post("/api/UpDateMemberServlet", this.form)
              .then(function(res) {
                const jsonObj = JSON.parse(JSON.stringify(res.data));
                if (jsonObj.code !=200) {
                  alert(jsonObj.msg);
                } else  if(jsonObj.code===200){
                  const info=jsonObj.data;
                  Cookies.set('user', info)
                  this.dialogFormVisible = false
                }
              });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },
      getUserInfo() {
         this.form=JSON.parse(Cookies.get('user'))
      },
    },
    mounted(){
      this.getUserInfo()
    },

  }


</script>
<style>
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .box-card {

    width: 70%;
  }
</style>
