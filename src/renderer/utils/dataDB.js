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
      case 'libraryFile':
        obj.$store.commit('LIBRARY_LOAD_FILE', res)
        break;
      default:
        console.log(res);
        break;
    }
  })
}

function findOne(obj, col, data) {
  obj.db[col].findOne(data, (err, res) => {
    res.json(res)
  })
}

function count(obj, col, data, callback) {
  obj.db[col].count(data, (err, res) => {
    callback(res)
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

function libraryFiles(obj, col) {
  obj.db[col].find({}, (err, res) => {
    obj.$store.commit('LIBRARY_LOAD_FILES', res.map(x => x.fileName))
  })
}
// obj type(local,server,block) 表  条件 操作类型  条件2
export default function (obj, type, col, data, oper, ops, skip = null, limit = null) {
  console.log([type, col, data, oper, ops])
  // count(obj, col, data, (a) => {
  //   console.log(a);
  //   return a;
  // })
  switch (type) {
    case 'local':
      switch (oper) {
        case 'insert': insert(obj, col, data); break
        case 'find': find(obj, col, data, skip, limit); break
        case 'findOne': findOne(obj, col, data); break
        case 'count': count(obj, col, data); break
        case 'update': update(obj, col, data, ops); break
        case 'remove': remove(obj, col, data, ops); break
        case 'libraryFiles': libraryFiles(obj, col); break
        case 'libraryFile': find(obj, col, data, oper, skip, limit); break
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
