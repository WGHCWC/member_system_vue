<template>
  <section style="margin-left: 20%">

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
          <el-button type="primary" @click="statusChange(scope.row)">推荐</el-button>
<!--          -->
<!--          <el-switch v-model="scope.row.value2" @change="statusChange(scope.row)" active-text="推荐"-->
<!--                     active-color="#13ce66" inactive-color="#999">-->
<!--          </el-switch>-->
        </template>
      </el-table-column>
    </el-table>


    <el-dialog :title=ditem.title :visible.sync="dialogVisible" center v-model="ditem">
      <span style="font-size: 8px;padding-left: 45%">{{ditem.date}}</span><br><br>
      <span>{{ditem.details}}</span>

      <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
    </el-dialog>

  </section>

</template>
<script>
  import Cookies from 'js-cookie'

  export default {
    data() {
      return {
        value2: true,
        value1: '',
        dialogVisible: false,
        infos: [],
        ditem: {
          id: '',
          title: '',
          date: '',
          details: ''
        },
        rules: {
          name: [{required: true, message: "姓名不能为空", trigger: "blur"},
            {min: 1, max: 30, message: "长度在 1 到 30 个字符", trigger: "blur"}],
          address: [{required: true, message: "地址不能为空", trigger: "blur"},
            {min: 1, max: 30, message: "长度在 1 到 30 个字符", trigger: "blur"}],
          background: [{required: true, message: "学历不能为空", trigger: "blur"},
            {min: 1, max: 30, message: "长度在 1 到 30 个字符", trigger: "blur"}],
          introduce: [{required: true, message: "简介不能为空", trigger: "blur"},
            {min: 1, max: 300, message: "长度在 1 到 300 个字符", trigger: "blur"}],

        },
      }
    },
    methods: {

      getArets() {
        this.$http
          .post("/api/GetArticleServlet", this.userInfo)
          .then(function (res) {
            const jsonObj = JSON.parse(JSON.stringify(res.data));
            if (jsonObj.code != 200) {
            } else if (jsonObj.code === 200) {
              const info = jsonObj.data;
              this.infos = info

            }
          });


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
      submit(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.$http.post("/api/UpDateMemberServlet", this.form)
              .then(function (res) {
                const jsonObj = JSON.parse(JSON.stringify(res.data));
                if (jsonObj.code != 200) {

                } else if (jsonObj.code === 200) {
                  this.getArets()

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
      statusChange(art) {
        this.$http
          .post("/api/VoteServlet", art.id)
          .then(function (res) {
            const jsonObj = JSON.parse(JSON.stringify(res.data));
            if (jsonObj.code != 200) {
              alert(jsonObj.msg);
            } else if (jsonObj.code === 200) {
              this.getArets()

            }
          });

      }
    },
    mounted() {
      this.getArets()
    }

  }

</script>
<style>

</style>
