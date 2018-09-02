<template>
  <div style="height:400px; overflow-y:auto;">
    <table id="stat-left-file-table">
      <tr>
        <th id="stat-left-file-th" class="table-danger"> 数据分析文件</th>
      </tr>
      <tr v-for="(data, index) in xs" v-bind:key='index' v-on:click="loadFile(data, index)" v-bind:class="{'table-danger':flag === index}" v-bind:id="'stat-left-file-tr'+index">
        <td>{{data}}</td>
      </tr>
    </table>
  </div>
</template>

<script>
  import dataDB from '../../utils/dataDB';
  export default {
    data() {
      return {
        // flag: null
      };
    },
    computed: {
      flag: {
        get() {
          let flag = []
          flag = this.$store.state.Stat.fileIndex.first
          return flag
        }
      },
      xs: {
        get() {
          let xs = []
          if (this.$store.state.Stat.isServer) {
            xs = this.$store.state.Stat.serverMenu.first
          } else {
            xs = this.$store.state.Stat.files
          }
          return xs
        }
      },
    },
    methods: {
      loadFile: function (data, index) {
        // 设置文件高亮
        this.$store.commit('STAT_SET_FILE_INDEX', ['first', index]);
        this.$store.commit('STAT_TABLE_NAME', data)
        this.$store.commit('STAT_SET_TABLE_PAGE', 1);
        this.$store.commit('STAT_CLEAR_SERVER_SORT')
        if (this.$store.state.Stat.tableType === 'local') {
          this.$store.commit('STAT_SET_CHART_IS_SHOW', 'chart');
        } else {
          this.$store.commit('STAT_SET_CHART_IS_SHOW', 'menu');
        }
        if (data.endsWith('.csv')) {
          dataDB(this, this.$store.state.Stat.tableType, 'stat', {}, 'statFile', { fileType: data, username: this.$store.state.System.user.username, tableType: this.$store.state.Stat.tableType, dimension: this.$store.state.Stat.dimension, order: this.$store.state.Stat.serverSort }, 0, 20)
        } else if (this.$store.state.Stat.tableType === 'local') {
          dataDB(this, this.$store.state.Stat.tableType, 'stat', {}, 'statFile', { fileType: data, username: this.$store.state.System.user.username, tableType: this.$store.state.Stat.tableType, dimension: this.$store.state.Stat.dimension, order: this.$store.state.Stat.serverSort }, 0, 20)
        } else {
          if (this.$store.state.Stat.serverMenu.type === '二级菜单') {
            this.$store.commit('STAT_SET_SERVER_MENU', ['三级菜单', []]);
          }
          dataDB(this, this.$store.state.Stat.tableType, 'statFile', {}, 'statFiles', { fileType: data, username: this.$store.state.System.user.username, tableType: this.$store.state.Stat.tableType, dimension: this.$store.state.Stat.dimension, order: this.$store.state.Stat.serverSort }, 0, 20)
        }
      },
    },
  };
</script>

<style scoped>

</style>
