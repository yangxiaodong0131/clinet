
import saveFile from './SaveFile';
const axios = require('axios');
// const fs = require('fs');
// this, [url, port, serverType]
export function getLibraryFiles(obj, data, serverType = 'server') {
  axios({
    method: 'get',
    url: `http://${data[0]}:${data[1]}/library/rule_file?server_type=${serverType}`,
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

export function getLibrary(obj, data, tableName, pageNum, dimensionType, dimensionServer, type1, serverType = 'server') {
  // 去除文件名中的.csv
  const type = tableName.split('.csv')[0]
  let url = ''
  if (dimensionType !== '') {
    if (dimensionType === 'time') {
      dimensionType = 'year'
    }
    url = `&${dimensionType}=${dimensionServer}`
  }
  axios({
    method: 'get',
    url: `http://${data[0]}:${data[1]}/library/rule_client?rows=30&tab_type=${type}&page=${pageNum}&server_type=${serverType}${url}`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    responseType: 'json'
  }).then((res) => {
    if (res.status === 200) {
      const library = res.data.library
      const opt = { page: parseInt(res.data.page, 10), countPage: res.data.count, data: library.slice(1), pageList: res.data.page_list, tableName: tableName };
      obj.$store.commit('LIBRARY_SET_SERVER_TABLE', opt);
      obj.$store.commit('LIBRARY_SET_SERVER_DIMENSIONS', res.data.list)
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
  console.log(file)
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
    console.log(err)
    obj.$store.commit('LIBRARY_SET_LEFT_PANEL', ['dimension', type, []])
  })
}
export function librarDown(obj, url, filename) {
  axios({
    method: 'get',
    url: `http://${url[0]}:${url[1]}/library/rule_down?filename=${filename}`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    responseType: 'json'
  }).then((res) => {
    if (res.status === 200) {
      obj.$store.commit('SET_NOTICE', '下载成功')
      obj.$store.commit('LIBRARY_GET_DOWN_FILE', res.data.result)
      saveFile(obj, filename, '/library')
    } else {
      obj.$store.commit('SET_NOTICE', '下载失败')
    }
  }).catch((err) => {
    console.log(err);
    obj.$store.commit('SET_NOTICE', '下载失败')
  })
}
export function getLibrarySerach(obj, url, filename, value, servertype) {
  axios({
    method: 'get',
    url: `http://${url[0]}:${url[1]}/library/rule_search?filename=${filename}&value=${value}&servertype=${servertype}`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    responseType: 'json'
  }).then((res) => {
    if (res.status === 200) {
      const library = res.data.result
      const opt = { page: 0, countPage: 0, data: library.slice(1), pageList: [], tableName: filename };
      obj.$store.commit('LIBRARY_SET_SERVER_TABLE', opt);
    } else {
      obj.$store.commit('SET_NOTICE', '下载失败')
    }
  }).catch((err) => {
    console.log(err);
    obj.$store.commit('SET_NOTICE', '下载失败')
  })
}

