// import saveFile from './SaveFile';
import dataDB from './dataDB';
const axios = require('axios');
const qs = require('qs');
const ChartScatter = require('./ChartScatter');
const ChartRadar = require('./ChartRadar');
const ChartBar = require('./ChartBar');
const ChartLine = require('./ChartLine');
const ChartPie = require('./ChartPie');
const ChartData = require('./ChartData');
// this, [url, port], filename, username, serverType
export function getStatFiles(obj, data, filename, username, serverType = 'server', show = null) {
  obj.$store.commit('STAT_SET_TABLE_TYPE', serverType)
  obj.$store.commit('STAT_SET_BAR_TYPE', serverType)
  let url = ''
  if (filename !== '') {
    url = `http://${data[0]}:${data[1]}/stat/stat_file?name=${filename}&username=${username}&server_type=${serverType}`
  } else {
    url = `http://${data[0]}:${data[1]}/stat/stat_file?username=${username}&server_type=${serverType}`
  }
  axios({
    method: 'get',
    url: url,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    responseType: 'json'
  }).then((res) => {
    if (res.status === 200) {
      console.log(res.data.data);
      // 菜单层级
      if (show) {
        obj.$store.commit('EDIT_SERVER_FILES', res.data.data);
      } else {
        obj.$store.commit('STAT_SET_SERVER_MENU', [res.data.menu, res.data.data])
      }
      // obj.$store.commit('STAT_SERVER_FILES', res.data)
    } else {
      obj.$store.commit('STAT_SERVER_FILES', [])
    }
  }).catch((err) => {
    console.log(err);
    obj.$store.commit('SET_NOTICE', '连接服务器错误')
    obj.$store.commit('STAT_SERVER_FILES', [])
  })
}

export function getStat(obj, data, opt, tableType, serverType = 'server') {
  obj.$store.commit('STAT_SET_TABLE_TYPE', serverType)
  let file = opt.tableName
  const tableName = file
  // 去除文件名中的.csv
  file = file.split('.csv')[0]
  // 切分查看是否有总数.平均.占比等工具查询
  let pageType = file
  file = file.split('_')
  let toolType = ''
  if (['总数', '平均', '占比'].includes(file[file.length - 1])) {
    pageType = file.splice(0, file.length - 1).join('_')
    switch (file[file.length - 1]) {
      case '总数':
        toolType = 'total'
        break;
      case '平均':
        toolType = 'avg'
        break;
      case '占比':
        toolType = 'rate'
        break;
      default:
        break;
    }
  }
  axios({
    method: 'get',
    url: `http://${data[0]}:${data[1]}/stat/stat_client?page=${opt.page}&server_type=${serverType}&page_type=${pageType}&tool_type=${toolType}&rows=20&username=${opt.username}&type=${opt.dimension.type}&org=${opt.dimension.org}&drg=${opt.dimension.drg}&time=${opt.dimension.time}&order=${opt.sort.field}&order_type=${opt.sort.type}`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    responseType: 'json'
  }).then((res) => {
    if (res.status === 200) {
      obj.$store.commit('SET_NOTICE', `当前${opt.page}页,共${res.data.count}页`)
      const resObj = { page: parseInt(res.data.page, 10), countPage: res.data.count, pageList: res.data.page_list, tableName: tableName, tableSel: res.data.num, dimensionOrg: res.data.org_num, dimensionTime: res.data.time_num, dimensionDrg: res.data.drg_num }
      obj.$store.commit('STAT_SET_STAT_LIST', res.data.list)
      obj.$store.commit('STAT_SET_COUNT_PAGE', res.data.count)
      obj.$store.commit('STAT_SET_TABLE', ['server', res.data.stat])
      obj.$store.commit('STAT_SET_TABLE_INFO', resObj)
      if (['edit', 'show'].includes(tableType)) {
        obj.$store.commit('EDIT_LOAD_FILE', res.data.stat.filter(x => x !== undefined).map(x => x.join(',')))
      } else {
        ChartData.default(obj, res.data.stat, obj.$store.state.Stat.selectedRow, obj.$store.state.Stat.selectedCol)
        if (res.data.count > 0) {
          switch (obj.$store.state.Stat.chartLeft) {
            case '柱状图':
              ChartBar.default('chartLeft', obj.$store.state.Stat.chartData)
              break;
            case '折线图':
              ChartLine.default('chartLeft', obj.$store.state.Stat.chartData)
              break;
            case '雷达图':
              ChartRadar.default('chartLeft', obj.$store.state.Stat.chartData)
              break;
            case '散点图':
              ChartScatter.default('chartLeft', obj.$store.state.Stat.chartData)
              break;
            case '饼图':
              ChartPie.default('chartLeft', obj.$store.state.Stat.chartData)
              break;
            default: break;
          }
          switch (obj.$store.state.Stat.chartRight) {
            case '柱状图':
              ChartBar.default('chartRight', obj.$store.state.Stat.chartData)
              break;
            case '折线图':
              ChartLine.default('chartRight', obj.$store.state.Stat.chartData)
              break;
            case '雷达图':
              ChartRadar.default('chartRight', obj.$store.state.Stat.chartData)
              break;
            case '散点图':
              ChartScatter.default('chartRight', obj.$store.state.Stat.chartData)
              break;
            case '饼图':
              ChartPie.default('chartRight', obj.$store.state.Stat.chartData)
              break;
            default: break;
          }
        }
      }
    }
  }).catch((err) => {
    obj.$store.commit('SET_NOTICE', '连接服务器错误')
    console.log(err);
  })
}

export function getStatInfo(obj, data, opt, username, serverType = 'server') {
  let file = opt.tableName
  // 去除文件名中的.csv
  file = file.split('.csv')[0]
  // 切分查看是否有总数.平均.占比等工具查询
  let pageType = file
  file = file.split('_')
  let toolType = ''
  if (['总数', '平均', '占比'].includes(file[file.length - 1])) {
    pageType = file.splice(0, file.length - 1).join('_')
    switch (file[file.length - 1]) {
      case '总数':
        toolType = 'total'
        break;
      case '平均':
        toolType = 'avg'
        break;
      case '占比':
        toolType = 'rate'
        break;
      default:
        break;
    }
  }
  axios({
    method: 'get',
    url: `http://${data[0]}:${data[1]}/stat/stat_info_client?page=${opt.page}&type=${opt.dimension.type}&org=${opt.dimension.org}&drg=${opt.dimension.drg}&time=${opt.dimension.time}&server_type=${serverType}&username=${username}&page_type=${pageType}&tool_type=${toolType}`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    responseType: 'json'
  }).then((res) => {
    if (res.status === 200) {
      obj.$store.commit('STAT_SET_SERVER_TABLE_INFO', res.data.stat)
      obj.$store.commit('STAT_SET_TABLE_TYPE', 'info')
    } else {
      obj.$store.commit('SET_NOTICE', '保存对比失败!');
    }
  }).catch((err) => {
    console.log(err)
    obj.$store.commit('SET_NOTICE', '保存对比失败!');
  })
}

// 保存对比
export function saveStat(obj, compare, data, user = { username: '' }) {
  axios({
    method: 'post',
    url: `http://${data[0]}:${data[1]}/stat/stat_create/`,
    data: qs.stringify({ data: JSON.stringify(compare), username: user.username }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    responseType: 'json'
  }).then((res) => {
    if (res.status === 200) {
      if (res.data.success) {
        obj.$store.commit('SET_NOTICE', `保存对比     ${res.data.filename}     成功!`);
      } else {
        obj.$store.commit('SET_NOTICE', `保存对比     ${res.data.filename}     失败,文件已经存在!`);
      }
    } else {
      obj.$store.commit('SET_NOTICE', '保存对比失败!');
    }
  }).catch((err) => {
    console.log(err)
    obj.$store.commit('SET_NOTICE', '保存对比失败!');
  })
}

// 获取从stat得到的wt4数据
export function getStatWt4(obj, data, org, time, drg, serverType = 'server') {
  axios({
    method: 'get',
    url: `http://${data[0]}:${data[1]}/library/stat_wt4?org=${org}&time=${time}&drg=${drg}&server_type=${serverType}`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    responseType: 'json'
  }).then((res) => {
    const resObj = { page: parseInt(res.data.page, 10), countPage: res.data.count, data: res.data.wt4, pageList: res.data.page_list, tableName: '' }
    obj.$store.commit('STAT_SET_COUNT_PAGE', res.data.count)
    obj.$store.commit('STAT_SET_CASE_TABLE', resObj)
    obj.$store.commit('STAT_SET_TABLE_TYPE', 'case')
  }).catch((err) => {
    console.log(err)
    obj.$store.commit('SET_NOTICE', '保存对比失败!');
  })
  obj.$store.commit('STAT_SET_TABLE_TYPE', serverType)
}

export function downloadStat(obj, data, opt, tableType, serverType = 'server') {
  let file = opt.tableName
  const tableName = file.split('.csv').join('')
  // 去除文件名中的.csv
  file = file.split('.csv')[0]
  // 切分查看是否有总数.平均.占比等工具查询
  let pageType = file
  file = file.split('_')
  let toolType = ''
  if (['总数', '平均', '占比'].includes(file[file.length - 1])) {
    pageType = file.splice(0, file.length - 1).join('_')
    switch (file[file.length - 1]) {
      case '总数':
        toolType = 'total'
        break;
      case '平均':
        toolType = 'avg'
        break;
      case '占比':
        toolType = 'rate'
        break;
      default:
        break;
    }
  }
  axios({
    method: 'get',
    url: `http://${data[0]}:${data[1]}/stat/download_client?page=${opt.page}&server_type=${serverType}&page_type=${pageType}&tool_type=${toolType}&rows=20&username=${opt.username}&type=${opt.dimension.type}&org=${opt.dimension.org}&drg=${opt.dimension.drg}&time=${opt.dimension.time}&order=${opt.order.field}&order_type=${opt.order.type}&table_name=${tableName}`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    responseType: 'json'
  }).then((res) => {
    if (res.status === 200) {
      dataDB(obj, 'local', 'stat', res.data.stat, 'downloadStat', { fileName: tableName }, null, null)
      dataDB(obj, 'local', 'statFile', { fileName: tableName, cUser: opt.username, uUser: opt.username, cTIme: '', uTime: '' }, 'downloadStat', { fileName: tableName }, null, null)
      obj.$store.commit('SET_NOTICE', `文件「${tableName}」保存成功！`)
    }
  }).catch((err) => {
    obj.$store.commit('SET_NOTICE', '连接服务器错误')
    console.log(err);
  })
}
export function sCustom(obj, data, value, username) {
  axios({
    method: 'get',
    url: `http://${data[0]}:${data[1]}/stat/custom?custom=${value}&username=${username}`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    responseType: 'json'
  }).then((res) => {
    if (res.status === 200) {
      obj.$store.commit('SET_NOTICE', res.data.result);
      // obj.$store.commit('STAT_SET_DOWNLOAD_TABLE', res.data.stat)
      // saveFile(obj, tableName, '/stat')
    }
  }).catch((err) => {
    obj.$store.commit('SET_NOTICE', '连接服务器错误')
    console.log(err);
  })
}
export function sGetCustom(obj, data, username, tableName) {
  axios({
    method: 'get',
    url: `http://${data[0]}:${data[1]}/stat/custom_select?username=${username}&tableName=${tableName}`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    responseType: 'json'
  }).then((res) => {
    if (res.status === 200) {
      // obj.$store.commit('SET_NOTICE', res.data.result);
      // obj.$store.commit('STAT_SET_DOWNLOAD_TABLE', res.data.stat)
      // saveFile(obj, tableName, '/stat')
    }
  }).catch((err) => {
    obj.$store.commit('SET_NOTICE', '连接服务器错误')
    console.log(err);
  })
}
