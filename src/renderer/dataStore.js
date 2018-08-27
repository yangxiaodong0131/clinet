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

db.user = new Datastore({
  autoload: true,
  filename: path.join(remote.app.getPath('userData'), '/user.db')
})

db.cda = new Datastore({
  autoload: true,
  filename: path.join(remote.app.getPath('userData'), '/cda.db')
})

db.library = new Datastore({
  autoload: true,
  filename: path.join(remote.app.getPath('userData'), '/library.db')
})

db.stat = new Datastore({
  autoload: true,
  filename: path.join(remote.app.getPath('userData'), '/stat.db')
})

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
