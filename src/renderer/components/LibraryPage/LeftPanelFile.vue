<template>
  <div>
    <table>
      <tr>
        <th class="table-danger" id="library-leftpanel">术语字典文件</th>
      </tr>
      <tr v-for="(data, index) in xs" v-bind:key='index' v-on:click="loadFile(data, index)" v-bind:class="{'table-danger':flag == index}" class="library-leftlist">
        <td>{{data}}</td>
      </tr>
    </table>
  </div>
</template>

<script>
  // import loadFile from '../../utils/LoadFile';
  import dataDB from '../../utils/dataDB';
  // import { getLibrary } from '../../utils/LibraryServerFile'
  export default {
    data() {
      return {
        // flag: null
      };
    },
    computed: {
      xs: {
        get() {
          return this.$store.state.Library.files
        }
      },
      flag: {
        get() {
          return this.$store.state.Library.fileIndex
        }
      }
    },
    methods: {
      loadFile: function (data, index) {
        this.$store.commit('LIBRARY_SET_TABLE_PAGE', 1)
        this.$store.commit('LIBRARY_SET_TABLE_NAME', data)
        this.$store.commit('LIBRARY_SET_FILE_INDEX', index);
        this.$store.commit('LIBRARY_CLEAR_SERVER_SORT');
        this.$store.commit('LIBRARY_CLEAR_CHANGE')
        if (this.$store.state.Library.tableType === 'search') {
          this.$store.commit('LIBRARY_SET_TABLE_TYPE', 'server')
        } else if (this.$store.state.Library.tableType === 'local') {
          dataDB(this, 'local', 'library', { fileType: data }, 'libraryCount', null, null, 30)
        }
        dataDB(this, this.$store.state.Library.tableType, 'library', { fileType: data }, 'libraryFile', { type1: this.$store.state.Library.tableType, sort: this.$store.state.Library.serverSort, dimensionType: null, dimensionServer: this.$store.state.Library.serverDimension }, 0, 30)
      },
    },
  };
</script>

<style scoped>

</style>
