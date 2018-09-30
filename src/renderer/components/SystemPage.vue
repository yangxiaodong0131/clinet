<template>
  <div>
    <nav-bar></nav-bar>
    <main>
      <div class="row">
        <div class="col-12">
          <load-bar v-if="toolbar == '系统服务-本地文件导入'"></load-bar>
          <server-bar v-if="toolbar == '系统服务-远程服务器设置'"></server-bar>
          <drg-bar v-if="toolbar == '系统服务-DRG分组服务'"></drg-bar>
          <stat-bar v-if="toolbar == '系统服务-DRG分析计算'"></stat-bar>
        </div>
        <div class="col-2">
          <left-panel></left-panel>
        </div>
        <div class="col-10">
          <right-panel></right-panel>
        </div>
      </div>
    </main>
    <notice-bar></notice-bar>
  </div>
</template>

<script>
  import NavBar from './HomePage/NavBar';
  import LeftPanel from './SystemPage/LeftPanel';
  import RightPanel from './SystemPage/RightPanel';
  import NoticeBar from './HomePage/NoticeBar';
  import LoadBar from './SystemPage/LoadBar';
  import ServerBar from './SystemPage/ServerBar';
  import DrgBar from './SystemPage/DrgBar';
  import StatBar from './SystemPage/StatBar';
  import RightPanelLoad from './SystemPage/RightPanelLoad';
  import RightPanelServer from './SystemPage/RightPanelServer';
  import RightPanelDrg from './SystemPage/RightPanelDrg';
  import RightPanelStat from './SystemPage/RightPanelStat';

  export default {
    name: 'system-page',
    components: { NavBar, LeftPanel, RightPanel, NoticeBar, DrgBar, ServerBar, LoadBar, StatBar, RightPanelLoad, RightPanelServer, RightPanelDrg, RightPanelStat },
    computed: {
      toolbar: {
        get() {
          return this.$store.state.Home.navbar
        }
      }
    },
  };
</script>

<style>
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: '黑体';
  }
  main {
    display: flex;
    justify-content: space-between;
    margin-top: 25px;
    padding: 0;
  }
</style>
