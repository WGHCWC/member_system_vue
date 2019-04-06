<template>
  <section style="margin-left: 20%">
    <el-col :span="24" class="toolbar" >
      <el-button style="float: right;margin-right: 150px" type="primary" v-on:click="requestArt()">
        提交论文
      </el-button>
    </el-col>

    <el-table :data="infos" style="width: 100%;">
      <el-table-column type="index" width="60">
      </el-table-column>
      <el-table-column prop="title" label="标题" width="150">
      </el-table-column>
      <el-table-column prop="author" label="作者" width="150">
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template scope="scope">
          <el-button size="small" @click="showDetails(scope.row)">查看论文</el-button>
        </template>
      </el-table-column>
      <el-table-column label="推荐人数" width="150">
        <template scope="scope">
          <el-progress :percentage="scope.row.times" status="success"></el-progress>
        </template>
      </el-table-column>
      <el-table-column label="投票" width="150">
        <template scope="scope">
          <el-button type="danger" @click="deleteMyArtic(scope.row)">删除</el-button>

        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="提交论文" :visible.sync="dialogFormVisible">
      <el-form :model="art" :rules="rules" ref="addMeet">
        <el-form-item label="论文标题" :label-width="formLabelWidth" prop="title">
          <el-input v-model="art.title" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="作者" :label-width="formLabelWidth" prop="author">
          <el-input v-model="art.author"  auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="论文地址" :label-width="formLabelWidth" prop="address">
          <el-input v-model="art.address"  auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="简介" :label-width="formLabelWidth" prop="introduce">
          <el-input type="textarea"
                    :rows="5"v-model="art.introduce"  auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitArt('addMeet')">确 定</el-button>
      </div>
    </el-dialog>

  </section>

</template>
<script>
  import Cookies from 'js-cookie'

  export default {
    data() {
      return {
        dialogFormVisible:false,
        user:JSON.parse(Cookies.get('user')),
        value2: true,
        value1: '',
        dialogVisible: false,
        infos: [],
        formLabelWidth: '120px',
        art: {
          title: '',
          mail:'',
          author: '',
          address: '',
          introduce:''
        },
        rules: {
          author: [{required: true, message: "姓名不能为空", trigger: "blur"}],
          address: [{required: true, message: "地址不能为空", trigger: "blur"},],
          title: [{required: true, message: "学历不能为空", trigger: "blur"}],
          introduce: [{required: true, message: "学历不能为空", trigger: "blur"}],

        },
      }
    },
    methods: {

      getmyArts() {
        this.$http
          .post("/api/GetMyArticleServlet", this.user.mail)
          .then(function (res) {
            const jsonObj = JSON.parse(JSON.stringify(res.data));
            if (jsonObj.code != 200) {
            } else if (jsonObj.code === 200) {
              const info = jsonObj.data;
              this.infos = info

            }
          });
      },
      requestArt(){

        this.dialogFormVisible = true

      },
      delete(msg) {

        this.$message({
          type: 'success',
          message: '成功!'
        });

      },
      showDetails(msg) {
        this.$confirm('将跳转到另一网页查看论文?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          window.open(msg.address)

        }).catch(() => {
        });
      },

      submitArt(formName) {

        this.$refs[formName].validate(valid => {
          if (valid) {
            this.art.mail=this.user.mail
            this.$http.post("/api/PushArticleServlet", this.art)
              .then(function (res) {
                const jsonObj = JSON.parse(JSON.stringify(res.data));
                if (jsonObj.code != 200) {

                } else if (jsonObj.code === 200) {
                  this.getmyArts()

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
      deleteMyArtic(art) {

        this.$confirm('删除论文?此操作不可恢复', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          this.$http
            .post("/api/DeleteArticleServlet", art.id)
            .then(function (res) {
              const jsonObj = JSON.parse(JSON.stringify(res.data));
              if (jsonObj.code != 200) {

              } else if (jsonObj.code === 200) {
                this.getmyArts()

              }
            });

        }).catch(() => {
        });




      }
    },
    mounted() {
      this.getmyArts()
    }

  }

</script>
<style>

</style>
