import { getStatFiles } from './StatServerFile'

// 查找本地数据分析文件
export default function getStatFile(obj, n, show = null) {
  obj.$store.commit('STAT_SET_TABLE_PAGE', 1)
  obj.$store.commit('STAT_SET_LEFT_PANEL', ['file', null]);
  if (n === '本地') {
    obj.$store.commit('SET_NOTICE', '选择本地文件')
    obj.$store.commit('STAT_SET_TABLE_TYPE', 'local');
    if (show) {
      obj.$store.commit('EDIT_STAT_LOAD_FILES');
    } else {
      obj.$store.commit('STAT_LOAD_FILES');
    }
    obj.$store.commit('STAT_SET_CHART_IS_SHOW', 'chart');
  } else if (n === '远程') {
    if (!obj.$store.state.System.user.login) {
      obj.$store.commit('SET_NOTICE', '未登录用户,请在系统服务-用户设置内登录');
    } else {
      obj.$store.commit('SET_NOTICE', '选择远程文件')
      obj.$store.commit('STAT_SET_CHART_IS_SHOW', 'menu');
      obj.$store.commit('STAT_SET_TABLE_TYPE', 'server')
      obj.$store.commit('STAT_SET_BAR_TYPE', 'server')
      getStatFiles(obj, [obj.$store.state.System.server, obj.$store.state.System.port], '', obj.$store.state.System.user.usernamee, obj.$store.state.Stat.tableType)
    }
  } else if (n === '区块链') {
    if (!obj.$store.state.System.user.login) {
      obj.$store.commit('SET_NOTICE', '未登录用户,请在系统服务-用户设置内登录');
    } else {
      obj.$store.commit('SET_NOTICE', '区块链文件');
      obj.$store.commit('STAT_SET_TABLE_TYPE', 'block');
      obj.$store.commit('STAT_SET_BAR_TYPE', 'block');
      obj.$store.commit('STAT_SET_CHART_IS_SHOW', 'menu');
      getStatFiles(obj, [obj.$store.state.System.server, obj.$store.state.System.port], '', obj.$store.state.System.user.username, 'block')
    }
  }
}
