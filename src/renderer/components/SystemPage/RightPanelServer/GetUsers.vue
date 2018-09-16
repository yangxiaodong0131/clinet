<template>
  <div>
    <table class="table table-striped" id="server-table-user">
      <thead class="thead-light">
        <tr>
          <th scope="col">名称</th>
          <th scope="col">信息</th>
        </tr>
      </thead>
      <!-- <tbody v-if="this.$store.state.Block.account.address !== ''">
        <tr v-for="(values, key) in this.$store.state.Block.account" v-bind:key='key'  v-if="['unconfirmedBalance', 'lockHeight'].includes(key)">
          <td v-if="key === 'unconfirmedBalance'">余额</td>
          <td v-else-if="key === 'lockHeight'">最后区块高度</td>
          <td>{{values}}</td>
        </tr>
      </tbody> -->
      <tbody>
        <tr>
          <td>用户名</td>
          <td>{{this.$store.state.System.user.username}}</td>
        </tr>
        <tr>
          <td>权限</td>
          <td v-if="this.$store.state.System.user.type === 2">普通用户</td>
          <td v-else-if="this.$store.state.System.user.type === 1">管理员用户</td>
        </tr>
          <td>机构</td>
          <td>{{this.$store.state.System.user.org}}</td>
        </tr>
        <tr>
          <td>ID</td>
          <td>{{this.$store.state.System.user.id}}</td>
        </tr>
        <tr v-if="this.$store.state.System.user.blockchain">
          <td>区块链口令</td>
          <td>{{this.$store.state.System.user.blockchain.username}}</td>
        </tr>
        <tr v-if="this.$store.state.System.user.blockchain">
          <td>公钥</td>
          <td>{{this.$store.state.System.user.blockchain.publicKey}}</td>
        </tr>
        <tr v-if="this.$store.state.System.user.blockchain">
          <td>地址</td>
          <td>{{this.$store.state.System.user.blockchain.address}}</td>
        </tr>
        <tr v-if="this.$store.state.System.user.blockchain">
          <td>区块链余额</td>
          <td>{{this.$store.state.System.user.blockchain.balance}}</td>
        </tr>
        <tr v-if="this.$store.state.System.user.blockchain">
          <td>最后区块高度</td>
          <td>{{this.$store.state.System.user.blockchain.lockHeight}}</td>
        </tr>
        <tr>
        <td>文件权限</td>
          <td v-if="this.$store.state.System.user.is_show === false">无</td>
          <td v-else-if="this.$store.state.System.user.is_show === true">有</td>
        </tr>
      </tbody>
    </table>
    <button type="button" class="btn btn-primary btn-lg" v-if="toolbar === 'getUsers' && user.login === true" v-on:click="updateUserPage()" id="server-user-change">修改</button>
    <button type="button" class="btn btn-primary btn-lg" v-on:click="docUser()" v-if="toolbar === 'getUsers' && user.login === true" id = "server-user-changepower">文件权限修改</button>
  </div>
</template>
<script>
  import { sUpdateUser } from '../../../utils/ServerUser';
  export default {
    data() {
      return {
        userinfo: { name: false, pass: false },
        userinfoName: '',
        userinfoPass: ''
      }
    },
    computed: {
      user: {
        get() {
          return this.$store.state.System.user
        }
      },
      toolbar: {
        get() {
          return this.$store.state.System.toolbar
        }
      }
    },
    methods: {
      updateUserPage: function () {
        this.$store.commit('SYSTEM_SET_TOOLBAR', 'createUsers')
      },
      docUser: function () {
        sUpdateUser(this, [this.server, this.port], this.$store.state.System.user.id, { is_show: !this.$store.state.System.user.is_show })
      },
      createUserinfo: function (value) {
        if (value === 'name') {
          this.userinfo.name = true
        } else if (value === 'pass') {
          this.userinfo.pass = true
        }
      }
    }
  };
</script>
