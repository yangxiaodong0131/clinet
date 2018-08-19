<template>
  <div>
    <table class="table table-striped" id="server-table-user">
      <thead class="thead-light">
        <tr>
          <th scope="col">名称</th>
          <th scope="col">信息</th>
        </tr>
      </thead>
      <tbody v-if="this.$store.state.Block.account.address !== ''">
        <tr v-for="(values, key) in this.$store.state.Block.account" v-bind:key='key'  v-if="['unconfirmedBalance', 'lockHeight'].includes(key)">
          <td v-if="key === 'unconfirmedBalance'">余额</td>
          <td v-else-if="key === 'lockHeight'">最后区块高度</td>
          <td>{{values}}</td>
        </tr>
      </tbody>
      <tbody v-else>
        <!--<tr v-for="(values, key) in this.$store.state.System.user" v-bind:key='key' v-if="['username', 'type', 'org', 'id', 'blockchain', 'password', 'is_show'].includes(key)">
          <td v-if="key === 'username'">用户名</td>
          <td v-else-if="key === 'type'">权限</td>
          <td v-else-if="key === 'org'">机构</td>
          <td v-else-if="key === 'id'">ID</td>
          <td v-else-if="key === 'blockchain'">区块信息</td>
          <td v-else-if="key === 'password'">密码</td>
          <td v-else-if="key === 'is_show'">文件权限</td>
          <td v-if="key === 'username'"  v-on:click="createUserinfo('name')">
            <div v-if="userinfo.name">
              <input type="text" v-model="userinfoName" />
            </div>
            <div>{{values}}</div>
          </td>
          <td v-else-if="key === 'password'" v-on:click="createUserinfo('pass')">
            <div v-if="userinfo.pass">
              <input type="text" v-model="userinfoPass" />
            </div> 
            <div>{{values}}</div>
          </td>
          <td v-else>{{values}}</td>
        </tr>-->
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
        <tr>
        <td>区块信息</td>
        <td>{{this.$store.state.System.user.blockchain}}</td>
        </tr>
        <!--<tr>
        <td>密码</td>
        <td>{{this.$store.state.System.user.password}}</td>
        </tr>-->
        <tr>
        <td>文件权限</td>
        <td v-if="this.$store.state.System.user.is_show === false">无</td>
        <td v-else-if="this.$store.state.System.user.is_show === true">有</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        userinfo: { name: false, pass: false },
        userinfoName: '',
        userinfoPass: ''
      }
    },
    methods: {
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
