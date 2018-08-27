// 统一的数据库操作入口，
// 包括local、server、block三层数据库
// 包括cda、library、stat、system、user等等数据表

function insert(obj, col, data) {
  obj.db[col].insert(data, (err, res) => {
    console.log(res)
  })
}

function find(obj, col, data) {
  obj.db[col].find(data, (err, res) => {
    console.log(res)
  })
}

function findOne(obj, col, data) {
  obj.db[col].findOne(data, (err, res) => {
    console.log(res)
  })
}

function count(obj, col, data) {
  obj.db[col].count(data, (err, res) => {
    console.log(res)
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

export default function (obj, type, col, data, oper, ops) {
  // console.log(type)
  // console.log(col)
  // console.log(data)
  // console.log(oper)
  // console.log(ops)
  switch (type) {
    case 'local':
      switch (oper) {
        case 'insert': insert(obj, col, data); break
        case 'find': find(obj, col, data); break
        case 'findOne': findOne(obj, col, data); break
        case 'count': count(obj, col, data); break
        case 'update': update(obj, col, data, ops); break
        case 'remove': remove(obj, col, data, ops); break
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
