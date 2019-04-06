<template>
  <section>

    <el-table :data="users"
              style="width: 100%;">
      <el-table-column type="index" width="60">
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="150" sortable>
      </el-table-column>
      <el-table-column prop="background" label="教育背景" width="200"  sortable>
      </el-table-column>
      <el-table-column prop="mail" label="邮箱" width="300" sortable>
      </el-table-column>
      <el-table-column prop="level" label="权限" width="220" sortable>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template scope="scope">
          <el-button size="small" @click="edit(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="open(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>


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
          <el-input v-model="form.background" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="简介" :label-width="formLabelWidth" prop="introduce">
          <el-input type="textarea"
                    :rows="3" v-model="form.introduce" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit('updateForm')">确 定</el-button>
      </div>
    </el-dialog>
  </section>

</template>
<script>
  import Cookies from 'js-cookie'
  export default {
    data() {
      return {
        user:JSON.parse(Cookies.get('user')),
        users: [],
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
          introduce:[  { required: true, message: "简介不能为空", trigger: "blur" },
            { min: 1, max: 300, message: "长度在 1 到 300 个字符", trigger: "blur" }],

        },
      }
    },
    methods: {
      getUsers() {
              this.$http
                .post("/api/GetMemberServlet", this.user.level)
                .then(function (res) {
                  const jsonObj = JSON.parse(JSON.stringify(res.data));
                  if (jsonObj.code != 200) {
                  } else if (jsonObj.code === 200) {
                    const info = jsonObj.data;
                    console.log(info)
                    this.users=info

                  }
                });
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
                  this.getUsers()



                }
              });
            this.dialogFormVisible = false
          } else {
            console.log("error submit!!");
            this.dialogFormVisible = false
            return false;
          }
        });
      },
      edit(user){
        console.log(user.mail)
        this.form=user
        this.dialogFormVisible = true
      },
      deleteMember(user){
              this.$http.post("/api/DeleteMemberServlet", user.mail)
                .then(function(res) {
                  const jsonObj = JSON.parse(JSON.stringify(res.data));
                  if (jsonObj.code !=200) {

                  } else  if(jsonObj.code===200){
                    this.getUsers()
                    this.$message({
                      type: 'success',
                      message: '删除成功!'
                    });
                  }
                });


      },
      open(user) {
        this.$confirm('是否删除这条消息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteMember(user)
        }).catch(() => {
        });
      },
        },
      mounted() {
        this.getUsers()
      }

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
