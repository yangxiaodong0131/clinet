import Datastore from 'nedb'
import path from 'path'
import { remote } from 'electron'

const db = {};

db.test = new Datastore({
  autoload: true,
  filename: path.join(remote.app.getPath('userData'), '/test.db')
}, () => {
  db.test.ensureIndex({ fieldName: 'id', unique: true }, (err) => {
    console.log(err)
  });
})
// 用户数据表
db.user = new Datastore({
  autoload: true,
  filename: path.join(remote.app.getPath('userData'), '/user.db')
})
// cda表
db.cda = new Datastore({
  autoload: true,
  filename: path.join(remote.app.getPath('userData'), '/cda.db')
})
//
db.library = new Datastore({
  autoload: true,
  filename: path.join(remote.app.getPath('userData'), '/library.db')
})
db.libraryFile = new Datastore({
  autoload: true,
  filename: path.join(remote.app.getPath('userData'), '/libraryFile.db')
})
// 统计分析表
db.stat = new Datastore({
  autoload: true,
  filename: path.join(remote.app.getPath('userData'), '/stat.db')
})
// 统计分析表
db.statFile = new Datastore({
  autoload: true,
  filename: path.join(remote.app.getPath('userData'), '/statFile.db')
})
// 系统设置表
db.system = new Datastore({
  autoload: true,
  filename: path.join(remote.app.getPath('userData'), '/system.db')
})

db.loaded = new Datastore({
  autoload: true,
  filename: path.join(remote.app.getPath('userData'), '/loaded.db')
})

db.compare = new Datastore({
  autoload: true,
  filename: path.join(remote.app.getPath('userData'), '/compare.db')
})

export default db;
