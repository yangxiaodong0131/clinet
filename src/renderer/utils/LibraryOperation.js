import { getLibraryFiles } from './LibraryServerFile'

export default function getLibraryFile(obj, n, show = null) {
  if (n === '本地') {
    obj.$store.commit('LIBRARY_SET_LEFT_PANEL', ['file', null]);
    if (show) {
      obj.$store.commit('EDIT_OTHER_LOAD_FILES', 'library');
    } else {
      obj.$store.commit('LIBRARY_LOAD_FILES');
    }
    obj.$store.commit('LIBRARY_SET_TABLE_TYPE', 'local');
    obj.$store.commit('SET_NOTICE', '本地文件');
  } else if (n === '远程') {
    if (!obj.$store.state.System.user.login) {
      obj.$store.commit('SET_NOTICE', '未登录用户,请在系统服务-用户设置内登录');
    } else if (show) {
      getLibraryFiles(obj, [obj.$store.state.System.server, obj.$store.state.System.port], 'server', 'edit')
    } else {
      obj.$store.commit('SET_NOTICE', '远程文件');
      obj.$store.commit('LIBRARY_SET_TABLE_TYPE', 'server');
      obj.$store.commit('LIBRARY_SET_LEFT_PANEL', ['file', null]);
      getLibraryFiles(obj, [obj.$store.state.System.server, obj.$store.state.System.port], 'server')
    }
  } else if (n === '区块链') {
    if (!obj.$store.state.System.user.login) {
      obj.$store.commit('SET_NOTICE', '未登录用户,请在系统服务-用户设置内登录');
    } else {
      obj.$store.commit('SET_NOTICE', '区块链文件');
      obj.$store.commit('LIBRARY_SET_TABLE_TYPE', 'block');
      obj.$store.commit('LIBRARY_SET_LEFT_PANEL', ['file', null]);
      getLibraryFiles(obj, [obj.$store.state.System.server, obj.$store.state.System.port], 'block')
    }
  }
}
