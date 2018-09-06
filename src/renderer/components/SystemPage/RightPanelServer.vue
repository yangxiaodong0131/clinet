<template>
  <div>
    <div v-if="this.toolbar === 'getServers'" id="system-server-port">
      <table>
        <tr><td>服务器名称</td><td>地址</td><td>端口</td><td>连接状态</td><td>操作</td></tr>
        <tr v-for="(data, index) in file" v-bind:key='index' v-bind:class="{'table-danger':flag == index}" class="server-rightpanel-tr" v-bind:id="'system-td-tr'+index">
          <td>{{data.name}}</td>
          <td>{{data.host}}</td>
          <td>{{data.port}}</td>
          <td>{{data.connect}}</td>
          <td>
            <a href="#" v-on:click="connect(data, index)">连接</a>&nbsp;&nbsp;&nbsp;&nbsp;
            <a href="#" v-on:click="setFirst(data, index)" v-if="data.setting !== '1'">设为默认</a>
          </td>
        </tr>
      </table>
      <button id = "server-server-add" v-on:click="addServer()">添加配置</button>
    </div>
    <div v-if="this.toolbar === 'sddServers'" id="system-server-sdd">
      <form>
        <div class="form-group">
          <label>服务器名称</label>
          <input type="text" class="form-control" v-model="serverInput.name">
          <small class="form-text text-muted"></small>
        </div>
        <div class="form-group">
          <label>地址</label>
          <input type="text" class="form-control" v-model="serverInput.host">
          <small class="form-text text-muted"></small>
        </div>
        <div class="form-group">
          <label>端口</label>
          <input type="text" class="form-control" v-model="serverInput.port">
          <small class="form-text text-muted"></small>
        </div>
      </form>
      <button id = "server-server-submit-add" v-on:click="addServerSubmit()">确定</button>
    </div>
    <!-- 连接服务器状态 -->
    <!-- <div v-if="this.$store.state.System.connectInfo == true" > -->
      <!-- 登录状态 -->
        <!-- 未登录 -->
        <div v-if="this.$store.state.System.user.login == false && this.$store.state.Block.account.address === ''">
          <div v-if="this.toolbar === 'getUsers'">
            <login-register></login-register>
          </div>
        </div>
        <!-- 未登录 -->
        <!-- 已登录 -->
        <div v-else>
          <div v-if="this.toolbar === 'createUsers'">
            <login-register></login-register>
          </div>
          <div v-if="this.toolbar === 'getUsers'">
            <div v-if="this.userInfo === 'info'">
              <get-users></get-users>
            </div>
            <div v-else>
              <form>
                <div class="form-group">
                  <label>新密码</label>
                  <input type="password" class="form-control" placeholder="新密码" v-model="upUserInfo.password">
                  <small class="form-text text-muted">请输入新的密码</small>
                </div>
                <div class="form-group">
                  <label>机构</label>
                  <input type="text" class="form-control" placeholder="新机构" v-model="upUserInfo.org">
                  <small class="form-text text-muted">请输入新的机构</small>
                </div>
              </form>
            </div>
          </div>
          <div v-if="this.toolbar === 'getOrgs'" class ="orgs">
            <get-orgs></get-orgs>
          </div>
          <div v-if="this.toolbar === 'createOrgs'">
            <create-orgs></create-orgs>
          </div>
          <div v-if="this.toolbar === 'createDepartments'">
            <create-departments></create-departments>
          </div>
          <div v-if="this.toolbar === 'getPersons'">
            <get-persons></get-persons>
          </div>
        </div>
        <!-- 已登录 -->
      <!-- 登录状态 -->
    <!-- </div> -->
    <!-- <div v-else>
      请连接服务器
    </div> -->
    <!-- 连接服务器状态 -->
  </div>
</template>

<script>
  import loadFile from '../../utils/LoadFile';
  import GetUsers from './RightPanelServer/GetUsers';
  import GetOrgs from './RightPanelServer/GetOrgs';
  import CreateOrgs from './RightPanelServer/CreateOrgs';
  import LoginRegister from './RightPanelServer/LoginRegister';
  import CreateDepartments from './RightPanelServer/CreateDepartments';
  import GetPersons from './RightPanelServer/GetPersons';
  import { sConnect } from '../../utils/Server'
  import dataDB from '../../utils/dataDB';
  export default {
    components: { GetUsers, GetOrgs, CreateOrgs, CreateDepartments, GetPersons, LoginRegister },
    data() {
      return {
        flag: null,
        textPower: '',
        confirmPassword: '',
        userInfo: 'info',
        serverInput: { name: '', host: '', port: '', setting: '' }
      }
    },
    created: function () {
      loadFile(this, 'hitb_server.csv', 'system')
    },
    computed: {
      file: {
        get() {
          let f = []
          switch (this.$store.state.System.toolbar) {
            case 'getServers':
              f = this.$store.state.System.servers
              break;
            case 'getUsers':
              break;
            case 'getOrgs':
              break;
            case 'getPersons':
              break;
            case 'getServerFunctions':
              break;
            default:
              break;
          }
          return f
        }
      },
      toolbar: {
        get() {
          return this.$store.state.System.toolbar
        }
      },
      server: {
        get() {
          return this.$store.state.System.server
        }
      },
      port: {
        get() {
          return this.$store.state.System.port
        }
      },
    },
    methods: {
      connect: function (data, index) {
        data = [data.host, data.port]
        this.flag = index
        this.$store.commit('SYSTEM_SET_SERVER', data)
        if (this.toolbar === 'getServers') {
          sConnect(this, data, index)
        }
      },
      setFirst: function (data, index) {
        this.file.forEach((x, i) => {
          let setting = ''
          if (i === index) {
            setting = '1'
          } else {
            setting = ''
          }
          const id = '_id'
          dataDB(this, 'local', 'server', { _id: x[id] }, 'update', { setting: setting })
        })
        dataDB(this, 'local', 'server', {}, 'serverConfig', { sort: { field: 'setting', type: 'desc' } }, null, null)
      },
      addServer: function () {
        this.$store.commit('SYSTEM_SET_TOOLBAR', 'sddServers')
      },
      addServerSubmit: function () {
        if (this.serverInput.name !== '' && this.serverInput.host !== '' && this.serverInput.port !== '') {
          dataDB(this, 'local', 'server', this.serverInput, 'addServerConfig', { sort: { field: 'setting', type: 'desc' } }, null, null)
        } else {
          this.$store.commit('SET_NOTICE', '请填写完整后再点击确认按钮')
        }
      },
    },
  };
</script>

<style scoped>
.orgs{
  margin-top: 0.8em;
}
</style>
