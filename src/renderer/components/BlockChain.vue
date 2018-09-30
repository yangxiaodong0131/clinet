<template>
  <div>
    <nav-bar></nav-bar>
    <main>
      <!-- <div class="row">
        <div class="col-2">
          <left-panel></left-panel>
        </div>
        <div class="col-10">
          <right-panel></right-panel>
        </div>
      </div> -->
      <div class="row">
        <div class="col-12">
          <server-bar v-if="toolbar == '区块链服务-服务器节点设置'"></server-bar>
          <user-bar v-if="toolbar == '区块链服务-账户设置'"></user-bar>
          <block-bar v-if="toolbar == '区块链服务-区块查询'"></block-bar>
          <drg-bar v-if="toolbar == '区块链服务-DRG分组服务'"></drg-bar>
          <stat-bar v-if="toolbar == '区块链服务-DRG分析计算'"></stat-bar>
          <share-bar v-if="toolbar == '区块链服务-共享查询'"></share-bar>
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
  import LeftPanel from './BlockChain/LeftPanel';
  import RightPanel from './BlockChain/RightPanel';
  import NoticeBar from './HomePage/NoticeBar';
  import UserBar from './BlockChain/UserBar';
  import BlockBar from './BlockChain/BlockBar';
  import ServerBar from './BlockChain/ServerBar';
  import DrgBar from './BlockChain/DrgBar';
  import StatBar from './BlockChain/StatBar';
  import ShareBar from './BlockChain/ShareBar';

  export default {
    name: 'block-chain',
    components: { NavBar, LeftPanel, RightPanel, NoticeBar, DrgBar, ServerBar, UserBar, StatBar, BlockBar, ShareBar },
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
  }

  main {
    display: flex;
    justify-content: space-between;
  }

  main > div { flex-basis: 100%; }

</style>
