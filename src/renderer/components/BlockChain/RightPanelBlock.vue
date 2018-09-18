<template>
  <div>
    <!-- <table>
      <tr v-for="(line, index) in file" v-bind:key='index'>
        <td v-for="(filed, index) in line" v-bind:key='index'>{{line[index]}}</td>
      </tr>
    </table> -->
    <div v-if="toolbar == 'blockList'">
      <table>
        <thead>
          <tr>
            <th>高度</th>
            <th>时间</th>
            <th>hash</th>
            <th>生产者</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(value, index) in blockBlock"  v-bind:key='index' v-bind:class="{'table-danger': hightLight === index}" v-on:click="block(index)">
            <td>{{value.index}}</td>
            <td>{{value.data}}</td>
            <td>{{value.hash}}</td>
            <td>{{value.generateAdress}}</td>
          </tr>
        </tbody>
      </table>
      <nav aria-label="Page navigation example">
        <ul class="pagination">
          <li class="page-item" v-for= "(value, index) in blockBlock.page_list" v-bind:key="index" v-bind:class="{'disabled':value.page == blockBlock.page_num}" v-on:click="blockChainPage(value.page)"><a class="page-link" href="#">
            {{value.num}}
          </a></li>
        </ul>
      </nav>
    </div>
    <div v-if="toolbar == 'blockInfo'">
      <table>
        <tr><td>高度</td><td>{{blockInfo.index}}</td></tr>
        <tr><td>hash</td><td>{{blockInfo.hash}}</td></tr>
        <tr><td>上一条hash</td><td>{{blockInfo.previous_hash}}</td></tr>
        <tr><td>生产者</td><td>{{blockInfo.generateAdress}}</td></tr>
        <tr><td>时间</td><td>{{blockInfo.data}}</td></tr>
        <tr><td>交易</td><td>{{blockInfo.transactions}}</td></tr>
        <tr><td>时间戳</td><td>{{blockInfo.timestamp}}</td></tr>
      </table>
    </div>
  </div>
</template>

<script>
  import { bcBlockchain } from '../../utils/BlockBlock'
  export default {
    data() {
      return {
        hightLight: '',
      }
    },
    computed: {
      toolbar: {
        get() {
          return this.$store.state.Block.toolbar
        }
      },
      blockInfo: {
        get() {
          return this.$store.state.Block.blockInfo
        }
      },
      blockBlock: {
        get() {
          return this.$store.state.Block.blockBlock
        }
      },
      file: {
        get() {
          const f = [];
          let len = this.$store.state.System.file.length;
          if (len > 99) { len = 99 }
          for (let i = 0; i < len; i += 1) {
            f.push(this.$store.state.System.file[i].split(','))
          }
          return f
        }
      },
    },
    methods: {
      load: function (n) {
        switch (n) {
          case 1:
            this.$router.push('/edit');
            break;
          default:
            this.$router.push('/edit');
        }
      },
      block: function (value) {
        this.hightLight = value;
        this.$store.commit('BLOCK_SET_TOOLBAR', 'blockInfo');
        this.$store.commit('BLOCK_GET_BLOCK_INFO', this.blockBlock[value])
      },
      blockChainPage: function (value) {
        const ip = this.$store.state.System.server
        const port = this.$store.state.System.port
        bcBlockchain(this, [ip, port, value])
      }
    },
  };
</script>

<style scoped>

</style>
