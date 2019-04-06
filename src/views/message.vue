<template>
  <section style="align-content: center;width: 80%;padding-left: 10%">
    <div v-for="item in infos">
      <el-card class="box-card">
        <span>{{item.title}}</span>&nbsp;&nbsp;
        <span style="font-size: 5px">({{item.date}})</span>
        <el-button style="float: right; padding: 3px 0" @click="showDetails(item)" type="text">
          查看详情
        </el-button>
      </el-card>
     <br>
    </div>
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
  export default {
    data() {
      return {
        dialogVisible: false,
        // infos: [{title: "大事", date: "2019-10-1", details: "已经申报科创板项目的某券商投行人士李贺表示"},{title: "大事", date: "2019-10-1", details: "已经申报科创板项目的某券商投行人士李贺表示"}],
        infos:[],
        ditem: {
          title: '',
          date: '',
          details: ''
        }

      }


    }
    ,
    methods: {
      showDetails(msg) {
        this.ditem = msg
        this.dialogVisible = true

      },
      getmsg() {
        this.$http
          .post("/api/GetMessageServlet", this.userInfo)
          .then(function (res) {
            const jsonObj = JSON.parse(JSON.stringify(res.data));
            if (jsonObj.code != 200) {
            } else if (jsonObj.code === 200) {
              const info = jsonObj.data;
              this.infos = info
            }
          });


      }


    },
    mounted() {
      this.getmsg()
      {

      }

    }


  }


</script>
<style>

  .box-card {
    align-content: center;
  }
</style>
