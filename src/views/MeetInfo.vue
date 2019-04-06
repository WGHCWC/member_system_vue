<template>
  <section style="margin-left: 20px;">
    <el-col :span="24" class="toolbar" >
      <el-button style="float: right;margin-right: 150px" type="primary" v-on:click="requestMeet()">
        会议申请
      </el-button>
    </el-col>
    <el-table :data="meets"
              style="width: 100%;">

      <el-table-column prop="name" label="会议名称" width="150" >
      </el-table-column>
      <el-table-column prop="mail" label="联系方式" width="100" >
      </el-table-column>
      <el-table-column prop="address" label="会议地点" width="250" >
      </el-table-column>
      <el-table-column prop="day" label="日期" width="150" >
      </el-table-column>
      <el-table-column prop="startTime" label="开始时间" width="80" >
      </el-table-column>
      <el-table-column prop="endTime" label="结束时间" width="80" >
      </el-table-column>
      <el-table-column prop="introduce" label="会议简介" width="250" >
      </el-table-column>
      <el-table-column label="操作" width="80">
        <template scope="scope">

          <el-button type="success" @click="open(scope.row)" size="small">参加</el-button>
          <el-button type="warning" @click="joinMeet(scope.row)" size="small" v-if=flag>参加
          </el-button>
        </template>
      </el-table-column>
    </el-table>


    <el-dialog title="会议申请" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="addMeet">
        <el-form-item label="会议名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="会议地点" :label-width="formLabelWidth" prop="address">
          <el-input v-model="form.address"  auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" :label-width="formLabelWidth" prop="mail">
          <el-input v-model="form.mail"  auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="日期" :label-width="formLabelWidth" prop="day">
            <el-date-picker value-format="yyyy-MM-dd" v-model="form.day"type="date"placeholder="选择日期">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="起始时间" :label-width="formLabelWidth" prop="startTime">
          <el-time-select placeholder="起始时间" v-model="form.startTime"
                          :picker-options="{  start: '08:30',  step: '00:15',end: '18:30'}">
          </el-time-select>
        </el-form-item>
          <el-form-item label="结束时间" :label-width="formLabelWidth" prop="endTime">
          <el-time-select
            placeholder="结束时间"
            v-model="form.endTime"
            :picker-options="{ start: '08:30',step: '00:15', end: '18:30',  minTime: form.startTime }">
          </el-time-select>
        </el-form-item>
        <el-form-item label="简介" :label-width="formLabelWidth" prop="introduce">
          <el-input type="textarea"
                    :rows="3" v-model="form.introduce" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitMeet('addMeet')">确 定</el-button>
      </div>
    </el-dialog>

  </section>

</template>
<script>
  import Cookies from 'js-cookie'

  export default {
    data() {
      return {
        flag: false,
        meets: [],
        dialogFormVisible: false,
       user:'',
        form: {
          name: '',
          mail: '',
          address: '',
          day:'',
          startTime:'',
          endTime: '',
          introduce:''

        },
        joinmeet: {
          id: '',
          userMail: ''

        },
        formLabelWidth: '120px',
        rules: {
          name: [{required: true, message: "会议名不能为空", trigger: "blur"}],
          address: [{required: true, message: "地址不能为空", trigger: "blur"}],
          mail: [{required: true, message: "联系方式不能为空", trigger: "blur"}],
          introduce: [{required: true, message: "简介不能为空", trigger: "blur"}],
          day: [{required: true, message: "日期不能为空", trigger: "blur"}],
          startTime: [{required: true, message: "起始时间不能为空", trigger: "blur"}],
          endTime: [{required: true, message: "结束时间不能为空", trigger: "blur"}],


        },

      }
    },
    methods: {
      getMeetss() {
        this.$http
          .post("/api/GetMeetServlet", this.userInfo)
          .then(function (res) {
            const jsonObj = JSON.parse(JSON.stringify(res.data));
            if (jsonObj.code != 200) {
              alert(jsonObj.msg);
            } else if (jsonObj.code === 200) {
              const info = jsonObj.data;
              this.meets = info
            }
          });
      },
      submitMeet(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.$http.post("/api/CreateMeetServlet", this.form)
              .then(function (res) {
                const jsonObj = JSON.parse(JSON.stringify(res.data));
                if (jsonObj.code != 200) {
                  alert(jsonObj.msg);
                } else if (jsonObj.code === 200) {
                  this.getMeetss()
                  this.open2()
                }
              });
            this.dialogFormVisible = false
          } else {

            console.log("error submit!!");
            return false;
          }
        });
      },
      joinMeet(meet) {
        this.joinmeet.id = meet.id
        const temp = Cookies.get('user')
        this.joinmeet.userMail = temp.mail;


      },
      requestMeet() {
        this.dialogFormVisible = true
      },
      open(meet) {
        this.$confirm('是否从参加此次会议?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '参加成功!'

          });
          this.joinMeet(meet)
        }).catch(() => {
        });
      },
      open2() {
        const h = this.$createElement;
        this.$notify({
          title: '成功',
          message: h('i', { style: 'color: teal'}, '会议申请成功')
        });
      },
    },
    mounted() {
      this.user=JSON.parse(Cookies.get('user'));
      this.getMeetss()


    }

  }

</script>
<style>
</style>
