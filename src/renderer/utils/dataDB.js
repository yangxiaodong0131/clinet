// 统一的数据库操作入口，
// 包括local、server、block三层数据库
// 包括cda、library、stat、system、user等等数据表
function insert(obj, col, data) {
  obj.db[col].insert(data, (err, res) => {
    console.log(res)
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
        obj.$store.commit('LIBRARY_SET_TABLE_PAGE', countPage)
        break;
      default:
        console.log(res);
        break;
    }
    obj.$store.commit('SET_NOTICE', `当前1页,共${countPage}页`)
  })
}

function update(obj, col, data, ops) {
  obj.db[col].update(data, ops, (err, res) => {
    console.log(res)
  })
}

function remove(obj, col, data, ops) {
  obj.db[col].remove(data, ops, (err, res) => {
    console.log(res)
  })
}

// obj type(local,server,block) 表  条件 操作类型  条件2
export default function (obj, fileType, col, data, type, ops, skip = null, limit = null) {
  switch (fileType) {
    case 'local':
      switch (type) {
        case 'insert': insert(obj, col, data); break
        case 'find': find(obj, col, data, type, skip, limit); break
        case 'findOne': findOne(obj, col, data); break
        case 'count': count(obj, col, data); break
        case 'update': update(obj, col, data, ops); break
        case 'remove': remove(obj, col, data, ops); break
        case 'editFiles': find(obj, col, data, type, skip, limit); break
        case 'editFile': findOne(obj, col, data, type); break
        case 'libraryFiles': find(obj, col, data, type, skip, limit); break
        case 'libraryFile': find(obj, col, data, type, skip, limit); break
        case 'libraryCount': count(obj, col, data, type, limit); break
        case 'statFiles': find(obj, col, data, type, skip, limit); break
        case 'statFile': find(obj, col, data, type, skip, limit); break
        default: break
      }
      break
    case 'server':
      break
    case 'block':
      break
    default: break
  }
}
