<template>
  <div>
    <right-bar></right-bar>
    <div v-bind:style="{ height: height + 'px', overflow: 'auto' }">
      <table>
        <tr v-for="(x, index) in xs"  v-if="index === 0" v-on:click="onClick(x, index)" v-bind:key="index" class="library-rightpanel">
          <th class="text-center" v-for="(data, xindex) in x" v-bind:key="xindex" v-if="tableType === 'local' || tableType === 'block'">
            {{data}}
          </th>
          <th class="text-center" v-for="(data, xindex) in x" v-bind:key="xindex" v-if="tableType === 'server'">
            <a class="oi oi-sort-ascending" v-if="serverSort.type === 'asc' && serverSort.field == data" ></a>
            <a class="oi oi-sort-ascending" href="#" v-else style="color:#7bb8d1" v-on:click="onClickSort(data, 'asc')" v-bind:id="'library-table-asc'+xindex"></a>
            &nbsp;&nbsp;&nbsp;&nbsp;{{data}}&nbsp;&nbsp;&nbsp;&nbsp;
            <a class="oi oi-sort-descending"  v-if="serverSort.type === 'desc' && serverSort.field == data"></a>
            <a class="oi oi-sort-descending" href="#" v-else style="color:#7bb8d1" v-on:click="onClickSort(data, 'desc')" v-bind:id="'library-table-desc'+xindex"></a>
          </th>
        </tr>
        <tr v-for="(data, index) in xs" v-bind:key='index' class="library-right-table-tr" v-if="index > 0">
          <td v-for="(field, index2) in data"  v-bind:key='index2' v-bind:class="{'table-danger': changIndexDataIndex === index && changIndexTrIndex === index2}"  v-on:dblclick="change(index, index2, data[index2])" title="双击以修改">{{data[index2]}}</td>
        </tr>
      </table>
      <h3 v-if="xs.length === 1" class="text-center">该术语字典暂无数据</h3>
      <nav aria-label="Page navigation example" v-if="this.$store.state.Library.tableType === 'server'">
        <ul class="pagination">
          <li class="page-item" v-for= "(value, index) in page.pageList" v-bind:key="index" v-bind:class="{'disabled':value.page == page.page}" v-on:click="serverPage(value.page)"><a class="page-link" href="#">
            {{value.num}}
          </a></li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
  import RightBar from './RightBar';
  import dataDB from '../../utils/dataDB';
  export default {
    components: { RightBar },
    data() {
      return {
        // flag: null
        height: 0
      };
    },
    created: function () {
      this.height = document.body.clientHeight - 100
    },
    computed: {
      page: {
        get() {
          return { pageList: this.$store.state.Library.libraryTableInfo.pageList, page: this.$store.state.Library.libraryTableInfo.page }
        }
      },
      serverSort: {
        get() {
          return this.$store.state.Library.serverSort
        }
      },
      xs: {
        get() {
          let table = []
          if (this.$store.state.Library.tableType === 'search') {
            table = this.$store.state.Library.libraryTable.search
          } else {
            table = this.$store.state.Library.libraryTable.data
          }
          return table
        }
      },
      rowHeight: {
        get() {
          return this.$store.state.Library.rowHeight
        }
      },
      fieldIndex: {
        get() {
          return this.$store.state.Library.fieldIndex
        }
      },
      tableType: {
        get() {
          return this.$store.state.Library.tableType
        }
      },
      changIndexDataIndex: {
        get() {
          return this.$store.state.Library.changIndex[0]
        }
      },
      changIndexTrIndex: {
        get() {
          return this.$store.state.Library.changIndex[1]
        }
      },
    },
    methods: {
      onClick: function (data, index) {
        this.$store.commit('LIBRARY_GET_ROW', index);
        this.$store.commit('LIBRARY_GET_FIELD', data);
        if (this.$store.state.Library.tableType === 'server') {
          this.$store.commit('LIBRARY_GET_FIELD_INDEX', index);
        }
      },
      serverPage: function (data) {
        const page = parseInt(data, 10)
        this.$store.commit('LIBRARY_SET_TABLE_PAGE', page);
        const skip = (page - 1) * 30
        dataDB(this, this.$store.state.Library.tableType, 'library', { fileType: this.$store.state.Library.libraryTableInfo.tableName }, 'libraryFile', { type1: this.$store.state.Library.tableType, sort: this.$store.state.Library.serverSort }, skip, 30)
      },
      onClickSort: function (field, type) {
        this.$store.commit('LIBRARY_SET_SERVER_SORT', [field, type])
        dataDB(this, this.$store.state.Library.tableType, 'library', { fileType: this.$store.state.Library.libraryTableInfo.tableName }, 'libraryFile', { type1: this.$store.state.Library.tableType, sort: this.$store.state.Library.serverSort, dimensionType: null, dimensionServer: this.$store.state.Library.serverDimension }, 0, 30)
      },
      change: function (dataIndex, trIndex, value) {
        this.$store.commit('LIBRARY_SET_CHANGE_INDEX', [dataIndex, trIndex]);
        this.$store.commit('LIBRARY_SET_CHANGE_VAL', value)
        this.$store.commit('LIBRARY_SET_CHANGE', { val: value, dataIndex: dataIndex, trIndex: trIndex })
      }
    },
  };
</script>

<style scoped>

</style>
