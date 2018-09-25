<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-primary sticky-top">
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#edit-rightbar-nav" aria-controls="edit-rightbar-nav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="edit-rightbar-nav">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle text-light" href="#" id="edit-rightbar-choice" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            {{helpType}}
          </a>
          <div class="dropdown-menu" id="edit-rightbar-sel" aria-labelledby="edit-rightbar-choice">
            <a class="dropdown-item" href="#" v-on:click="help('编辑器使用帮助')">编辑器使用帮助</a>
            <div class="dropdown-divider"></div>
            <a v-for="(data, index) in helpTypes" v-bind:key='index' class="dropdown-item" href="#" v-on:click='help(data)' v-bind:id="'edit-rightbar-'+data">{{data}}</a>
          </div>
        </li>

        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle text-light" href="#" id="edit-rightbar-choice" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            {{navType}}
          </a>
          <div class="dropdown-menu" id="edit-rightbar-sel" aria-labelledby="edit-rightbar-choice">
            <a class="dropdown-item" href="#" v-on:click="localData(dataType)">本地</a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" href="#" v-on:click="serverData(dataType)">远程</a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" href="#" v-on:click="blockData(dataType)">区块链</a>
          </div>
        </li>

        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle text-light" href="#" id="edit-rightbar-choice" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            {{dataType}}
          </a>
          <div class="dropdown-menu" id="edit-rightbar-sel" aria-labelledby="edit-rightbar-choice">
            <a class="dropdown-item" href="#" v-on:click="navBar('用户')">用户</a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" href="#" v-on:click="navBar('客户')">客户</a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" href="#" v-on:click="navBar('文档')">文档</a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" href="#" v-on:click="navBar('模板')">模板</a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" href="#" v-on:click="navBar('新建')">新建</a>
          </div>
        </li>
      </ul>
      <form class="form-inline my-2 my-lg-0" v-on:submit.prevent>
        <input class="form-control mr-sm-2" type="search" placeholder="模糊查询" aria-label="Search" v-on:keyup.enter="rightEnter" v-model="rightItem">
      </form>
    </div>
  </nav>
</template>

<script>
  import { getEditFiles, getEdit } from '../../utils/EditServerFile'
  import { rightBarHelp, getLocalFiles } from '../../utils/EditOperation'
  import dataDB from '../../utils/dataDB';
  export default {
    data() {
      return {
        name: this.$route.name,
        rightItem: '',
      };
    },
    computed: {
      helpType: {
        get() {
          return this.$store.state.Edit.helpType
        },
        set() {}
      },
      helpTypes: {
        get() {
          return this.$store.state.Edit.helpTypes
        }
      },
      dataType: {
        get() {
          return this.$store.state.Edit.dataType
        },
        set() {}
      },
      navType: {
        get() {
          return this.$store.state.Edit.navType
        },
        set() {}
      },
    },
    methods: {
      help: function (n) {
        rightBarHelp(this, n)
      },
      navBar: function (n) {
        if (n !== this.$store.state.Edit.dataType) {
          this.$store.commit('EDIT_SET_RIGHT_TYPE', null);
        }
        const navType = this.$store.state.Edit.navType
        this.$store.commit('EDIT_SET_DATA_TYPE', n);
        switch (navType) {
          case '本地':
            this.localData(n)
            break;
          case '远程':
            this.serverData(n)
            break;
          case '区块链':
            this.blockData(n)
            break;
          default:
            break;
        }
      },
      localData: function (x) {
        getLocalFiles(this, x)
      },
      serverData: function (x) {
        const navType = this.$store.state.Edit.navType
        if (navType !== '远程') {
          this.$store.commit('EDIT_SET_RIGHT_TYPE', null);
        }
        this.$store.commit('EDIT_SET_NAV_TYPE', '远程');
        // getHelpTypes(this, [this.$store.state.System.server, this.$store.state.System.port])
        // getDocTypes(this, [this.$store.state.System.server, this.$store.state.System.port], this.$store.state.System.user.username)
        // this.$store.commit('EDIT_SET_CHAT_TYPE', false);
        if (x === '文档') {
          this.$store.commit('EDIT_SET_SERVER_TYPE', 'file');
        } else {
          this.$store.commit('EDIT_SET_SERVER_TYPE', 'user');
        }
        this.$store.commit('EDIT_SET_RIGHT_PANEL', 'server');
        if (!this.$store.state.System.user.login) {
          this.$store.commit('SET_NOTICE', '未登录用户,请在系统服务-用户设置内登录');
          this.$store.commit('EDIT_SERVER_FILES', []);
          // this.$store.commit('EDIT_SET_RIGHT_PANEL', 'server');
        } else {
          this.$store.commit('EDIT_SET_RIGHT_PANELS', '远程文件');
          this.$store.commit('SET_NOTICE', '读取远程文件');
          dataDB(this, 'server', 'cda', { fileType: 'cda' }, 'editTypes', { type: this.$store.state.Edit.serverType, username: this.$store.state.System.user.username })
          // getEditFiles(this, [this.$store.state.System.server, this.$store.state.System.port], this.$store.state.Edit.serverType, this.$store.state.System.user.username, 'server')
        }
      },
      blockData: function (x) {
        const navType = this.$store.state.Edit.navType
        if (navType !== '区块链') {
          this.$store.commit('EDIT_SET_RIGHT_TYPE', null);
        }
        this.$store.commit('EDIT_SET_NAV_TYPE', '区块链');
        this.$store.commit('EDIT_SET_RIGHT_PANELS', '区块链文件');
        this.$store.commit('SET_NOTICE', '读取区块链文件');
        if (x === '文档') {
          this.$store.commit('EDIT_SET_SERVER_TYPE', 'file');
        } else {
          this.$store.commit('EDIT_SET_SERVER_TYPE', 'user');
        }
        getEditFiles(this, [this.$store.state.System.server, this.$store.state.System.port], this.$store.state.Edit.serverType, this.$store.state.System.user.username, 'block')
        this.$store.commit('EDIT_SET_RIGHT_PANEL', 'block');
      },
      rightEnter(e) {
        if (this.$store.state.Edit.rightPanel === 'local') {
          const files = this.$store.state.Edit.files
          const index = files.indexOf(e.target.value)
          if (index === -1) {
            this.$store.commit('SET_NOTICE', '未查找到，请输入完整内容！')
          } else {
            this.$store.commit('EDIT_SET_FILES_INDEX', index);
          }
          this.rightItem = ''
        } else if ((this.$store.state.Edit.rightPanel === 'block' || this.$store.state.Edit.rightPanel === 'server') && this.$store.state.Edit.serverType === 'file') {
          getEditFiles(this, [this.$store.state.System.server, this.$store.state.System.port], this.$store.state.Edit.serverType, this.$store.state.System.user.username, this.$store.state.Edit.rightPanel)
          if (this.$store.state.Edit.files === []) {
            this.$store.commit('SET_NOTICE', '未查找到，请输入完整用户名！')
          }
        } else if (this.$store.state.Edit.rightPanel === 'server' && this.$store.state.Edit.serverType === 'show') {
          getEdit(this, [this.$store.state.System.server, this.$store.state.System.port, e.target.value])
          if (this.$store.state.Edit.files === []) {
            this.$store.commit('SET_NOTICE', '未查找到，请输入完整内容！')
          }
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
  #edit-rightbar-nav {
    background-image: linear-gradient(to right , #4772fe, #7997fa);
  }
  .nav-link {
    color:#ffffff;
  }
</style>
