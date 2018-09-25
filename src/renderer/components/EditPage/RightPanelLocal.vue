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
          return x
        }
      },
      xs: {
        get() {
          const x = this.$store.state.Edit.files
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
      fileName: {
        get() {
          return this.$store.state.Edit.fileName
        }
      }
    },
    methods: {
      loadFile: function (data, index) {
        const navType = this.$store.state.Edit.navType
        this.$store.commit('EDIT_SET_FILES_INDEX', index)
        this.$store.commit('EDIT_SET_RIGHT_TYPE', 'table');
        if (this.$store.state.Edit.rightPanel === 'server' || this.$store.state.Edit.rightPanel === 'block') {
          if (this.$store.state.Edit.serverType === 'file') {
            dataDB(this, navType, 'cda', { fileType: 'cda', fileName: data }, 'editFiles', { type: this.$store.state.Edit.serverType, username: this.$store.state.System.user.username, fileName: data })
          } else if (this.$store.state.Edit.serverType === 'user') {
            this.$store.commit('EDIT_SET_SERVER_TYPE', 'file');
            dataDB(this, navType, 'cda', { fileType: 'cda', fileName: data }, 'editFiles', { type: this.$store.state.Edit.serverType, username: this.$store.state.System.user.username })
          }
        } else {
          const dataType = this.$store.state.Edit.dataType
          switch (dataType) {
            case '用户':
              // userName
              dataDB(this, 'local', 'cda', { userName: data }, 'editFiles', null)
              break;
            case '客户':
              dataDB(this, 'local', 'cda', { id: data }, 'editFiles', null)
              break;
            case '文档':
              dataDB(this, 'local', 'cda', { docType: data }, 'editFiles', null)
              break;
            case '模板':
              dataDB(this, 'local', 'cda', { fileType: 'model' }, 'editFiles', null)
              break;
            case '新建':
              if (this.$store.state.Edit.editingFile.length > 0) {
                const value = this.$store.state.Edit.editingFile.map((x) => {
                  const arr = []
                  arr.push(Object.keys(x)[0], x.type, x.createTime)
                  return arr
                })
                this.$store.commit('EDIT_LOAD_FILE', value)
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
        editPage(this, n)
      },
      fold(data) {
        this.$store.commit('EDIT_SET_RIGHT_FOLDS', data);
      }
    },
  };
</script>

<style scoped>

</style>
