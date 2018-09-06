import axios from 'axios'
// import dataDB from './dataDB'
import db from '../dataStore';

export default function appInit() {
  const fs = require('fs')
  const path = require('path');
  const readline = require('readline');
  // dataDB({ db: db }, 'local', 'cda', null, 'count', null)
  // 文件保存位置
  let pathHome = ''
  let pathData = ''
  let pathSystem = ''
  let pathLoaded = ''
  // let pathCompare = ''
  // let pathUser = ''
  // let pathLibrary = ''
  // let pathStat = ''
  if (process.env.USERPROFILE) {
    pathHome = process.env.USERPROFILE
    pathData = '\\clinet-data'
    pathSystem = '\\system'
    pathLoaded = '\\loaded'
    // pathCompare = '\\compare'
    // pathUser = '\\user'
    // pathLibrary = '\\library'
    // pathStat = '\\stat'
  } else {
    pathHome = process.env.HOME
    pathData = '/clinet-data'
    pathSystem = '/system'
    pathLoaded = '/loaded'
    // pathCompare = '/compare'
    // pathUser = '/user'
    // pathLibrary = '/library'
    // pathStat = '/stat'
  }

  const hitbdata = path.join(pathHome, pathData);
  if (!fs.existsSync(hitbdata)) { fs.mkdirSync(hitbdata) }
  const hitbdataSystem = path.join(hitbdata, pathSystem);
  if (!fs.existsSync(hitbdataSystem)) { fs.mkdirSync(hitbdataSystem) }
  const hitbdataLoaded = path.join(hitbdata, pathLoaded);
  if (!fs.existsSync(hitbdataLoaded)) { fs.mkdirSync(hitbdataLoaded) }
  // const hitbdataCompare = path.join(hitbdata, pathCompare);
  // if (!fs.existsSync(hitbdataCompare)) { fs.mkdirSync(hitbdataCompare) }
  // const hitbdataUser = path.join(hitbdata, pathUser);
  // if (!fs.existsSync(hitbdataUser)) { fs.mkdirSync(hitbdataUser) }
  // const hitbdataLibrary = path.join(hitbdata, pathLibrary);
  // if (!fs.existsSync(hitbdataLibrary)) { fs.mkdirSync(hitbdataLibrary) }
  // const hitbdataStat = path.join(hitbdata, pathStat);
  // if (!fs.existsSync(hitbdataStat)) { fs.mkdirSync(hitbdataStat) }

  // 设置应用系统的全局变量-文件存储位置
  global.hitbdata = {};
  global.hitbdata.path = {
    home: hitbdata,
    system: hitbdataSystem,
    loaded: hitbdataLoaded
    // compare: hitbdataCompare,
    // user: hitbdataUser,
    // library: hitbdataLibrary,
    // stat: hitbdataStat
  };

  // 服务器配置文件
  global.hitbdata.server = [{ name: '远程测试服务器', host: 'www.jiankanglaifu.com', port: '80', setting: '' }]
  db.server.count({}, (err, res) => {
    if (res === 0) {
      db.server.insert({ name: '远程测试服务器', host: 'www.jiankanglaifu.com', port: '80', setting: '' })
    } else {
      db.server.find({}).sort({ setting: -1 }, (err, res) => {
        global.hitbdata.server = res;
      })
    }
  })
  // 区块链服务节点
  const blockFile = path.format({
    dir: hitbdataSystem,
    base: 'hitb_blockchain.csv'
  });
  if (fs.existsSync(blockFile)) {
    const fRead = fs.createReadStream(blockFile);
    const fReadline = readline.createInterface({ input: fRead });
    const f = []; // 将CSV文件逐行读到数组中
    const t = {}; // 将数组逐行转换为js对象

    fReadline.on('close', () => {
      f.shift();
      f.forEach((line) => {
        const x = line.split(',');
        if (!t[x[0]]) { t[x[0]] = []; }
        const a = x.shift();
        t[a].push(x);
      })
      global.hitbdata.blockchain = t;
    });

    fReadline.on('line', (line) => {
      f.push(line)
    })
  } else {
    const data = '服务器名称,IP地址,PORT端口,连接设置\n远程测试服务器,www.jiankanglaifu.com,4096,'
    global.hitbdata.blockchain = { 远程测试服务器: ['www.jiankanglaifu.com', '4096', ''] }
    fs.writeFile(blockFile, data, (err) => {
      console.log(err)
    })
  }

  // 区块链用户口令
  const blockPWD = path.format({
    dir: hitbdataSystem,
    base: 'hitb_blockchain_user.csv'
  });
  if (fs.existsSync(blockPWD)) {
    const fRead = fs.createReadStream(blockPWD);
    const fReadline = readline.createInterface({ input: fRead });
    fReadline.on('line', (line) => {
      global.hitbdata.blockchain_user = line
    })
  } else {
    const data = 'someone manual strong movie roof episode eight spatial brown soldier soup motor'
    global.hitbdata.blockchain_user = data
    fs.writeFile(blockPWD, data, (err) => {
      console.log(err)
    })
  }
  // 导入数据，系统表结构
  const tableFile = path.format({
    dir: hitbdataSystem,
    base: 'hitb_table.csv'
  });
  if (fs.existsSync(tableFile)) {
    const fRead = fs.createReadStream(tableFile);
    const fReadline = readline.createInterface({ input: fRead });
    const f = []; // 将CSV文件逐行读到数组中
    const t = {}; // 将数组逐行转换为js对象

    fReadline.on('close', () => {
      f.shift();
      f.forEach((line) => {
        const x = line.split(',');
        if (!t[x[0]]) { t[x[0]] = []; }
        const a = x.shift();
        t[a].push(x);
      })
      global.hitbdata.table = t;
    });

    fReadline.on('line', (line) => {
      f.push(line)
    })
  } else {
    axios.get('/static/hitb_table.csv')
      .then((res) => {
        fs.writeFile(tableFile, res.data, (err) => {
          console.log(err)
        })
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // cdh帮助
  db.cdh.count({}, (err, res) => {
    if (res === 0) {
      axios.get('/static/hitb_edit.cdh')
        .then((res) => {
          const t = []; // 将数组逐行转换为js对象
          const header = []
          res.data.split('\n').forEach((line) => {
            const x = line.split(' ');
            const [a, ...rest] = x;
            header.push(a)
            t.push({ key: a, value: rest, fileType: 'cdh' })
          })
          db.cdh.insert(t)
          db.cdh.insert({ fileType: 'header', value: header })
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (res > 0) {
      db.cdh.find({ fileType: 'cdh' }, (err, res) => {
        const t = {}
        const f = []
        res.forEach((x) => {
          t[x.key] = x.value
          f.push([x.key, x.value.join(' ')].join(' '))
        })
        global.hitbdata.cdhFile = f
        global.hitbdata.cdh = t;
      })
      db.cdh.findOne({ fileType: 'header' }, (err, res) => {
        global.hitbdata.cdhHeader = res.header;
      })
    }
  })

  // 读取模板的cda文件
  db.cda.count({ fileType: 'model' }, (err, res) => {
    if (res === 0) {
      axios.get('/static/hitb_model.cda')
        .then((res) => {
          const obj = {}
          res.data.split('\n').forEach((x) => {
            const s = x.split(' ').filter(i => i !== '');
            const k = s.shift()
            obj[k] = s
          })
          db.cda.insert({ fileType: 'model', value: obj })
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (res > 0) {
      db.cda.findOne({ fileType: 'model' }, (err, res) => {
        global.hitbmodel = res.value;
      })
    }
  })
  // 术语字典文件
  db.libraryFile.count({}, (err, res) => {
    if (res === 0) {
      const libraryFile = []
      // mdc
      axios.get('/static/test_mdc.json')
        .then((res) => {
          db.library.insert(res.data)
        })
        .catch((error) => {
          console.log(error);
        });
      libraryFile.push({ fileName: 'test_mdc', cUser: 'system', uUser: 'system', cTIme: '', uTime: '' })
      // adrg
      axios.get('/static/test_adrg.json')
        .then((res) => {
          db.library.insert(res.data)
        })
        .catch((error) => {
          console.log(error);
        });
      libraryFile.push({ fileName: 'test_adrg', cUser: 'system', uUser: 'system', cTIme: '', uTime: '' })
      // drg
      axios.get('/static/test_drg.json')
        .then((res) => {
          db.library.insert(res.data)
        })
        .catch((error) => {
          console.log(error);
        });
      libraryFile.push({ fileName: 'test_drg', cUser: 'system', uUser: 'system', cTIme: '', uTime: '' })
      // icd10
      axios.get('/static/test_icd10.json')
        .then((res) => {
          db.library.insert(res.data)
        })
        .catch((error) => {
          console.log(error);
        });
      libraryFile.push({ fileName: 'test_icd10', cUser: 'system', uUser: 'system', cTIme: '', uTime: '' })
      // icd9
      axios.get('/static/test_icd9.json')
        .then((res) => {
          db.library.insert(res.data)
        })
        .catch((error) => {
          console.log(error);
        });
      libraryFile.push({ fileName: 'test_icd9', cUser: 'system', uUser: 'system', cTIme: '', uTime: '' })
      // org
      axios.get('/static/test_org.json')
        .then((res) => {
          db.library.insert(res.data)
        })
        .catch((error) => {
          console.log(error);
        });
      libraryFile.push({ fileName: 'test_org', cUser: 'system', uUser: 'system', cTIme: '', uTime: '' })
      // department
      axios.get('/static/test_department.json')
        .then((res) => {
          db.library.insert(res.data)
        })
        .catch((error) => {
          console.log(error);
        });
      libraryFile.push({ fileName: 'test_department', cUser: 'system', uUser: 'system', cTIme: '', uTime: '' })
      db.libraryFile.insert(libraryFile)
    }
  })
  // stat分析文件
  db.statFile.count({}, (err, res) => {
    if (res === 0) {
      const statFile = []
      // test_stat_1
      axios.get('/static/test_stat_1.json')
        .then((res) => {
          db.stat.insert(res.data)
        })
        .catch((error) => {
          console.log(error);
        });
      statFile.push({ fileName: 'test_stat_1', cUser: 'system', uUser: 'system', cTIme: '', uTime: '' })
      // test_stat_2
      axios.get('/static/test_stat_2.json')
        .then((res) => {
          db.stat.insert(res.data)
        })
        .catch((error) => {
          console.log(error);
        });
      statFile.push({ fileName: 'test_stat_2', cUser: 'system', uUser: 'system', cTIme: '', uTime: '' })
      // test_wt4_2015年1月
      axios.get('/static/test_wt4_2015年1月.json')
        .then((res) => {
          db.stat.insert(res.data)
        })
        .catch((error) => {
          console.log(error);
        });
      statFile.push({ fileName: 'test_wt4_2015年1月', cUser: 'system', uUser: 'system', cTIme: '', uTime: '' })
      // test_wt4_2015年2月
      axios.get('/static/test_wt4_2015年2月.json')
        .then((res) => {
          db.stat.insert(res.data)
        })
        .catch((error) => {
          console.log(error);
        });
      statFile.push({ fileName: 'test_wt4_2015年2月', cUser: 'system', uUser: 'system', cTIme: '', uTime: '' })
      db.statFile.insert(statFile)
    }
  })

  // 用户导入文件
  const orgFile1 = path.format({
    dir: hitbdata,
    base: 'test_org.csv'
  });
  if (!fs.existsSync(orgFile1)) {
    axios.get('/static/test_org.csv')
      .then((res) => {
        fs.writeFile(orgFile1, res.data, (err) => {
          console.log(err)
        })
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const deptFile1 = path.format({
    dir: hitbdata,
    base: 'test_department.csv'
  });
  if (!fs.existsSync(deptFile1)) {
    axios.get('/static/test_department.csv')
      .then((res) => {
        fs.writeFile(deptFile1, res.data, (err) => {
          console.log(err)
        })
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const wt4File1 = path.format({
    dir: hitbdata,
    base: 'test_wt4_2015年1月.csv'
  });
  if (!fs.existsSync(wt4File1)) {
    axios.get('/static/test_wt4_2015年1月.csv')
      .then((res) => {
        fs.writeFile(wt4File1, res.data, (err) => {
          console.log(err)
        })
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const wt4File2 = path.format({
    dir: hitbdata,
    base: 'test_wt4_2015年2月.csv'
  });
  if (!fs.existsSync(wt4File2)) {
    axios.get('/static/test_wt4_2015年2月.csv')
      .then((res) => {
        fs.writeFile(wt4File2, res.data, (err) => {
          console.log(err)
        })
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // 用户本地文件
  db.cda.count({ fileType: 'cda' }, (err, res) => {
    if (res === 0) {
      db.cda.insert({ fileType: 'cda', value: [], fileName: '未保存病案.cda', username: 'system', cTime: '', uTime: '' })
    } else if (res > 0) {
      db.cda.findOne({ fileType: 'cda' }, (err, res) => {
        global.hitbDoc = res.value
      })
    }
  })

  // 本地Section文件
  const sections = path.format({
    dir: hitbdataSystem,
    base: 'hitb_sections.cda'
  });
  if (fs.existsSync(sections)) {
    fs.lstat(sections, (err) => {
      if (!err) {
        const fRead = fs.createReadStream(sections);
        const fReadline = readline.createInterface({ input: fRead });
        const f = [];
        fReadline.on('close', () => {
          global.hitbSections = f
        });
        fReadline.on('line', (line) => {
          f.push(line)
        })
      }
    })
  }
  if (!fs.existsSync(sections)) {
    axios.get('/static/hitb_sections.cda')
      .then((res) => {
        fs.writeFile(sections, res.data, (err) => {
          console.log(err)
        })
      })
      .catch((error) => {
        console.log(error);
      });
  }
  // // 本地病案质控
  // const controls = path.format({
  //   dir: hitbdataUser,
  //   base: '病案质控.cda'
  // });
  // if (fs.existsSync(controls)) {
  //   fs.lstat(controls, (err) => {
  //     if (!err) {
  //       const fRead = fs.createReadStream(controls);
  //       const fReadline = readline.createInterface({ input: fRead });
  //       const f = [];
  //       fReadline.on('close', () => {
  //         global.hitbControls = f
  //       });
  //       fReadline.on('line', (line) => {
  //         f.push(line)
  //       })
  //     }
  //   })
  // }
}
