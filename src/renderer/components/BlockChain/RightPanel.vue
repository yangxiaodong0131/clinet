<template>
  <div>
    <right-panel-server v-if="toolbar == '区块链服务-服务器节点设置'"></right-panel-server>
    <right-panel-user v-if="toolbar == '区块链服务-账户设置'"></right-panel-user>
    <right-panel-block v-if="toolbar == '区块链服务-区块查询'"></right-panel-block>
    <right-panel-share v-if="toolbar == '区块链服务-共享查询'"></right-panel-share>
    <right-panel-drg v-if="toolbar == '区块链服务-DRG分组服务'"></right-panel-drg>
    <right-panel-stat v-if="toolbar == '区块链服务-DRG分析计算'"></right-panel-stat>
  </div>
</template>

<script>

  import RightPanelUser from './RightPanelUser';
  import RightPanelBlock from './RightPanelBlock';
  import RightPanelServer from './RightPanelServer';
  import RightPanelDrg from './RightPanelDrg';
  import RightPanelStat from './RightPanelStat';
  import RightPanelShare from './RightPanelShare';

  export default {
    components: { RightPanelUser, RightPanelBlock, RightPanelServer, RightPanelDrg, RightPanelStat, RightPanelShare },
    computed: {
      toolbar: {
        get() {
          return this.$store.state.Home.navbar
        }
      }
    },
  };
</script>

<style scoped>

</style>
