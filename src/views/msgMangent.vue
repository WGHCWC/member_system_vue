<template>
  <section style="margin-left: 20%">
    <el-col :span="24" class="toolbar" >
      <el-button style="float: right;margin-right: 150px" type="primary" v-on:click="pushMessage()">
        发布消息
      </el-button>
    </el-col>
    <el-table :data="infos" style="width: 100%;" default-sort="date">
      <el-table-column type="index" width="60">
      </el-table-column>
      <el-table-column prop="title" label="标题" width="250" >
      </el-table-column>
      <el-table-column prop="date" label="时间" width="250"  >
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template scope="scope">
          <el-button size="small" @click="showDetails(scope.row)">查看</el-button>
          <el-button type="danger" size="small" @click="open(scope.row)">删除</el-button>
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

    <el-dialog title="消息发布" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="addMeet">
        <el-form-item label="标题" :label-width="formLabelWidth" prop="title">
          <el-input v-model="form.title" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="日期" :label-width="formLabelWidth" prop="date">
          <el-date-picker  value-format="yyyy-MM-dd" v-model="form.date"type="date"placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="内容" :label-width="formLabelWidth" prop="details">
          <el-input type="textarea" :rows="8" v-model="form.details" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit('addMeet')">发布</el-button>
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
        formLabelWidth: '120px',
        dialogFormVisible:false,
        dialogVisible: false,
        infos: [],
        ditem: {
          title: '',
          date: '',
          details: ''
        },
        form: {
          date: '',
          title: '',
          details: '',
        },
        rules: {
          details: [{required: true, message: "姓名不能为空", trigger: "blur"}],
          date: [{required: true, message: "地址不能为空", trigger: "blur"},],
          title: [{required: true, message: "学历不能为空", trigger: "blur"}],

        },
      }
    },
    methods: {

      getMsgs() {
        this.$http
          .post("/api/GetMessageServlet", this.user.leave)
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

        this.$http
          .post("/api/DeleteMessageServlet", msg.id)
          .then(function (res) {
            const jsonObj = JSON.parse(JSON.stringify(res.data));
            if (jsonObj.code != 200) {
              alert(jsonObj.msg);
            } else if (jsonObj.code === 200) {
              this.getMsgs()
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            }
          });


      },
      open(msg) {
        this.$confirm('是否删除这条消息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delete(msg)

        }).catch(() => {
        });
      },
      showDetails(msg) {
        this.ditem = msg
        this.dialogVisible = true

      },
      submit(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.$http.post("/api/CreateMessageServlet", this.form)
              .then(function (res) {
                const jsonObj = JSON.parse(JSON.stringify(res.data));
                if (jsonObj.code != 200) {
                  this.$message({
                    type: 'error',
                    message: res.msg
                  });
                } else if (jsonObj.code === 200) {
                  this.getMsgs()
                  this.$message({
                    type: 'success',
                    message: '发布成功!'
                  });
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
      edit(user) {
        console.log(user.mail)
        this.form = user
        this.dialogFormVisible = true
      },
      pushMessage(){
        this.dialogFormVisible=true
      }
    },
    mounted() {
      this.getMsgs()
    }

  }

</script>
<style>

</style>
