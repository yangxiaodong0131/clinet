
import saveFile from './SaveFile';
const axios = require('axios');
const qs = require('qs');
// const fs = require('fs');
// this, [url, port, serverType]
export function getLibraryFiles(obj, data, serverType = 'server', show = null) {
  axios({
    method: 'get',
    url: `http://${data[0]}:${data[1]}/library/rule_file?server_type=${serverType}`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    responseType: 'json'
  }).then((res) => {
    if (res.status === 200) {
      if (show) {
        obj.$store.commit('EDIT_SERVER_FILES', res.data.data)
      } else {
        obj.$store.commit('LIBRARY_SERVER_FILES', res.data)
      }
      // obj.$store.commit('LIBRARY_SET_TABLE_TYPE', 'server');
    } else {
      obj.$store.commit('LIBRARY_SERVER_FILES', [])
    }
  }).catch((err) => {
    console.log(err);
    obj.$store.commit('SET_NOTICE', '连接服务器错误')
    obj.$store.commit('LIBRARY_SERVER_FILES', [])
  })
}

export function getLibrary(obj, data, tableName, pageNum, dimensionType, dimensionServer, type1, serverType = 'server', sort) {
  // 去除文件名中的.csv
  const type = tableName.split('.csv')[0]
  let url = ''
  if (dimensionType !== null) {
    const keys = Object.keys(dimensionServer)
    keys.forEach((n) => {
      if (dimensionServer[n] !== '') {
        url = `&${n}=${dimensionServer[n]}${url}`
      }
    })
  } else {
    url = ''
  }
  let sorts = ''
  if (sort.field !== '') {
    sorts = `&order_type=${sort.type}&order=${sort.field}`
  } else {
    sorts = ''
  }
  let username = ''
  if (type1 === 'edit') {
    username = obj.$store.state.System.user.username
  }
  axios({
    method: 'get',
    url: `http://${data[0]}:${data[1]}/library/rule_client?rows=30&username=${username}&tab_type=${type}&page=${pageNum}&server_type=${serverType}${url}${sorts}`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    responseType: 'json'
  }).then((res) => {
    if (res.status === 200) {
      const library = res.data.library
      const countPage = res.data.count
      let page = parseInt(res.data.page, 10)
      if (countPage === 0) {
        page = 0
      }
      const opt = { page: page, countPage: res.data.count, pageList: res.data.page_list, tableName: tableName };
      obj.$store.commit('LIBRARY_SET_SERVER_TABLE', library.slice(1));
      obj.$store.commit('LIBRARY_SET_TABLE_INFO', opt)
      obj.$store.commit('LIBRARY_SET_SERVER_SORT', [res.data.order, res.data.order_type])
      obj.$store.commit('LIBRARY_SET_LIBRARY_LIST', res.data.list);
      obj.$store.commit('LIBRARY_SET_COUNT_PAGE', res.data.count);
      obj.$store.commit('SET_NOTICE', `当前${obj.$store.state.Library.libraryTableInfo.page}页,共${obj.$store.state.Library.libraryTableInfo.countPage}页`);
      if (type1) {
        // console.log(res.data.library.filter(x => x !== undefined).map(x => x.join(',')));
        obj.$store.commit('EDIT_LOAD_FILE', res.data.library.filter(x => x !== undefined).map(x => x.join(',')))
        // obj.$store.commit('EDIT_LOAD_FILE', res.data.library.filter(x => x !== undefined).map(x => x.join(','))).map(x => x.join(','))
      }
      // obj.$store.commit('EDIT_LOAD_FILE', res.data.library.filter(x => x !== undefined).map(x => x.join(',')))
      // .map(x => x.join(','))
    } else {
      obj.$store.commit('LIBRARY_SET_SERVER_TABLE', {})
    }
  }).catch((err) => {
    console.log(err);
    obj.$store.commit('SET_NOTICE', '连接服务器错误')
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
    console.log(err)
    obj.$store.commit('SET_NOTICE', '连接服务器错误')
    obj.$store.commit('LIBRARY_SET_LEFT_PANEL', ['dimension', type, []])
  })
}

export function librarDown(obj, url, fileName) {
  const filename = fileName.split('.csv')[0]
  axios({
    method: 'get',
    url: `http://${url[0]}:${url[1]}/library/rule_down?filename=${filename}`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    responseType: 'json'
  }).then((res) => {
    if (res.status === 200) {
      obj.$store.commit('SET_NOTICE', '下载成功')
      obj.$store.commit('LIBRARY_GET_DOWN_FILE', res.data.result)
      if (fileName !== '模板.csv') {
        saveFile(obj, fileName, '/library')
      } else {
        saveFile(obj, fileName, '/user')
      }
    } else {
      obj.$store.commit('SET_NOTICE', '下载失败')
    }
  }).catch((err) => {
    console.log(err);
    obj.$store.commit('SET_NOTICE', '下载失败')
  })
}

export function getLibrarySerach(obj, url, fileName, value, servertype) {
  console.log(value);
  const filename = fileName.split('.csv')[0]
  axios({
    method: 'get',
    url: `http://${url[0]}:${url[1]}/library/rule_search?filename=${filename}&value=${value}&servertype=${servertype}`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    responseType: 'json'
  }).then((res) => {
    if (res.status === 200) {
      const library = res.data.result
      obj.$store.commit('LIBRARY_SET_TABLE_TYPE', 'search')
      obj.$store.commit('LIBRARY_SET_SEARCH_TABLE', library.slice(1));
    } else {
      obj.$store.commit('SET_NOTICE', '下载失败')
    }
  }).catch((err) => {
    console.log(err);
    obj.$store.commit('SET_NOTICE', '下载失败')
  })
}

export function saveLibrary(obj, data, content) {
  const user = obj.$store.state.System.user;
  const tableName = obj.$store.state.Library.libraryTableInfo.tableName;
  const pageNum = obj.$store.state.Library.libraryTableInfo.page;
  const serverType = 'server'
  const sort = obj.$store.state.Library.serverSort;
  // 去除文件名中的.csv
  const type = tableName.split('.csv')[0]
  axios({
    method: 'post',
    url: `http://${data[0]}:${data[1]}/library/client_save`,
    data: qs.stringify({ data: JSON.stringify(content), username: user.username, tab_type: type, rows: 30, page: pageNum, order: sort.field, order_type: sort.type, server_type: serverType }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    responseType: 'json'
  }).then((res) => {
    if (res.status === 200) {
      obj.$store.commit('SET_NOTICE', `保存字典     ${tableName}     成功!`);
    } else {
      obj.$store.commit('SET_NOTICE', `保存字典     ${tableName}     失败,文件已经存在!`);
    }
  }).catch((err) => {
    console.log(err)
    obj.$store.commit('SET_NOTICE', '保存字典失败!');
  })
}

export function saveLibraryPage(obj, data, content, header, table, dataIndex, type) {
  const user = obj.$store.state.System.user;
  const tableName = obj.$store.state.Library.libraryTableInfo.tableName;
  const pageNum = obj.$store.state.Library.libraryTableInfo.page;
  const serverType = 'server'
  const sort = obj.$store.state.Library.serverSort;
  // 去除文件名中的.csv
  const tabType = tableName.split('.csv')[0]
  obj.$store.commit('LIBRARY_SET_SERVER_TABLE', []);
  axios({
    method: 'post',
    url: `http://${data[0]}:${data[1]}/library/client_save2`,
    data: qs.stringify({ data: JSON.stringify(content), header: JSON.stringify(header), page: pageNum, username: user.username, tab_type: tabType, rows: 30, order: sort.field, order_type: sort.type, server_type: serverType, type: type }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    responseType: 'json'
  }).then((res) => {
    if (res.status === 200) {
      if (type === 'add') {
        const idIndex = table[0].indexOf('ID');
        table[dataIndex][idIndex] = res.data.id
        obj.$store.commit('LIBRARY_SET_SERVER_TABLE', table);
      } else if (type === 'delete') {
        const library = res.data.library
        obj.$store.commit('LIBRARY_SET_SERVER_TABLE', library.slice(1));
      } else {
        obj.$store.commit('LIBRARY_SET_SERVER_TABLE', table);
      }
      obj.$store.commit('SET_NOTICE', res.data.info);
    } else {
      obj.$store.commit('SET_NOTICE', '保存字典失败!');
    }
  }).catch((err) => {
    console.log(err)
    obj.$store.commit('SET_NOTICE', '保存字典失败!');
  })
}
