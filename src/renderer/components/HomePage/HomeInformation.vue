<template>
  <div class="row">
    <div class="col-md-6" style="marginTop: 10px">
      <div>
        <h3>操作日志</h3>
        <hr />
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>操作时间</th>
              <th>功能模块</th>
              <th>操作内容</th>
            </tr>
          </thead>
          <tbody>
            <tr class="table-active" v-for="(record, i) in records" v-bind:key='i'>
              <td>{{record.datetime}}</td>
              <td>{{record.type}}-{{record.mode}}</td>
              <td>{{record.value}}</td>
            </tr>
          </tbody>
        </table>
        <nav aria-label="Page navigation example">
          <ul class="pagination">
            <li v-bind:class="{'disabled':value.page == page}" v-for= "(value, index) in pageList" v-bind:key="index" v-on:click="serverPage(value.page)"><a class="page-link" href="#">
              {{value.num}}
            </a></li>
          </ul>
        </nav>
      </div>
    </div>
    <div class="col-md-6" style="marginTop: 10px">
      <div>
        <h3>数据展示</h3>
        <hr />
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>数据表</th>
              <th>个人数据</th>
              <th>上传数据</th>
              <th>发布数据</th>
            </tr>
          </thead>
          <tbody>
            <tr class="table-active">
              <td>CDA文档</td>
              <td>{{count.cda.user}}</td>
              <td>{{count.cda.server}}</td>
              <td>{{count.cda.block}}</td>
            </tr>
            <tr class="table-active">
              <td>输入框提示</td>
              <td>{{count.help.user}}</td>
              <td>{{count.help.server}}</td>
              <td>{{count.help.block}}</td>
            </tr>
            <tr class="table-active">
              <td>病案质控</td>
              <td>{{count.cdh.user}}</td>
              <td>{{count.cdh.server}}</td>
              <td>{{count.cdh.block}}</td>
            </tr>
            <tr class="table-active">
              <td>专家提示</td>
              <td>{{count.symptom.user}}</td>
              <td>{{count.symptom.server}}</td>
              <td>{{count.symptom.block}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
  import { sGetRecord } from '../../utils/Server'
  // import LeftBar from '../EditPage/LeftBar';
  // export default {
  //   data() {
  //     return {
  //       name: this.$route.name,
  //       bcRecord: ['首次病程记录', '日常病程记录', '上级医师首次查房记录', '会诊记录', '疑难危重比管理讨论记录', '交接班记录', '转科记录', '有创诊疗操作病例'],
  //       wsqRecord: ['术前小结', '术前讨论', '麻醉术前访视记录', '麻醉记录', '手术记录', '手术安全检查记录', '手术清点记录', '术后首次病程记录', '麻醉术后访视记录'],
  //       cyRecord: ['出院记录', '死亡记录', '死亡病例讨论记录'],
  //       hlRecord: ['病种（病危护理记录）', '医嘱', '体温单'],
  //       zqRecord: ['手术同意书', '麻醉同意书', '输血知情同意书', '特殊检查、特殊治疗知情同意书', '病危通知书'],
  //       mzRecord: ['门诊病历', '门诊复诊', '急诊病历', '中医门诊'],
  //       tsRecord: ['新生儿病历', '产科病历', '儿科病历']
  //     };
  //   },
  //   methods: {
  //     load: function (n) {
  //       switch (n) {
  //         case '入院记录':
  //           this.$router.push('/edit');
  //           break;
  //         case 1:
  //           this.$router.push('/edit');
  //           break;
  //         case 2:
  //           this.$router.push('/stat');
  //           break;
  //         case 3:
  //           this.$router.push('/library');
  //           break;
  //         case 4:
  //           this.$router.push('/system');
  //           break;
  //         case 5:
  //           this.$router.push('/blockChain');
  //           break;
  //         case '健康体检':
  //           this.$router.push('/edit');
  //           this.$store.commit('EDIT_SET_DOC_TYPE', '健康体检')
  //           break;
  //         case '首次病程':
  //           this.$router.push('/edit');
  //           this.$store.commit('EDIT_SET_DOC_TYPE', '首次病程')
  //           break;
  //         case '入院申请':
  //           this.$router.push('/edit');
  //           LeftBar.methods.newDoc('入院申请')
  //           this.$store.commit('EDIT_SET_DOC_TYPE', '入院申请')
  //           break;
  //         case '门诊病案':
  //           this.$router.push('/edit');
  //           this.$store.commit('EDIT_SET_DOC_TYPE', '门诊病案')
  //           break;
  //         case '病程记录':
  //           this.$router.push('/edit');
  //           this.$store.commit('EDIT_SET_DOC_TYPE', '病程记录')
  //           break;
  //         case '病案首页':
  //           this.$router.push('/edit');
  //           this.$store.commit('EDIT_SET_DOC_TYPE', '病案首页')
  //           break;
  //         default:
  //           this.$router.push('/edit');
  //       }
  //     },
  //     myToggle: function (e) {
  //       e.stopPropagation()
  //       // document.getElementById('collapseSix').class('hide')
  //     }
  //   },
  // };

  // import hoemchart from '../../utils/HomeChart';
  export default {
    data() {
      return {
        name: this.$route.name,
        bcRecord: ['首次病程记录', '日常病程记录', '上级医师首次查房记录', '会诊记录', '疑难危重比管理讨论记录', '交接班记录', '转科记录', '有创诊疗操作病例'],
        wsqRecord: ['术前小结', '术前讨论', '麻醉术前访视记录', '麻醉记录', '手术记录', '手术安全检查记录', '手术清点记录', '术后首次病程记录', '麻醉术后访视记录'],
        cyRecord: ['出院记录', '死亡记录', '死亡病例讨论记录'],
        hlRecord: ['病种（病危护理记录）', '医嘱', '体温单'],
        zqRecord: ['手术同意书', '麻醉同意书', '输血知情同意书', '特殊检查、特殊治疗知情同意书', '病危通知书'],
        mzRecord: ['门诊病历', '门诊复诊', '急诊病历', '中医门诊'],
        tsRecord: ['新生儿病历', '产科病历', '儿科病历']
      };
    },
    computed: {
      records: {
        get() {
          return this.$store.state.Home.record
        }
      },
      count: {
        get() {
          return this.$store.state.Home.count
        }
      },
      pageList: {
        get() {
          return this.$store.state.Home.recordPageList
        }
      },
      page: {
        get() {
          return this.$store.state.Home.recordPage
        }
      },
    },
    // mounted: function () {
    //   hoemchart('homechart')
    // },
    methods: {
      serverPage: function (page) {
        sGetRecord(this, [this.$store.state.System.server, this.$store.state.System.port], page)
      },
    },
  };
</script>

<style scoped>
/* *{margin: 0;padding: 0;border: 0}  */
  h3{
    padding: 0
  }
  span{
    margin-right: 10px
  }
</style>
