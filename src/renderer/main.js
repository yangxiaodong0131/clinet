import $ from 'jquery';
import Vue from 'vue';
import axios from 'axios';
import { ipcRenderer } from 'electron'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import App from './App';
import router from './router';
import store from './store';
import appInit from './utils/AppInit.js';
import db from './dataStore';


if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.prototype.$http = axios;
Vue.config.productionTip = false;
Vue.prototype.db = db

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
}).$mount('#app');

try {
  appInit()
} catch (err) {
  console.log(err)
}

ipcRenderer.send('asynchronous-message', 'ping')
ipcRenderer.on('asynchronous-reply', function (event, arg) {
  const message = `异步消息回复: ${arg}`
  console.log(message)
})
