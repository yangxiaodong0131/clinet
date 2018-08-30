// 统一的数据库操作入口，
// 包括local、server、block三层数据库
// 包括cda、library、stat、system、user等等数据表
import { getLibraryFiles, getLibrary } from './LibraryServerFile'
import { getStatFiles } from './StatServerFile'
function insert(obj, col, data, type) {
  obj.db[col].insert(data, (err, res) => {
    // obj.$store.commit('SET_NOTICE', `文件「${x}」保存成功！`)
    switch (type) {
      case 'createCda':
        obj.$store.commit('SET_NOTICE', `文件「${data.fileName}」保存成功！`)
        break;
      default:
        console.log(res);
        break;
    }
  })
}

function find(obj, col, data, type, skip, limit) {
  let query = obj.db[col].find(data)
  if (skip !== null && limit !== null) {
    query = query.skip(skip).limit(limit)
  }
  query.exec((err, res) => {
    switch (type) {
      case 'editFiles':
        obj.$store.commit('EDIT_LOAD_FILES', res.map(x => x.fileName));
        break;
      case 'libraryFiles':
        obj.$store.commit('LIBRARY_LOAD_FILES', res.map(x => x.fileName));
        break;
      case 'libraryFile':
        obj.$store.commit('LIBRARY_LOAD_FILE', res);
        break;
      case 'statFiles':
        obj.$store.commit('STAT_LOAD_FILES', res.map(x => x.fileName));
        break;
      case 'statFile':
        obj.$store.commit('STAT_SET_TABLE', res);
        break;
      default:
        console.log(res);
        break;
    }
  })
}

function findOne(obj, col, data, type) {
  obj.db[col].findOne(data, (err, res) => {
    switch (type) {
      case 'editFile':
        obj.$store.commit('EDIT_LOAD_FILE', res.value);
        break;
      default:
        console.log(res);
        break;
    }
  })
}

function count(obj, col, data, type, limit) {
  obj.db[col].count(data, (err, res) => {
    const countPage = Math.ceil(res / limit)
    switch (type) {
      case 'libraryCount':
        obj.$store.commit('LIBRARY_SET_COUNT_PAGE', countPage)
        break;
      case 'statCount':
        obj.$store.commit('STAT_SET_COUNT_PAGE', countPage)
        break;
      default:
        console.log(res);
        break;
    }
    obj.$store.commit('SET_NOTICE', `当前1页,共${countPage}页`)
  })
}

function update(obj, col, data, newData) {
  obj.db[col].update(data, { $set: newData }, (err, res) => {
    console.log(res)
  })
}

function remove(obj, col, data, newData) {
  obj.db[col].remove(data, newData, (err, res) => {
    console.log(res)
  })
}

// obj type(local,server,block) 表  条件 操作类型  条件2
export default function (obj, serverType, col, data, type, newData, skip = null, limit = null) {
  console.log([serverType, col, data, type, newData, skip, limit]);
  switch (serverType) {
    case 'local':
      switch (type) {
        case 'insert': insert(obj, col, data, type); break
        case 'find': find(obj, col, data, type, skip, limit); break
        case 'findOne': findOne(obj, col, data); break
        case 'count': count(obj, col, data); break
        case 'update': update(obj, col, data, newData, type); break
        case 'remove': remove(obj, col, data, newData); break
        case 'editFiles': find(obj, col, data, type, skip, limit); break
        case 'editFile': findOne(obj, col, data, type); break
        case 'createCda': insert(obj, col, data, type); break
        case 'saveCda': update(obj, col, data, newData, type); break
        case 'libraryFiles': find(obj, col, data, type, skip, limit); break
        case 'libraryFile': find(obj, col, data, type, skip, limit); break
        case 'libraryCount': count(obj, col, data, type, limit); break
        case 'statFiles': find(obj, col, data, type, skip, limit); break
        case 'statFile': find(obj, col, data, type, skip, limit); break
        case 'statCount': count(obj, col, data, type, limit); break
        default: break
      }
      break
    default:
      if (obj.$store.state.System.user.login) {
        const serverConfig = [obj.$store.state.System.server, obj.$store.state.System.port]
        const page = skip / 30
        switch (type) {
          case 'libraryFiles':
            getLibraryFiles(obj, serverConfig, serverType);
            break
          case 'libraryFile':
            getLibrary(obj, serverConfig, data.fileType, page + 1, newData.dimensionType, newData.serverDimension, newData.type1, serverType, newData.sort)
            break;
          case 'statFiles':
            getStatFiles(obj, serverConfig, newData.fileType, newData.username, newData.tableType)
            break
          case 'statFile': find(obj, col, data, type, skip, limit); break
          default: break
        }
      } else {
        obj.$store.commit('SET_NOTICE', '未登录用户,请在系统服务-用户设置内登录');
      }
      break
  }
}
