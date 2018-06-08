const axios = require('axios');
// const qs = require('qs');
// this, [url, port, serverType]
export function getLibraryFiles(obj, data) {
  console.log(data);
  if (data[2] === undefined) {
    data[2] = 'server'
  }
  axios({
    method: 'get',
    url: `http://${data[0]}:${data[1]}/library/rule_file?server_type=${data[2]}`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    responseType: 'json'
  }).then((res) => {
    if (res.status === 200) {
      obj.$store.commit('LIBRARY_SERVER_FILES', res.data)
      // obj.$store.commit('LIBRARY_SET_TABLE_TYPE', 'server');
    } else {
      obj.$store.commit('LIBRARY_SERVER_FILES', [])
    }
  }).catch((err) => {
    console.log(err);
    obj.$store.commit('LIBRARY_SERVER_FILES', [])
  })
}
// this, [url, port, tableName, pageNum, dimensionType, dimensionServer,  serverType]
export function getLibrary(obj, data) {
  if (data[5] === undefined) {
    data[5] = 'server'
  }
  // 去除文件名中的.csv
  const tableName = data[2]
  const type = data[2].split('.csv')[0]
  const pageNum = data[3]
  let url = ''
  if (data[4] !== '') {
    url = `&${data[4]}=${data[5]}`
  }
  axios({
    method: 'get',
    url: `http://${data[0]}:${data[1]}/library/rule_client?rows=30&tab_type=${type}&page=${pageNum}&server_type=${data[6]}${url}`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    responseType: 'json'
  }).then((res) => {
    if (res.status === 200) {
      const opt = { page: parseInt(res.data.page, 10), countPage: res.data.count, data: res.data.library.slice(1), pageList: res.data.page_list, tableName: tableName };
      obj.$store.commit('LIBRARY_SET_SERVER_TABLE', opt);
      obj.$store.commit('LIBRARY_SET_COUNT_PAGE', res.data.count);
      obj.$store.commit('SET_NOTICE', `当前${obj.$store.state.Library.serverTable.page}页,共${obj.$store.state.Library.serverTable.countPage}页`);
      // obj.$store.commit('EDIT_LOAD_FILE', res.data.library.filter(x => x !== undefined).map(x => x.join(',')))
      // .map(x => x.join(','))
    } else {
      obj.$store.commit('LIBRARY_SET_SERVER_TABLE', {})
    }
  }).catch((err) => {
    console.log(err);
    obj.$store.commit('LIBRARY_SET_SERVER_TABLE', {})
  })
}
// this, url, tableName, type, username, serverType
export function getList(obj, url, tableName, type, username, serverType = 'server') {
  let file = tableName
  // 去除文件名中的.csv
  file = tableName.split('.csv')[0]
  axios({
    method: 'get',
    url: `http://${url[0]}:${url[1]}/library/rule_client?tab_type=${file}&server_type=${serverType}&type=${type}&username=${username}`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    responseType: 'json'
  }).then((res) => {
    if (res.status === 200) {
      obj.$store.commit('LIBRARY_SET_LEFT_PANEL', ['dimension', type, res.data.list])
    } else {
      obj.$store.commit('LIBRARY_SET_LEFT_PANEL', ['dimension', type, []])
    }
  }).catch((err) => {
    console.log(err);
    obj.$store.commit('LIBRARY_SET_LEFT_PANEL', ['dimension', type, []])
  })
}
