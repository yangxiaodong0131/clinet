import Datastore from 'nedb'
import path from 'path'
import { remote } from 'electron'

const db = {};

db.test = new Datastore({
  autoload: true,
  filename: path.join(remote.app.getPath('userData'), '/test.db')
})

db.user = new Datastore({
  autoload: true,
  filename: path.join(remote.app.getPath('userData'), '/user.db')
})

db.cda = new Datastore({
  autoload: true,
  filename: path.join(remote.app.getPath('userData'), '/cda.db')
})

export default db;
