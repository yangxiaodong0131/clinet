// 统一的数据库操作入口，
// 包括local、server、block三层数据库
// 包括cda、library、stat、system、user等等数据表
import { getLibraryFiles, getLibrary, downloadLibrary, getLibrarySerach, saveLibraryPage } from './LibraryServerFile'
import { getStatFiles, getStat, downloadStat } from './StatServerFile'
import { getEditFiles, getEdit, saveEdit, getEditTypes } from './EditServerFile'
import pageSearch from './PageSearch';
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
        break;
    }
    obj.$store.commit('SET_NOTICE', `当前1页,共${countPage}页`)
  })
}

function find(obj, col, data, type, skip, limit, newData) {
  let query = obj.db[col].find(data)
  if (newData && newData.sort && newData.sort.field && newData.sort.type) {
    const sortQuery = {}
    if (newData.sort.type === 'asc') {
      sortQuery[newData.sort.field] = 1
    } else {
      sortQuery[newData.sort.field] = -1
    }
    query = query.sort(sortQuery)
  }
  if (skip !== null && limit !== null) {
    query = query.skip(skip).limit(limit)
  }
  query.exec((err, res) => {
    const obj1 = {}
    switch (type) {
      case 'editTypes':
        if (res) {
          const type = []
          res.forEach((x) => {
            if (x.docType === undefined) {
              x = '未定义'
            } else {
              x = x.docType
            }
            if (obj1[x]) {
              obj1[x] += 1
            } else {
              obj1[x] = 1
            }
          })
          const keys = Object.keys(obj1)
          keys.forEach((x) => {
            type.push([x, obj1[x]])
          })
          obj.$store.commit('EDIT_LOAD_FILES', type)
        }
        break;
      case 'editModels':
        if (res) {
          const type = []
          obj.$store.commit('EDIT_SET_EDIT_MODELS', res)
          res.forEach((x) => {
            if (x.modelType === undefined) {
              x = '未定义模板'
            } else {
              x = x.modelType
            }
            if (obj1[x]) {
              obj1[x] += 1
            } else {
              obj1[x] = 1
            }
          })
          const keys = Object.keys(obj1)
          keys.forEach((x) => {
            type.push([x, obj1[x]])
          })
          obj.$store.commit('EDIT_LOAD_FILES', type)
        }
        break;
      case 'editUsers':
        if (res) {
          const type = []
          res.forEach((x) => {
            if (x.userName === undefined) {
              x = '未定义用户'
            } else {
              x = x.userName
            }
            if (obj1[x]) {
              obj1[x] += 1
            } else {
              obj1[x] = 1
            }
          })
          const keys = Object.keys(obj1)
          keys.forEach((x) => {
            type.push([x, obj1[x]])
          })
          obj.$store.commit('EDIT_LOAD_FILES', type)
        }
        break;
      case 'editPatients':
        if (res) {
          const type = []
          res.forEach((x) => {
            if (x.id === undefined) {
              x = '未定义客户'
            } else {
              x = x.id
            }
            if (obj1[x]) {
              obj1[x] += 1
            } else {
              obj1[x] = 1
            }
          })
          const keys = Object.keys(obj1)
          keys.forEach((x) => {
            type.push([x, obj1[x]])
          })
          obj.$store.commit('EDIT_LOAD_FILES', type)
        }
        break;
      case 'editCaseHistory':
        if (res) {
          const arr = []
          res.forEach((x) => {
            x.value.forEach((y) => {
              if (y[0] === '姓名' && y[1] === newData.barValue[1]) {
                arr.push([x.fileName, x.docType])
              }
            })
          })
          obj.$store.commit('EDIT_SET_DOC_HIS', arr)
        }
        break;
      case 'editFiles':
        if (res.length > 0 && res[0].fileType === 'cda') {
          const a = res.map((x) => {
            x = [x.fileName, x.docType]
            return x
          });
          obj.$store.commit('EDIT_LOAD_FILE', a)
        } else if (res.length > 0 && res[0].fileType === 'model') {
          const keys = Object.keys(res[0].value)
          const a = keys.map(x => [x]);
          obj.$store.commit('EDIT_LOAD_FILE', a)
          obj.$store.commit('EDIT_SET_EDIT_MODELS', res)
        } else {
          obj.$store.commit('EDIT_LOAD_FILE', [])
        }
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
      case 'serverConfig':
        obj.$store.commit('SYSTEM_SET_SERVERS', res)
        break;
      default:
        console.log(res);
        break;
    }
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
      // query = obj.db.statFile.count({ fileName: data.fileName })
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
        case 'addServerConfig':
          find(obj, 'server', {}, 'serverConfig', null, null, newData)
          obj.$store.commit('SYSTEM_SET_TOOLBAR', 'getServers')
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
  find(obj, 'cda', { fileType: 'cda' }, 'editFiles', null, null, newData)
}

function findOne(obj, col, data, type) {
  obj.db[col].findOne(data, (err, res) => {
    switch (type) {
      case 'editFile':
        obj.$store.commit('EDIT_LOAD_DOC', res.value);
        break;
      case 'consultFile':
        obj.$store.commit('EDIT_LOAD_DOC_SHOW', res.value);
        break;
      default:
        console.log(res);
        break;
    }
  })
}

function update(obj, col, data, newData) {
  obj.db[col].update(data, { $set: newData }, (err, res) => {
    obj.$store.commit('EDIT_SET_HINT_TYPE', 'notice');
    if (res > 0) {
      obj.$store.commit('SET_NOTICE', '保存成功！');
    } else {
      obj.$store.commit('SET_NOTICE', '保存失败，请重新编辑保存！');
    }
  })
}

function remove(obj, col, data, newData) {
  obj.db[col].remove(data, (err, res) => {
    obj.$store.commit('EDIT_SET_HINT_TYPE', 'notice');
    if (res > 0) {
      obj.$store.commit('SET_NOTICE', '删除成功！');
    } else {
      obj.$store.commit('SET_NOTICE', '删除失败，请重新编辑删除！');
    }
    find(obj, 'cda', { fileType: 'cda' }, 'editTypes', null, null, newData)
    find(obj, 'cda', { docType: data.docType }, 'editFiles', null, null, newData)
  })
}

// obj type(local,server,block) 表  条件 操作类型  条件2
export default function (obj, serverType, col, data, type, newData, skip = null, limit = null) {
  switch (serverType) {
    case 'local':
      switch (type) {
        case 'insert': insert(obj, col, data, type); break
        case 'find': find(obj, col, data, type, skip, limit, newData); break
        case 'findOne': findOne(obj, col, data); break
        case 'count': count(obj, col, data); break
        case 'update': update(obj, col, data, newData, type); break
        case 'remove': remove(obj, col, data, newData); break
        case 'editFiles': find(obj, col, data, type, skip, limit, newData); break
        case 'editUsers': find(obj, col, data, type, skip, limit, newData); break
        case 'editPatients': find(obj, col, data, type, skip, limit, newData); break
        case 'editModels': find(obj, col, data, type, skip, limit, newData); break
        case 'editTypes': find(obj, col, data, type, skip, limit, newData); break
        case 'editFile': findOne(obj, col, data, type); break
        // 病案参考文件
        case 'consultFile': findOne(obj, col, data, type); break
        // 病案历史
        case 'editCaseHistory': find(obj, col, data, type, skip, limit, newData); break
        case 'createCda': insert(obj, col, data, type); break
        case 'saveCda': update(obj, col, data, newData, type); break
        case 'libraryFiles': find(obj, col, data, type, skip, limit, newData); break
        case 'libraryFile': find(obj, col, data, type, skip, limit, newData); break
        case 'downloadLibrary': insert(obj, col, data, type, newData); break
        case 'statFiles': find(obj, col, data, type, skip, limit, newData); break
        case 'statFile': find(obj, col, data, type, skip, limit, newData); break
        case 'downloadStat': insert(obj, col, data, type, newData); break
        case 'serverConfig': find(obj, col, data, type, skip, limit, newData); break
        case 'addServerConfig': insert(obj, col, data, type, newData); break
        case 'serach':
          if (newData.header.length > 0) {
            type = newData.tableType
            const queryData = []
            newData.header.forEach((x) => {
              const obj = {}
              obj[x] = newData.val
              queryData.push(obj)
            })
            find(obj, col, { $or: queryData, fileType: data.fileType }, type, null, null, newData);
          }
          break;
        case 'savePage':
          if (newData.type) {
            type = newData.tableType
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
            getLibrary(obj, serverConfig, data.fileType, page + 1, newData.serverDimension, newData.dimensionServer, serverType, newData.sort)
            break;
          case 'serach':
            if (newData.tableType === 'librarySerach') {
              getLibrarySerach(obj, serverConfig, data.fileType, newData.val, serverType)
            }
            break;
          case 'savePage':
            if (newData.tableType === 'saveLibraryPage') {
              saveLibraryPage(obj, serverConfig, newData.data, newData.header, newData.table, newData.dataIndex, newData.type)
            }
            // saveLibraryPage
            break;
          case 'downloadLibrary':
            downloadLibrary(obj, serverConfig, data.fileType);
            break;
          case 'statFiles':
            getStatFiles(obj, serverConfig, newData.fileType, newData.username, serverType)
            break;
          case 'statFile':
            getStat(obj, serverConfig, { tableName: newData.fileType, page: page + 1, username: newData.username, dimension: newData.dimension, sort: newData.sort }, newData.tableType, serverType)
            break;
          case 'downloadStat':
            downloadStat(obj, serverConfig, { tableName: newData.fileType, page: 1, username: newData.username, dimension: newData.dimension, sort: newData.sort }, 'stat')
            break;
          case 'editFiles':
            getEditFiles(obj, serverConfig, newData.type, newData.username)
            break
          case 'editTypes':
            getEditTypes(obj, serverConfig, newData.type, newData.username)
            break
          case 'editFile':
            getEdit(obj, serverConfig, newData.fileName, type)
            break
          case 'consultFile':
            getEdit(obj, serverConfig, newData.fileName, 'server', '', type)
            break
          case 'createCda':
            saveEdit(obj, serverConfig, newData.fileName, newData.content, newData.username, newData.doctype, newData.mouldtype)
            break
          default: break
        }
      } else {
        obj.$store.commit('SET_NOTICE', '未登录用户,请在系统服务-用户设置内登录');
      }
      break
  }
}
