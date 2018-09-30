<template>
  <div>
     <right-panel-load v-if="toolbar == '系统服务-本地文件导入'"></right-panel-load>
    <right-panel-server v-if="toolbar == '系统服务-远程服务器设置'"></right-panel-server>
    <right-panel-drg v-if="toolbar == '系统服务-DRG分组服务'"></right-panel-drg>
    <right-panel-stat v-if="toolbar == '系统服务-DRG分析计算'"></right-panel-stat>
  </div>
</template>

<script>
  import RightPanelLoad from './RightPanelLoad';
  import RightPanelServer from './RightPanelServer';
  import RightPanelDrg from './RightPanelDrg';
  import RightPanelStat from './RightPanelStat';

  export default {
    components: { RightPanelLoad, RightPanelServer, RightPanelDrg, RightPanelStat },
    data() {
      return {
        flag: null
      }
    },
    computed: {
      toolbar: {
        get() {
          return this.$store.state.Home.navbar
        }
      }
    },
    methods: {
    },
  };
</script>

<style scoped>

</style>
