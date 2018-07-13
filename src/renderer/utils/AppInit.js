import axios from 'axios'

export default function appInit() {
  const fs = require('fs')
  const path = require('path');
  const readline = require('readline');

  // 文件保存位置
  let pathHome = ''
  let pathData = ''
  let pathSystem = ''
  let pathLoaded = ''
  let pathCompare = ''
  let pathUser = ''
  let pathLibrary = ''
  let pathStat = ''
  if (process.env.USERPROFILE) {
    pathHome = process.env.USERPROFILE
    pathData = '\\clinet-data'
    pathSystem = '\\system'
    pathLoaded = '\\loaded'
    pathCompare = '\\compare'
    pathUser = '\\user'
    pathLibrary = '\\library'
    pathStat = '\\stat'
  } else {
    pathHome = process.env.HOME
    pathData = '/clinet-data'
    pathSystem = '/system'
    pathLoaded = '/loaded'
    pathCompare = '/compare'
    pathUser = '/user'
    pathLibrary = '/library'
    pathStat = '/stat'
  }

  const hitbdata = path.join(pathHome, pathData);
  if (!fs.existsSync(hitbdata)) { fs.mkdirSync(hitbdata) }
  const hitbdataSystem = path.join(hitbdata, pathSystem);
  if (!fs.existsSync(hitbdataSystem)) { fs.mkdirSync(hitbdataSystem) }
  const hitbdataLoaded = path.join(hitbdata, pathLoaded);
  if (!fs.existsSync(hitbdataLoaded)) { fs.mkdirSync(hitbdataLoaded) }
  const hitbdataCompare = path.join(hitbdata, pathCompare);
  if (!fs.existsSync(hitbdataCompare)) { fs.mkdirSync(hitbdataCompare) }
  const hitbdataUser = path.join(hitbdata, pathUser);
  if (!fs.existsSync(hitbdataUser)) { fs.mkdirSync(hitbdataUser) }
  const hitbdataLibrary = path.join(hitbdata, pathLibrary);
  if (!fs.existsSync(hitbdataLibrary)) { fs.mkdirSync(hitbdataLibrary) }
  const hitbdataStat = path.join(hitbdata, pathStat);
  if (!fs.existsSync(hitbdataStat)) { fs.mkdirSync(hitbdataStat) }

  // 设置应用系统的全局变量-文件存储位置
  global.hitbdata = {};
  global.hitbdata.path = {
    home: hitbdata,
    system: hitbdataSystem,
    loaded: hitbdataLoaded,
    compare: hitbdataCompare,
    user: hitbdataUser,
    library: hitbdataLibrary,
    stat: hitbdataStat
  };

  // 服务器配置文件
  const serverFile = path.format({
    dir: hitbdataSystem,
    base: 'hitb_server.csv'
  });

  if (fs.existsSync(serverFile)) {
    const fRead = fs.createReadStream(serverFile);
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
      global.hitbdata.server = t;
    });

    fReadline.on('line', (line) => {
      f.push(line)
    })
  } else {
    const data = '服务器名称,IP地址,PORT端口,连接设置\n远程测试服务器,www.jiankanglaifu.com,80,'
    global.hitbdata.server = { 远程测试服务器: ['www.jiankanglaifu.com', '80', ''] }
    fs.writeFile(serverFile, data, (err) => {
      console.log(err)
    })
  }

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

  // 读取提示的cdh文件
  function a(value) {
    const fRead = fs.createReadStream(value);
    const fReadline = readline.createInterface({ input: fRead });
    const f = []; // 将CSV文件逐行读到数组中
    const t = {}; // 将数组逐行转换为js对象
    const header = []
    fReadline.on('close', () => {
      // if (value.endsWith('.csv')) {
      f.shift();
      global.hitbdata.cdhFile = f;
      f.forEach((line) => {
        const x = line.split(' ');
        const [a, ...rest] = x;
        header.push(a)
        t[a] = rest;
        global.hitbdata.cdh = t;
      })
      global.hitbdata.cdhHeader = header;
    });
    fReadline.on('line', (line) => {
      f.push(line)
    })
  }
  const cdhFile = path.format({
    dir: hitbdataLibrary,
    base: 'cdh.cdh'
  })
  if (fs.existsSync(cdhFile)) {
    a(cdhFile)
  }

  const editFile = path.format({
    dir: hitbdataSystem,
    base: 'hitb_edit.cdh'
  });
  if (!fs.existsSync(editFile)) {
    axios.get('/static/hitb_edit.cdh')
      .then((res) => {
        fs.writeFile(editFile, res.data, (err) => {
          console.log(err)
        })
      })
      .catch((error) => {
        console.log(error);
      });
  }
  if (fs.existsSync(editFile)) {
    a(editFile)
    // fs.lstat(editFile, (err) => {
    //   if (!err) {
    //     const fRead = fs.createReadStream(editFile);
    //     const fReadline = readline.createInterface({ input: fRead });
    //     const f = [];
    //     fReadline.on('close', () => {
    //       const obj = {}
    //       f.forEach((x) => {
    //         const s = x.split(' ').filter(i => i !== '');
    //         const k = s.shift()
    //         obj[k] = s
    //       })
    //       global.hitbdata.cdh = obj
    //     });
    //     fReadline.on('line', (line) => {
    //       f.push(line)
    //     })
    //   }
    // })
  }

  // 读取模板的cda文件
  const modelFile = path.format({
    dir: hitbdataSystem,
    base: 'hitb_model.cda'
  });
  if (!fs.existsSync(modelFile)) {
    axios.get('/static/hitb_model.cda')
      .then((res) => {
        fs.writeFile(modelFile, res.data, (err) => {
          console.log(err)
        })
      })
      .catch((error) => {
        console.log(error);
      });
  }
  if (fs.existsSync(modelFile)) {
    fs.lstat(modelFile, (err) => {
      if (!err) {
        const fRead = fs.createReadStream(modelFile);
        const fReadline = readline.createInterface({ input: fRead });
        const f = [];
        fReadline.on('close', () => {
          const obj = {}
          f.forEach((x) => {
            const s = x.split(' ').filter(i => i !== '');
            const k = s.shift()
            obj[k] = s
          })
          global.hitbmodel = obj
        });
        fReadline.on('line', (line) => {
          f.push(line)
        })
      }
    })
  }

  // 术语字典文件
  const mdcFile = path.format({
    dir: hitbdataLibrary,
    base: 'test_mdc.csv'
  });
  if (!fs.existsSync(mdcFile)) {
    axios.get('/static/test_mdc.csv')
      .then((res) => {
        fs.writeFile(mdcFile, res.data, (err) => {
          console.log(err)
        })
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const adrgFile = path.format({
    dir: hitbdataLibrary,
    base: 'test_adrg.csv'
  });
  if (!fs.existsSync(adrgFile)) {
    axios.get('/static/test_adrg.csv')
      .then((res) => {
        fs.writeFile(adrgFile, res.data, (err) => {
          console.log(err)
        })
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const drgFile = path.format({
    dir: hitbdataLibrary,
    base: 'test_drg.csv'
  });
  if (!fs.existsSync(drgFile)) {
    axios.get('/static/test_drg.csv')
      .then((res) => {
        fs.writeFile(drgFile, res.data, (err) => {
          console.log(err)
        })
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const icd10File = path.format({
    dir: hitbdataLibrary,
    base: 'test_icd10.csv'
  });
  if (!fs.existsSync(icd10File)) {
    axios.get('/static/test_icd10.csv')
      .then((res) => {
        fs.writeFile(icd10File, res.data, (err) => {
          console.log(err)
        })
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const icd9File = path.format({
    dir: hitbdataLibrary,
    base: 'test_icd9.csv'
  });
  if (!fs.existsSync(icd9File)) {
    axios.get('/static/test_icd9.csv')
      .then((res) => {
        fs.writeFile(icd9File, res.data, (err) => {
          console.log(err)
        })
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const orgFile2 = path.format({
    dir: hitbdataLibrary,
    base: 'test_org.csv'
  });
  if (!fs.existsSync(orgFile2)) {
    axios.get('/static/test_org.csv')
      .then((res) => {
        fs.writeFile(orgFile2, res.data, (err) => {
          console.log(err)
        })
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const deptFile2 = path.format({
    dir: hitbdataLibrary,
    base: 'test_department.csv'
  });
  if (!fs.existsSync(deptFile2)) {
    axios.get('/static/test_department.csv')
      .then((res) => {
        fs.writeFile(deptFile2, res.data, (err) => {
          console.log(err)
        })
      })
      .catch((error) => {
        console.log(error);
      });
  }
  // stat分析文件
  const statFile1 = path.format({
    dir: hitbdataStat,
    base: 'test_stat_1.csv'
  });
  if (!fs.existsSync(statFile1)) {
    axios.get('/static/test_stat_1.csv')
      .then((res) => {
        fs.writeFile(statFile1, res.data, (err) => {
          console.log(err)
        })
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const statFile2 = path.format({
    dir: hitbdataStat,
    base: 'test_stat_2.csv'
  });
  if (!fs.existsSync(statFile2)) {
    axios.get('/static/test_stat_2.csv')
      .then((res) => {
        fs.writeFile(statFile2, res.data, (err) => {
          console.log(err)
        })
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const wt4File3 = path.format({
    dir: hitbdataStat,
    base: 'test_wt4_2015年1月.csv'
  });
  if (!fs.existsSync(wt4File3)) {
    axios.get('/static/test_wt4_2015年1月.csv')
      .then((res) => {
        fs.writeFile(wt4File3, res.data, (err) => {
          console.log(err)
        })
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const wt4File4 = path.format({
    dir: hitbdataStat,
    base: 'test_wt4_2015年2月.csv'
  });
  if (!fs.existsSync(wt4File4)) {
    axios.get('/static/test_wt4_2015年2月.csv')
      .then((res) => {
        fs.writeFile(wt4File4, res.data, (err) => {
          console.log(err)
        })
      })
      .catch((error) => {
        console.log(error);
      });
  }

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
  const cdaFile = path.format({
    dir: hitbdataUser,
    base: '2018年度病案.cda'
  });
  if (!fs.existsSync(cdaFile)) { fs.writeFileSync(cdaFile, '') }
  // 未保存病案
  const notSaveDoc = path.format({
    dir: hitbdataUser,
    base: '未保存病案.cda'
  });
  if (fs.existsSync(notSaveDoc)) {
    fs.lstat(notSaveDoc, (err) => {
      if (!err) {
        const fRead = fs.createReadStream(notSaveDoc);
        const fReadline = readline.createInterface({ input: fRead });
        const f = [];
        fReadline.on('close', () => {
          global.hitbDoc = f
        });
        fReadline.on('line', (line) => {
          f.push(line)
        })
      }
    })
  }
}
