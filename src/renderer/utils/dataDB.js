// 统一的数据库操作入口，
// 包括local、server、block三层数据库
// 包括cda、library、stat、system、user等等数据表
import { getLibraryFiles, getLibrary, downloadLibrary, getLibrarySerach, saveLibraryPage } from './LibraryServerFile'
import { getStatFiles, getStat, downloadStat } from './StatServerFile'
import pageSearch from './PageSearch';
function count(obj, col, data, type, limit) {
  console.log([col, data, type, limit])
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
function insert(obj, col, data, type, newData) {
  let query = null
  let fileName = null
  switch (type) {
    case 'downloadLibrary':
      fileName = newData.fileName
      query = obj.db.libraryFile.count(newData)
      break;
    case 'downloadStat':
      fileName = newData.fileName
      query = obj.db.statFile.count(newData)
      break;
    case 'createCda':
      fileName = data.fileName
      query = obj.db.statFile.count({ fileName: data.fileName })
      break;
    default:
      break;
  }
  if (query === null) {
    obj.db[col].insert(data, () => {
      switch (type) {
        case 'createCda':
          obj.$store.commit('SET_NOTICE', `文件「${fileName}」保存成功！`)
          break;
        default:
          break;
      }
    })
  } else {
    query.exec((err, res) => {
      if (res === 0) {
        obj.db[col].insert(data)
      } else {
        obj.$store.commit('SET_NOTICE', `文件「${fileName}」保存失败,文件已经存在！`)
      }
    })
  }
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
        count(obj, col, data, 'librarCount', limit)
        break;
      case 'librarySerach':
        obj.$store.commit('LIBRARY_SET_TABLE_TYPE', 'search')
        obj.$store.commit('LIBRARY_SET_SEARCH_TABLE', res)
        break;
      case 'statFiles':
        obj.$store.commit('STAT_LOAD_FILES', res.map(x => x.fileName));
        break;
      case 'statFile':
        obj.$store.commit('STAT_SET_TABLE', res);
        count(obj, col, data, 'statCount', limit)
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
        obj.$store.commit('EDIT_LOAD_DOC', res.value);
        break;
      default:
        console.log(res);
        break;
    }
  })
}

function update(obj, col, data, newData) {
  obj.db[col].find(data, (err, res) => {
    console.log(res);
  })
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
        case 'downloadLibrary': insert(obj, col, data, type, newData); break
        case 'statFiles': find(obj, col, data, type, skip, limit); break
        case 'statFile': find(obj, col, data, type, skip, limit); break
        case 'downloadStat': insert(obj, col, data, type, newData); break
        case 'librarySerach':
          if (newData.header.length > 0) {
            const queryData = []
            newData.header.forEach((x) => {
              const obj = {}
              obj[x] = newData.val
              queryData.push(obj)
            })
            find(obj, col, { $or: queryData, fileType: data.fileType }, type, null, null);
          }
          break;
        case 'saveLibraryPage':
          if (newData.type) {
            const idIndex = newData.header.indexOf('_id');
            const id = '_id'
            const change = {}
            newData.header.forEach((x, i) => {
              change[x] = newData.data[i]
            })
            if (newData.type === 'change') {
              data[id] = newData.data[idIndex]
              update(obj, col, data, change, type);
            } else if (newData.type === 'add') {
              delete change[id];
              change.fileType = data.fileType
              insert(obj, col, change, type, null)
            } else {
              data[id] = newData.data[idIndex]
              remove(obj, col, data, {})
            }
          }
          break;
        default: break
      }
      break
    default:
      if (obj.$store.state.System.user.login || ['pageSearch'].includes(type)) {
        const serverConfig = [obj.$store.state.System.server, obj.$store.state.System.port]
        const page = skip / limit
        switch (type) {
          case 'pageSearch':
            pageSearch(obj, newData.data, newData.value)
            break;
          case 'libraryFiles':
            getLibraryFiles(obj, serverConfig, serverType);
            break;
          case 'libraryFile':
            getLibrary(obj, serverConfig, data.fileType, page + 1, newData.dimensionType, newData.serverDimension, newData.type1, serverType, newData.sort)
            break;
          case 'librarySerach':
            getLibrarySerach(obj, serverConfig, data.fileType, newData.val, serverType)
            break;
          case 'saveLibraryPage':
            saveLibraryPage(obj, serverConfig, newData.data, newData.header, newData.table, newData.dataIndex, newData.type)
            break;
          case 'downloadLibrary':
            downloadLibrary(obj, serverConfig, data.fileType);
            break;
          case 'statFiles':
            getStatFiles(obj, serverConfig, newData.fileType, newData.username, newData.tableType)
            break;
          case 'statFile':
            getStat(obj, serverConfig, { tableName: newData.fileType, page: page + 1, username: newData.username, dimension: newData.dimension, order: newData.order }, 'stat')
            break;
          case 'downloadStat':
            downloadStat(obj, serverConfig, { tableName: newData.fileType, page: 1, username: newData.username, dimension: newData.dimension, order: newData.order }, 'stat')
            break;
          default: break
        }
      } else {
        obj.$store.commit('SET_NOTICE', '未登录用户,请在系统服务-用户设置内登录');
      }
      break
  }
}
