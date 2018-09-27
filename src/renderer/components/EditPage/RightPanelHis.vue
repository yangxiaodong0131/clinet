<template>
  <div id="edit-leftpaneldoc-doc" style="marginBottom: 5px">
    <div class="card">
      <table v-if="!this.$store.state.Edit.rightFolds.includes('病案历史')">
        <tr>
          <!-- <th colspan="15" class="table-info"> {{title}}（共有{{fileLength}}条记录） -->
          <th colspan="15" class="table-info" style="paddingLeft: 10px"> {{title}}
            <a href="#" v-on:click="close('病案历史')" style="float: right">✖</a>
            <a href="#" v-on:click="fold('病案历史')" style="float: right; marginRight: 3px">↗</a>
          </th>
        </tr>
        <tr v-for="(data, index) in file" v-bind:key='index' v-bind:class="{'table-warning':flag === index,}">
          <!-- <td> {{index + 1}} </td> -->
          <td v-for="(item, index) in data" v-bind:key='index'>{{item}}</td>
          <td><a href="#" v-on:click="loadDoc(index, data)">参考</a></td>
        </tr>
      </table>
      <table v-if="this.$store.state.Edit.rightFolds.includes('病案历史')">
      <tr>
        <!-- <th colspan="10" class="table-info"> {{title}}（共有{{fileLength}}条记录） -->
        <th colspan="15" class="table-info"> {{title}}
          <a href="#" v-on:click="close(title)" style="float: right">✖</a>
          <a href="#" v-on:click="fold('病案历史')" style="float: right; marginRight: 5px">↙</a>
        </th>
      </tr>
      <tr  style="textAlign: center"><a href="#" v-on:click="fold('病案历史')">...</a></tr>
    </table>
    </div>
  </div>
</template>

<script>
  import dataDB from '../../utils/dataDB';
  export default {
    data() {
      return {
        height: window.innerHeight - 120,
      };
    },
    computed: {
      title: {
        get() {
          const x = '病案历史'
          return x
        }
      },
      flag: {
        get() {
          // const doc = this.$store.state.Edit.doc
          // const key = doc[this.$store.state.Edit.docIndex]
          // if (key) {
          //   return key[0]
          // }
          return this.$store.state.Edit.docIndex
        }
      },
      file: {
        get() {
          return this.$store.state.Edit.docHis
        }
      },
      fileLength: {
        get() {
          return this.$store.state.Edit.docHis.length
        }
      },
    },
    methods: {
      changeIndex: function (v, isSect = false) {
        if (isSect) { v = v.split(',') }
        const value = v.concat()
        const index = value.shift(0)
        this.$store.commit('EDIT_SET_BAR_VALUE', value)
        this.$store.commit('EDIT_SET_DOC_INDEX', [parseInt(index, 10), 'set']);
        document.getElementById('edit-editbar-input').focus()
      },
      loadDoc: function (index, name) {
        const navType = this.$store.state.Edit.navType
        this.$store.commit('EDIT_SET_DOC_TYPE', name[1]);
        this.$store.commit('EDIT_SET_FILE_INDEX', index);
        if (navType === '本地') {
          this.$store.commit('EDIT_SET_RIGHT_PANELS', '病案参考');
          dataDB(this, 'local', 'cda', { fileName: name[0] }, 'consultFile', null)
        } else {
          dataDB(this, 'server', 'cda', { fileType: 'cda', fileName: name[0] }, 'consultFile', { type: this.$store.state.Edit.serverType, username: this.$store.state.System.user.username, fileName: name[0] })
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
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  .breadcrumb > li + li:before {
    color: #CCCCCC;
    content: "  ";
    padding: 0 5px;
  }
</style>
