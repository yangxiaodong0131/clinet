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
            <a class="dropdown-item" href="#" v-on:click="navBar('病案文档')">病案文档</a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" href="#" v-on:click="navBar('数据分析')">数据分析</a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" href="#" v-on:click="navBar('数据字典')">数据字典</a>
          </div>
        </li>

        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle text-light" href="#" id="edit-rightbar-choice" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            {{dataType}}
          </a>
          <div class="dropdown-menu" id="edit-rightbar-sel" aria-labelledby="edit-rightbar-choice">
            <a class="dropdown-item" href="#" v-on:click="localData()">本地-文档</a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" href="#" v-on:click="serverData('远程-用户')">远程-用户</a>
            <a class="dropdown-item" href="#" v-on:click="serverData('远程-文档')">远程-文档</a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" href="#" v-on:click="blockData('区块链-用户')">区块链-用户</a>
            <a class="dropdown-item" href="#" v-on:click="blockData('区块链-文档')">区块链-文档</a>
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
  import { getEditFiles, getEdit, getDocTypes, getHelpTypes } from '../../utils/EditServerFile'
  import { rightBarHelp } from '../../utils/EditOperation'
  import dataDB from '../../utils/dataDB';
  export default {
    data() {
      return {
        name: this.$route.name,
        rightItem: '',
        // helpType: '编辑器使用帮助'
      };
    },
    computed: {
      isSaveLocal: {
        get() {
          let length = null
          if (this.$store.state.Edit.isSaveLocal.length > 0) {
            length = this.$store.state.Edit.isSaveLocal.length
          }
          return length
        }
      },
      isSaveServer: {
        get() {
          let length = null
          if (this.$store.state.Edit.isSaveServer.length > 0) {
            length = this.$store.state.Edit.isSaveServer.length
          }
          return length
        }
      },
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
        this.$store.commit('EDIT_SET_NAV_TYPE', n);
        if (n === '病案文档') {
          switch (this.$store.state.Edit.dataType) {
            case '本地-文档':
              this.$store.commit('EDIT_SET_LAST_NAV', '/edit');
              this.$store.commit('EDIT_SET_RIGHT_PANEL', 'local');
              this.localData()
              break;
            case '远程-用户':
              this.$store.commit('EDIT_SET_RIGHT_PANEL', 'server');
              this.serverData('远程-文档')
              break;
            case '远程-文档':
              this.$store.commit('EDIT_SET_RIGHT_PANEL', 'server');
              this.serverData('远程-文档')
              break;
            case '区块链-用户':
              this.blockData('区块链-用户')
              break;
            case '区块链-文档':
              this.blockData('区块链-文档')
              break;
            default:
              break;
          }
        } else if (n === '数据分析') {
          this.$store.commit('EDIT_SET_LAST_NAV', '/edit');
          switch (this.$store.state.Edit.dataType) {
            case '本地-文档':
              dataDB(this, 'local', 'statFile', {}, 'statFiles', { fileType: '', username: this.$store.state.System.user.username, tableType: 'local' })
              break;
            case '远程-文档': case '远程-用户':
              this.$store.commit('STAT_SET_TABLE_TYPE', 'server');
              dataDB(this, 'server', 'statFile', {}, 'statFiles', { fileType: '', username: this.$store.state.System.user.username, tableType: 'server' })
              break;
            case '区块链-用户': case '区块链-文档':
              dataDB(this, 'block', 'statFile', {}, 'statFiles', { fileType: '', username: this.$store.state.System.user.username, tableType: 'block' })
              break;
            default:
              break;
          }
        } else if (n === '数据字典') {
          switch (this.$store.state.Edit.dataType) {
            case '本地-文档':
              dataDB(this, 'local', 'libraryFile', null, 'libraryFiles', null)
              break;
            case '远程-文档': case '远程-用户':
              this.$store.commit('LIBRARY_SET_TABLE_TYPE', 'server');
              dataDB(this, 'server', 'libraryFile', null, 'libraryFiles', null)
              break;
            case '区块链-用户': case '区块链-文档':
              dataDB(this, 'block', 'libraryFile', null, 'libraryFiles', null)
              break;
            default:
              break;
          }
        }
      },
      localData: function () {
        this.$store.commit('EDIT_SET_DATA_TYPE', '本地-文档');
        this.$store.commit('EDIT_SET_RIGHT_PANELS', '本地文件');
        this.$store.commit('EDIT_SET_DOC_TYPES', ['自定义文档', '病案首页（卫统四CSV）', '入院申请', '首次病程', '病程记录', '病案首页', '门诊病案', '健康体检']);
        this.$store.commit('EDIT_SET_HELP_TYPES', ['输入框提示', '病案参考', '病案历史', '在线交流', '病案质控', '专家提示', 'DRG分析', 'HIS接口'])
        this.$store.commit('EDIT_SET_CHAT_TYPE', false);
        this.$store.commit('EDIT_SET_RIGHT_PANEL', 'local');
        switch (this.$store.state.Edit.lastNav) {
          case '/stat':
            this.$store.commit('STAT_LOAD_FILES');
            break;
          case '/library':
            this.$store.commit('LIBRARY_LOAD_FILES');
            break;
          case '/system':
            this.$store.commit('SYSTEM_GET_FILES');
            break;
          default:
            this.$store.commit('EDIT_SET_LAST_NAV', '/edit');
            dataDB(this, 'local', 'cda', { fileType: 'cda' }, 'editTypes', null, null)
        }
        this.$store.commit('SET_NOTICE', '读取本地文件');
        this.$store.commit('EDIT_SET_HINT_TYPE', 'notice');
      },
      serverData: function (x) {
        this.$store.commit('EDIT_SET_DATA_TYPE', x);
        getHelpTypes(this, [this.$store.state.System.server, this.$store.state.System.port])
        getDocTypes(this, [this.$store.state.System.server, this.$store.state.System.port], this.$store.state.System.user.username)
        this.$store.commit('EDIT_SET_CHAT_TYPE', false);
        if (x === '远程-文档') {
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
          getEditFiles(this, [this.$store.state.System.server, this.$store.state.System.port], this.$store.state.Edit.serverType, this.$store.state.System.user.username, 'server')
        }
      },
      blockData: function (x) {
        this.$store.commit('EDIT_SET_DATA_TYPE', x);
        this.$store.commit('EDIT_SET_RIGHT_PANELS', '区块链文件');
        this.$store.commit('SET_NOTICE', '读取区块链文件');
        if (x === '区块链-文档') {
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
