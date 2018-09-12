<template>
  <div style="marginBottom: 10px">
    <div style="overflow:auto;">
      <table id="edit-rightpanellocal-table" v-show="chatType === false" v-if="!this.$store.state.Edit.rightFolds.includes(title)">
        <tr>
          <th colspan="10" class="table-info" id="edit-rightpanellocal-title"> {{title}}
            <a href="#" v-on:click="close" style="float: right">✖</a>
            <a v-if="xs" href="#" v-on:click="fold(title)" style="float: right; marginRight: 3px">&nbsp;↗</a>
            <span style="float: right">当前页：{{this.$store.state.Edit.filesPage}} / 共{{this.$store.state.Edit.filesNum}}页</span>
            <a href="#" v-on:click="page(1)" style="float: right">&nbsp;后页→</a>
            <a href="#" v-on:click="page(-1)" style="float: right">←前页</a>
          </th>
        </tr>
        <tr class="edit-rightpanellocal-tr" v-for="(data, index) in xs" v-bind:key='index' v-bind:id="'edit-rightpanellocal-tr'+index" v-bind:class="{'table-danger':flag == index}">
          <td v-on:click="loadFile(data[0], index)">{{index + 1}}</td>
          <td v-on:click="loadFile(data[0], index)">{{data[0]}}</td>
          <td v-on:click="loadFile(data[0], index)">{{data[1]}}</td>
          <!-- <td v-if ="title === '远程文件的用户列表' && data.split('').includes('-')">
            <a href="#" v-on:click="blockShare(data)">发布</a>
          </td>
          <td v-if="rightPanel === 'local' || (rightPanel === 'server' && serverType !== 'user')"><a href="#" v-on:click="delDoc(index)">删除</a></td>
          <td v-if="serverType !== 'user' && lastNav !== '/library' && rightPanel !== 'block'">
            <a href="#" v-on:click="loadDoc(data, index, 'show')">参考</a>
          </td>
          <td v-if="fileName.includes('@')"><a href="#" v-on:click="downloadDoc(data, index)">下载</a></td>
          <td v-if="data[2]" class="table-success"><a href="#" style="color: #000">已上传</a></td>
          <td v-if="(!fileName.includes('@') || rightPanel !== 'block') && !data[2]" class="table-warning">
            <a href="#" style="color: #000" v-on:click="uploadDoc(data, index)">未上传</a> -->
          <!-- </td> -->
        </tr>
      </table>
      <table v-if="this.$store.state.Edit.rightFolds.includes(title)">
      <tr>
        <th colspan="10" class="table-info" id="edit-rightpanellocal-title"> {{title}}
          <a href="#" v-on:click="close(title)" style="float: right">✖</a>
          <a href="#" v-on:click="fold(title)" style="float: right; marginRight: 5px">↙</a>
        </th>
      </tr>
      <tr  style="textAlign: center"><a href="#" v-on:click="fold(title)">...</a></tr>
    </table>
    </div>
    <table v-show="chatType === true">
      <div v-bind:style="{ height: height + 'px', overflow: 'auto' }" >
        <div v-for="(data, index) in socketRecord" v-bind:key='index'>
          <div style="width: 200px; margin: 0 auto"><span style="padding: 5px">{{data.time}}</span></div>
          <div v-if="data.username === username && data.message.includes('邀请您进入')" style="margin: 15px"><span class="alert alert-danger" style="padding: 5px">{{data.message}}</span></div>
          <div v-if="data.username !== username && data.message.includes('邀请您进入')" style="margin: 15px"><span class="alert alert-danger" style="padding: 5px">{{data.message}}</span></div>
          <div v-if="data.username === username" style="margin: 15px"><span class="alert alert-success" style="padding: 5px"><b>{{data.username}}</b>: {{data.message}}</span></div>
          <div v-if="data.username !== username" style="margin: 15px"><span class="alert alert-warning" style="padding: 5px"><b>{{data.username}}</b>: {{data.message}}</span></div>
        </div>
      </div>
    </table>
  </div>
</template>

<script>
  import { share } from '../../utils/Server';
  import { getDate, editPage } from '../../utils/EditOperation';
  import dataDB from '../../utils/dataDB';
  export default {
    data() {
      return {
        panelName: '',
      };
    },
    created: function () {
      this.height = document.body.clientHeight - 120
    },
    computed: {
      username: {
        get() {
          return this.$store.state.System.user.username
        }
      },
      chatType: {
        get() {
          return this.$store.state.Edit.chatType
        }
      },
      socketRecord: {
        get() {
          return this.$store.state.Edit.socketRecord
        }
      },
      title: {
        get() {
          let x = '用户本地的文件列表'
          this.panelName = '本地文件'
          if (this.$store.state.Edit.rightPanel === 'server') {
            x = '远程文件的用户列表'
            this.panelName = '远程文件'
            if (!this.$store.state.System.user.login) {
              x = '远程文件的用户列表（用户未登陆服务器，请先登陆！）'
            }
          } else if (this.$store.state.Edit.rightPanel === 'block') {
            x = '区块链文件的用户列表'
          }
          switch (this.$store.state.Edit.lastNav) {
            case '/stat':
              x = '数据分析文件列表'
              break;
            case '/library':
              x = '术语字典文件列表'
              break;
            case '/system':
              x = '本地导入文件列表'
              break;
            default:
              break
          }
          return x
        }
      },
      xs: {
        get() {
          let x = this.$store.state.Edit.files
          if (this.$store.state.Edit.lastNav === '/stat') {
            x = this.$store.state.Stat.files
          } else if (this.$store.state.Edit.lastNav === '/library') {
            x = this.$store.state.Library.files
          } else if (this.$store.state.Edit.lastNav === '/system') {
            x = this.$store.state.System.files
          }
          console.log(x)
          return x
        },
      },
      flag: {
        get() {
          return this.$store.state.Edit.filesIndex
        }
      },
      rightPanel: {
        get() {
          return this.$store.state.Edit.rightPanel
        }
      },
      serverType: {
        get() {
          return this.$store.state.Edit.serverType
        }
      },
      lastNav: {
        get() {
          return this.$store.state.Edit.lastNav
        }
      },
      fileName: {
        get() {
          return this.$store.state.Edit.fileName
        }
      }
    },
    methods: {
      loadFile: function (data, index) {
        this.$store.commit('EDIT_SET_FILES_INDEX', index)
        let tableType = 'local'
        if (this.$store.state.Edit.dataType.includes('远程')) {
          tableType = 'server'
        } else if (this.$store.state.Edit.dataType.includes('区块链')) {
          tableType = 'block'
        } else {
          tableType = 'local'
        }
        this.$store.commit('EDIT_SET_RIGHT_TYPE', 'table');
        if (this.$store.state.Edit.rightPanel === 'server' || this.$store.state.Edit.rightPanel === 'block') {
          switch (this.$store.state.Edit.lastNav) {
            case '/edit':
              if (this.$store.state.Edit.serverType === 'file' && this.$store.state.Edit.navType === '病案文档') {
                console.log('3333')
                dataDB(this, 'server', 'cda', { fileType: 'cda', fileName: data }, 'editFiles', { type: this.$store.state.Edit.serverType, username: this.$store.state.System.user.username, fileName: data })
              } else if (this.$store.state.Edit.serverType === 'user' && this.$store.state.Edit.navType === '病案文档') {
                this.$store.commit('EDIT_SET_SERVER_TYPE', 'file');
                console.log('2222')
                dataDB(this, 'server', 'cda', { fileType: 'cda', fileName: data }, 'editFiles', { type: this.$store.state.Edit.serverType, username: this.$store.state.System.user.username })
              } else if (this.$store.state.Edit.navType === '数据分析') {
                if (this.$store.state.Stat.serverMenu.type === '三级菜单') {
                  this.$store.commit('STAT_CLEAR_SERVER_DIMENSION');
                  this.$store.commit('STAT_CLEAR_SERVER_SORT');
                  dataDB(this, tableType, 'statFile', { fileType: data }, 'statFile', { fileType: data, username: this.$store.state.System.user.username, tableType: 'edit', dimension: this.$store.state.Stat.dimension, sort: this.$store.state.Stat.serverSort }, 0, 20)
                  this.$store.commit('EDIT_SET_RIGHT_TYPE', 'table');
                } else {
                  dataDB(this, tableType, 'statFile', { fileType: data }, 'statFiles', { fileType: data, username: this.$store.state.System.user.username, tableType: 'edit', dimension: this.$store.state.Stat.dimension, sort: this.$store.state.Stat.serverSort }, 0, 20)
                }
              } else if (this.$store.state.Edit.navType === '数据字典') {
                this.$store.commit('EDIT_SET_RIGHT_TYPE', 'table');
                dataDB(this, tableType, 'library', { fileType: data }, 'libraryFile', { type1: tableType, sort: this.$store.state.Library.serverSort, dimensionType: null, dimensionServer: this.$store.state.Library.serverDimension }, 0, 30)
              }
              break;
            default:
              break;
          }
        } else {
          switch (this.$store.state.Edit.lastNav) {
            case '/edit':
              if (this.$store.state.Edit.navType === '数据分析') {
                dataDB(this, tableType, 'statFile', {}, 'statFiles', { fileType: '', username: this.$store.state.System.user.username, tableType })
              } else if (this.$store.state.Edit.navType === '数据字典') {
                // dataDB(this, tableType, 'library', { fileType: data }, 'libraryFile', { type1: tableType, sort: this.$store.state.Library.serverSort, dimensionType: null, dimensionServer: this.$store.state.Library.serverDimension }, 0, 30)
                dataDB(this, tableType, 'libraryFile', null, 'libraryFiles', null)
              } else {
                dataDB(this, 'local', 'cda', { docType: data }, 'editFiles', null)
              }
              break;
            default:
              break;
          }
        }
      },
      close(data) {
        this.$store.commit('EDIT_DELETE_RIGHT_PANELS', data);
      },
      blockShare(data) {
        if (data.split('-')[0] === this.$store.state.System.user.username) {
          share(this, [this.$store.state.System.server, this.$store.state.System.port], 'edit', data, this.$store.state.System.user.username, '')
        } else {
          this.$store.commit('SET_NOTICE', '用户权限不够，不能够发布他人文件');
        }
        const currentdate = getDate()
        this.$store.commit('EDIT_UPDATE_DOC_HEADER', ['发布时间', currentdate]);
        this.$store.commit('EDIT_SET_DOC_STATE');
      },
      page: function (n) {
        console.log(n)
        editPage(this, n)
      },
      delDoc: function (index) {
        console.log(index)
        // this.$store.commit('EDIT_DELETE_FILE', index);
        // this.$store.commit('EDIT_DELETE_DOC_SUMMARY', index);
        // this.$store.commit('SET_NOTICE', '删除成功');
        // this.$store.commit('EDIT_SET_HINT_TYPE', 'notice');
        // this.$store.commit('EDIT_SET_DELETE_LOCAL', index[0])
        // dataDB(this, 'local', 'cda', { fileType: 'cda', fileIndex: index }, 'remove', null)
      },
      fold(data) {
        this.$store.commit('EDIT_SET_RIGHT_FOLDS', data);
      }
    },
  };
</script>

<style scoped>

</style>
