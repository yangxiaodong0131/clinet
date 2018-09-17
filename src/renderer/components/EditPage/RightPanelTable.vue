<template>
  <div v-bind:style="{ height: height + 'px', overflow: 'auto' }">
    <table v-if="!this.$store.state.Edit.rightFolds.includes('编辑病案')" id="edit-leftpaneltable-table">
      <tr>
        <th colspan="15" class="table-info"> {{filesName}}（共有{{fileLength}}条记录）
          <a href="#" v-on:click="close('编辑病案')" style="float: right">✖</a>
          <a href="#" v-on:click="fold('编辑病案')" style="float: right; marginRight: 3px">↗</a>
        </th>
      </tr>
      <tr class="edit-leftpaneltable-tr" v-for="(data, index) in file" v-bind:key='index' v-bind:class="{'table-warning':flag === index, 'table-danger': isSave.includes(index)}">
        <!-- <td> {{index + 1}} </td> -->
        <td v-for="(item, index) in data" v-bind:key='index'>{{item}}</td>
        <td v-if="rightPanel !== 'block'" v-bind:id="'edit-leftpaneltable-del'+index"><a href="#" v-on:click="delDoc(index)">删除</a></td>
        <td v-if="rightPanel !== 'block'" v-bind:id="'edit-leftpaneltable-edit'+index"><a href="#" v-on:click="loadDoc(index, data)">编辑</a></td>
        <td v-if="rightPanel !== 'block'" v-bind:id="'edit-leftpaneltable-ref'+index"><a href="#" v-on:click="loadDoc(data, index, 'show')">参考</a></td>
        <td v-if="fileName.includes('@')" v-bind:id="'edit-leftpaneltable-dow'+index"><a href="#" v-on:click="downloadDoc(data, index)">下载</a></td>
        <td v-if="data[2]" class="table-success"><a href="#" style="color: #000">已上传</a></td>
        <td v-if="(!fileName.includes('@') || rightPanel !== 'block') && !data[2]" class="table-warning"><a href="#" style="color: #000" v-on:click="uploadDoc(data, index)">未上传</a></td>
      </tr>
    </table>
    <table v-if="this.$store.state.Edit.rightFolds.includes('编辑病案')">
      <tr>
        <th colspan="10" class="table-info"> {{fileName}}（共有{{fileLength}}条记录）
          <a href="#" v-on:click="close('编辑病案')" style="float: right">✖</a>
          <a href="#" v-on:click="fold('编辑病案')" style="float: right; marginRight: 5px">↙</a>
        </th>
      </tr>
      <tr  style="textAlign: center"><a href="#" v-on:click="fold('编辑病案')">...</a></tr>
    </table>
  </div>
</template>

<script>
  import { saveEdit } from '../../utils/EditServerFile'
  import saveFile from '../../utils/SaveFile';
  import { getDate } from '../../utils/EditOperation'
  import dataDB from '../../utils/dataDB';
  export default {
    data() {
      return {
        height: window.innerHeight - 120,
        isSummary: true
      };
    },
    computed: {
      isSave: {
        get() {
          let type = this.$store.state.Edit.isSaveLocal
          if (this.$store.state.Edit.rightPanel === 'local') {
            type = this.$store.state.Edit.isSaveLocal
          } else if (this.$store.state.Edit.rightPanel === 'server') {
            type = this.$store.state.Edit.isSaveServer
          }
          return type
        }
      },
      rightPanel: {
        get() {
          return this.$store.state.Edit.rightPanel
        }
      },
      filesName: {
        get() {
          if (this.$store.state.Edit.filesName) {
            return this.$store.state.Edit.filesName
          }
          return ''
        }
      },
      fileName: {
        get() {
          if (this.$store.state.Edit.fileName) {
            return this.$store.state.Edit.fileName
          }
          return ''
        }
      },
      fileLength: {
        get() {
          return this.$store.state.Edit.file.length
        }
      },
      file: {
        get() {
          const file = this.$store.state.Edit.file
          return file
        }
      },
      flag: {
        get() {
          return this.$store.state.Edit.fileIndex
        }
      },
      flagTd: {
        get() {
          return this.$store.state.Edit.selectedCol
        }
      }
    },
    methods: {
      delDoc: function (index) {
        const fileName = this.$store.state.Edit.file[index][0]
        dataDB(this, 'local', 'cda', { fileName }, 'remove', { fileName })
      },
      uploadDoc: function (data, index) {
        const currentdate = getDate()
        if (!this.$store.state.System.user.login) {
          this.$store.commit('SET_NOTICE', '未登录用户,请在系统服务-用户设置内登录');
          this.$store.commit('EDIT_SET_HINT_TYPE', 'notice');
        } else {
          this.$store.commit('EDIT_SET_FILE_INDEX', index)
          saveEdit(this, [this.$store.state.System.server, this.$store.state.System.port], this.$store.state.Edit.files[this.$store.state.Edit.filesIndex], [data], '', '上传', this.$store.state.System.user.username, 1, this.$store.state.Edit.docType, '病案')
          this.$store.commit('EDIT_UPDATE_DOC_HEADER', ['上传时间', currentdate]);
          this.$store.commit('EDIT_UPDATE_DOC_SUMMARY', [index, `上传时间:${currentdate}`]);
          this.$store.commit('EDIT_SET_DOC_STATE');
        }
      },
      downloadDoc: function (data, index) {
        // const index1 = this.$store.state.Edit.files[this.$store.state.Edit.filesIndex].indexOf('-')
        // const filename = this.$store.state.Edit.files[this.$store.state.Edit.filesIndex].substr(index1 + 1)
        saveFile(this, this.$store.state.Edit.loadFileName, [...this.$store.state.Edit.downFile, data]);
        this.$store.commit('EDIT_SET_FILE_INDEX', index)
        const currentdate = getDate()
        this.$store.commit('EDIT_UPDATE_DOC_HEADER', ['下载时间', currentdate]);
        this.$store.commit('EDIT_SET_DOC_STATE');
      },
      loadDoc: function (index, name) {
        const navType = this.$store.state.Edit.navType
        const dataType = this.$store.state.Edit.dataType
        this.$store.commit('EDIT_SET_DOC_TYPE', name[1]);
        this.$store.commit('EDIT_SET_FILE_INDEX', index);
        if (navType === '本地') {
          if (dataType.includes('模板')) {
            const value = this.$store.state.Edit.editModels[0].value[name[0]]
            this.$store.commit('EDIT_LOAD_DOC', value);
            // dataDB(this, 'local', 'cda', { fileType: 'model', value: '首次病程' }, 'editFile', null)
          } else {
            dataDB(this, 'local', 'cda', { fileName: name[0] }, 'editFile', null)
          }
        } else {
          dataDB(this, 'server', 'cda', { fileType: 'cda', fileName: name[0] }, 'editFile', { type: this.$store.state.Edit.serverType, username: this.$store.state.System.user.username, fileName: name[0] })
        }
      },
      close(data) {
        this.$store.commit('EDIT_DELETE_RIGHT_PANELS', data);
      },
      fold(data) {
        this.$store.commit('EDIT_SET_RIGHT_FOLDS', data);
      }
    },
  };
</script>

<style scoped>

</style>
