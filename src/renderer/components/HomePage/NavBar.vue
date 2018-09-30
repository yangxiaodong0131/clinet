<template>
  <nav class="navbar navbar-expand-lg navbar-dark fixed-top">
    <a class="navbar-brand" href="#" v-on:click="onClick('首页')" id="navbar-home">&nbsp;&nbsp;&nbsp;&nbsp;HITB-Clinet&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item dropdown" v-on:click="onClick('数据采集-数据采集')" id="navbar-edit" >
          <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            电子病历
          </a>
          <div class="dropdown-menu" aria-labelledby="navbarDropdown">
            <a class="dropdown-item" href="#" v-on:click="onClick('数据采集-数据采集')">电子病历</a>
            <div class="dropdown-divider"></div>
          </div>
        </li>
        <li class="nav-item dropdown" v-on:click="onClick('数据分析-数据分析')" id="navbar-stat">
          <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            数据分析
          </a>
          <div class="dropdown-menu" aria-labelledby="navbarDropdown">
            <a class="dropdown-item" href="#" v-on:click="onClick('数据分析-数据分析')">数据分析</a>
            <div class="dropdown-divider"></div>
          </div>
        </li>
        <li class="nav-item dropdown" v-on:click="onClick('术语字典-术语字典')" id="navbar-library">
          <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            术语字典
          </a>
          <div class="dropdown-menu" aria-labelledby="navbarDropdown">
            <a class="dropdown-item" href="#" v-on:click="onClick('术语字典-术语字典')">术语字典</a>
            <div class="dropdown-divider"></div>
          </div>
        </li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="navbar-system" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            系统服务
          </a>
          <div class="dropdown-menu" aria-labelledby="navbarDropdown">
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" href="#" v-on:click="onClick('系统服务-本地文件导入')" id="navbar-system-local">本地文件导入</a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" href="#" v-on:click="onClick('系统服务-远程服务器设置')" id="navbar-system-server">远程服务器设置</a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" href="#" v-on:click="onClick('系统服务-DRG分组服务')" id="navbar-system-compdrg">DRG分组服务</a>
            <a class="dropdown-item" href="#" v-on:click="onClick('系统服务-DRG分析计算')" id="navbar-system-statdrg">DRG分析计算</a>
            <div class="dropdown-divider"></div>
          </div>
        </li>
        <li class="nav-item dropdown"  v-if="this.$store.state.System.user.login">
          <a class="nav-link dropdown-toggle" href="#" id="navbar-block" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            区块链服务
          </a>
          <div class="dropdown-menu" aria-labelledby="navbarDropdown">
            <a class="dropdown-item" href="#" v-on:click="onClick('区块链服务-服务器节点设置')" id="navbar-block-server">区块链服务介绍</a>
            <a class="dropdown-item" href="#" v-on:click="onClick('区块链服务-账户设置')" id="navbar-block-account">账户设置</a>
            <a class="dropdown-item" href="#" v-on:click="onClick('区块链服务-区块查询')" id="navbar-block-block">区块查询</a>
            <div class="dropdown-divider"></div>
          </div>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#"  id="navbar-currentTime">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{currentTime}}</a>
        </li>
      </ul>
    </div>
    <a class="navbar-brand" href="#" id="navbar-username" v-on:click="onClick(userName)">&nbsp;&nbsp;&nbsp;&nbsp;{{userName}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a>
    <!-- <a v-on:click="test()">测试按钮</a> -->
  </nav>
</template>

<script>
  import loadFile from '../../utils/LoadFile';
  import { offline } from '../../utils/Socket';
  // import { getLocalFiles } from '../../utils/EditOperation'
  // import { getDocTypes, getHelpTypes, getEditFiles } from '../../utils/EditServerFile'
  import { open } from '../../utils/BlockAccount'
  import { bcBlockchain } from '../../utils/BlockBlock'
  import dataDB from '../../utils/dataDB';
  export default {
    data() {
      return {
        currentTime: new Date().toLocaleString(),
        blockUsername: 'someone manual strong movie roof episode eight spatial brown soldier soup motor'
      };
    },
    computed: {
      userName: {
        get() {
          let user = ''
          const username = this.$store.state.System.user.username
          if (username === '') {
            user = '未登录...'
          } else {
            user = '你好, '.concat(username)
          }
          return user
        }
      }
    },
    methods: {
      // test: function () {
      //   const x = '未保存病案.cda'
      //   saveFile(this, x)
      // },
      created: function () {
        this.$nextTick(function () {
          this.timer()
        })
      },
      timer: function () {
        this.getTime = () => {
          this.currentTime = new Date().toLocaleString();
        }
        setInterval(this.getTime, 1000);
      },
      onClick: function (n) {
        this.$store.commit('SET_NAVBAR', n);
        this.$store.commit('SET_NOTICE', n);
        if (n.includes('你好')) {
          n = '已登录'
        }
        // if (n !== '数据采集-数据采集' && n !== '未登录...' && this.$store.state.Edit.doc.length > 0) {
        //   // cacheEditDoc(this)
        //   // saveEditDoc(this, this.$store.state.Edit.doc)
        // }
        switch (n) {
          case '首页':
            this.$router.push('/home');
            break;
          case '数据采集-数据采集':
            this.$router.push('/edit');
            this.$store.commit('EDIT_SET_RIGHT_PANELS', '本地文件类型');
            this.$store.commit('EDIT_SET_RIGHT_PANEL', 'local');
            dataDB(this, 'local', 'cda', { fileType: 'model' }, 'editModels', null, null)
            dataDB(this, 'local', 'cda', { fileType: 'cda' }, 'editTypes', null, null)
            break;
          case '数据分析-数据分析':
            this.$router.push('/stat');
            break;
          case '术语字典-术语字典':
            this.$router.push('/library');
            this.$store.commit('LIBRARY_LOAD_FILES');
            this.$store.commit('LIBRARY_SET_TABLE_TYPE', 'local');
            break;
          case '系统服务-本地文件导入':
            this.$router.push('/system');
            this.$store.commit('SYSTEM_GET_FILES');
            this.$store.commit('SYSTEM_SET_TOOLBAR', 'files');
            break;
          case '系统服务-远程服务器设置':
            this.$router.push('/system');
            dataDB(this, 'local', 'server', {}, 'serverConfig', {}, null, null)
            this.$store.commit('SYSTEM_SET_TOOLBAR', 'getServers');
            break;
          case '系统服务-DRG分组服务':
            this.$router.push('/system');
            this.$store.commit('SYSTEM_SET_TOOLBAR', 'getLocalData');
            this.$store.commit('SYSTEM_SET_COMPUTE_DATA', 'getLocalData');
            this.$store.commit('SYSTEM_LOAD_WT4_FILES');
            break;
          case '系统服务-DRG分析计算':
            this.$router.push('/system');
            this.$store.commit('SYSTEM_SET_TOOLBAR', 'serverData');
            break;
          case '区块链服务-服务器节点设置':
            this.$router.push('/blockChain');
            this.$store.commit('BLOCK_SET_TOOLBAR', 'getServers');
            this.$store.commit('BLOCK_SET_TOOLBAR', 'blockChainInfo');
            break;
          case '区块链服务-账户设置':
            this.$router.push('/blockChain');
            this.$store.commit('BLOCK_SET_TOOLBAR', 'setUser');
            this.$store.commit('SET_NOTICE', '账户设置');
            open(this, [this.$store.state.System.server, 4000, this.blockUsername, 1, this.$store.state.System.user.username]);
            break;
          case '区块链服务-区块查询':
            this.$router.push('/blockChain');
            bcBlockchain(this, [this.$store.state.System.server, 4000, 1]);
            this.$store.commit('SET_NOTICE', '区块列表');
            this.$store.commit('BLOCK_SET_TOOLBAR', 'blockList');
            // this.$store.commit('BLOCK_SET_TOOLBAR', 'blockList');
            break;
          case '区块链服务-共享查询':
            this.$router.push('/blockChain');
            this.$store.commit('BLOCK_SET_TOOLBAR', 'blockShare');
            break;
          case '区块链服务-DRG分组服务':
            this.$router.push('/blockChain');
            this.$store.commit('BLOCK_SET_TOOLBAR', 'localData');
            break;
          case '区块链服务-DRG分析计算':
            this.$router.push('/blockChain');
            this.$store.commit('BLOCK_SET_TOOLBAR', 'serverStatData');
            break;
          case '未登录...':
            this.$router.push('/system');
            this.$store.commit('SYSTEM_SET_TOOLBAR', 'getServers');
            this.$store.commit('SET_NAVBAR', '系统服务-远程服务器设置');
            if (!this.$store.state.System.connectInfo) {
              loadFile(this, 'hitb_server.csv', 'system')
            }
            this.$store.commit('SYSTEM_SET_TOOLBAR', 'getUsers');
            this.$store.commit('SET_NOTICE', '用户设置');
            break;
          case '已登录':
            this.$store.commit('SET_NOTICE', '已登录');
            this.$router.push('/');
            offline(this, this.$store.state.System.user.username)
            this.$store.commit('EDIT_SET_DOC_TYPES', ['自定义文档', '病案首页（卫统四CSV）', '入院申请', '首次病程', '病程记录', '病案首页', '门诊病案', '健康体检']);
            this.$store.commit('EDIT_SET_RIGHT_PANEL', 'local');
            break;
          default:
            this.$store.commit('SET_NAVBAR', '登陆页');
            this.$store.commit('SET_NOTICE', '登陆页');
            this.$router.push('/');
        }
      },
    },
  };
</script>

<style scoped>
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  .navbar {
    background-image: linear-gradient(to right , #4772fe, #7997fa);
  }
  #navbarDropdown {
    color:#ffffff;
  }
  #navbarDropdown:hover {
    color:#d4cbcb;
  }
  #navbar-system {
    color:#ffffff;
  }
  #navbar-system:hover {
    color:#d4cbcb;
  }
  #navbar-block {
    color:#ffffff;
  }
  #navbar-block:hover {
    color:#d4cbcb;
  }
  #navbar-currentTime {
    color:#ffffff;
  }
  #navbar-currentTime:hover {
    color:#d4cbcb;
  }

</style>
