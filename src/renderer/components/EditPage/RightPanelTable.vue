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
        <td v-if="lastNav !== '/edit' && index < 10" v-for="(field, index) in data" v-bind:key='index' v-on:click="onClickTd(data, index)" v-bind:class="{'table-danger':flagTd.find((n)=>n===index)}">{{data[index]}}</td>
        <td v-if="lastNav === '/edit'" v-for="(item, index) in data" v-bind:key='index'>{{item}}</td>
        <td v-if="rightPanel !== 'block'" v-bind:id="'edit-leftpaneltable-del'+index"><a href="#" v-on:click="delDoc(index)">删除</a></td>
        <td v-if="rightPanel !== 'block'" v-bind:id="'edit-leftpaneltable-edit'+index"><a href="#" v-on:click="loadDoc(index, data)">编辑</a></td>
        <td v-if="lastNav !== '/library' && rightPanel !== 'block'" v-bind:id="'edit-leftpaneltable-ref'+index"><a href="#" v-on:click="loadDoc(data, index, 'show')">参考</a></td>
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
      lastNav: {
        get() {
          return this.$store.state.Edit.lastNav
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
          let file = []
          const navType = this.$store.state.Edit.navType
          if (navType === '数据分析') {
            file = this.$store.state.Stat.file
          } else if (navType === '数据分析') {
            file = this.$store.state.Library.file
          } else {
            file = this.$store.state.Edit.file
          }
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
      },
      navType: {
        get() {
          return this.$store.state.Edit.navType
        }
      }
    },
    methods: {
      onClickTd: function (data, index) {
        this.$store.commit('EDIT_SET_SELECTED_TYPE', 'row');
        switch (this.$store.state.Stat.tableType) {
          case 'local':
            if (data[0] === 'org' && data[1] === 'time') {
              this.$store.commit('EDIT_SET_COL', index);
              this.$store.commit('EDIT_SET_SELECTED_TYPE', 'col');
            }
            break;
          case 'server':
            if (data[0] === '机构' && data[1] === '时间') {
              this.$store.commit('EDIT_SET_COL', index);
              this.$store.commit('EDIT_SET_SELECTED_TYPE', 'col');
            }
            break;
          default:
        }
        this.$store.commit('EDIT_SET_BAR_VALUE', data[index]);
      },
      delDoc: function (index) {
        // const value = this.$store.state.Edit.file[index]
        const fileName = this.$store.state.Edit.file[index][0]
        dataDB(this, 'local', 'cda', { fileName }, 'remove', { fileName })
        // this.$store.commit('EDIT_DELETE_DOC', index);
        // this.$store.commit('EDIT_DELETE_DOC_SUMMARY', index);
        // this.$store.commit('SET_NOTICE', '删除成功');
        // this.$store.commit('EDIT_SET_HINT_TYPE', 'notice');
        // this.$store.commit('EDIT_SET_DELETE_LOCAL', index[0])
        // this.$store.commit('EDIT_DELETE_FILE', index[0])
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
        this.$store.commit('EDIT_SET_FILE_INDEX', index);
        dataDB(this, 'local', 'cda', { fileName: name[0] }, 'editFile', null)
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
