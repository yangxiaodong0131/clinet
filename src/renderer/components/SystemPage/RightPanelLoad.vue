<template>
  <div>
    <table v-if="this.$store.state.System.toolbar === 'checkTable'" v-bind:style="{ height: height + 'px', overflow: 'auto' }">
      <tr v-for="(data, index) in file" v-bind:key='index' v-on:click="onClick(data, index)" v-bind:class="{'table-danger':flag == index}" class="server-load-rightpanel-tr">
        <td v-for="(field, index) in data" v-bind:key='index' v-bind:class="{'table-danger': String(field) == 'NaN'}" class="server-load-rightpanel-td">{{data[index]}}</td>
      </tr>
    </table>
    <table v-if="this.$store.state.System.toolbar === 'compareTable'">
      <tr>
        <td>表名</td><td>字段中文名称</td><td>字段英文名称</td><td>字段类型</td><td>是否必填</td><td>对照文件的字段</td>
      </tr>
      <tr v-for="(data, index) in file" v-bind:key='index' class="server-load-rightpanel-tr">
        <td v-for="(field, index2) in data" v-bind:key='index2' v-if="index2 < 10"  v-bind:class="{'table-danger':flag == index && index2 == data.length - 1}" class="server-load-rightpanel-td"  v-on:click="onClick(data, index)" title="单击后左侧选择对应的字段,双击清空已选">{{data[index2]}}</td>
      </tr>
    </table>
    <table v-else>
      <tr v-for="(data, index) in file" v-bind:key='index' v-on:click="onClick(data, index)" v-bind:class="{'table-danger':flag == index}" class="server-load-rightpanel-tr">
        <td v-for="(field, index) in data" v-bind:key='index' v-if="index < 10" class="server-load-rightpanel-td">{{data[index]}}</td>
      </tr>
    </table>
  </div>
</template>

<script>
  import loadFile from '../../utils/LoadFile';
  export default {
    data() {
      return {
        flag: null,
        height: 0
      }
    },
    computed: {
      file: {
        get() {
          let f = []
          let fileLen = this.$store.state.System.file.length;
          switch (this.$store.state.System.toolbar) {
            case 'files':
              if (fileLen > 99) { fileLen = 99 }
              for (let i = 0; i < fileLen; i += 1) {
                f.push(this.$store.state.System.file[i].split(','))
              }
              break;
            case 'tables':
              f = this.$store.state.System.table
              break;
            case 'compareTable':
              f = this.$store.state.System.computeTable
              break;
            case 'checkTable':
              f = this.$store.state.System.checkData
              // this.$set(f, 0, this.$store.state.System.checkData)
              break;
            case 'loadTable':
              // f = this.$store.state.System.table
              break;
            case 'compDrg':
              // f = this.$store.state.System.table
              break;
            case 'statDrg':
              // f = this.$store.state.System.table
              break;
            case 'upLoadTableData':
              f = this.$store.state.System.upLoadFile
              break;
            default:
              break;
          }
          return f
        }
      },
      keys: {
        get() {
          const keys = this.$store.state.System.tableKeys
          return keys
        }
      },
      defindKeys: {
        get() {
          const keys = this.$store.state.System.tableKeys
          return keys
        }
      }
    },
    created: function () {
      this.height = document.body.clientHeight - 400
      loadFile(this, this.$store.state.System.serverTable, 'system-home')
    },
    methods: {
      onClick: function (data, index) {
        this.flag = index
        this.$store.commit('SYSTEM_GET_FIELD', data);
        this.$store.commit('SYSTEM_GET_FIELD_INDEX', index);
        // if (index2 !== '' && index2 === (data.length - 1)) {
        //   const computeTable = this.$store.state.System.computeTable
        //   computeTable[index][index2] = '请在左侧选择对应的字段'
        //   this.$store.commit('SYSTEM_SET_COMPUTE_TABLE', computeTable);
        // }
      },
    },
  };
</script>

<style scoped>
</style>
