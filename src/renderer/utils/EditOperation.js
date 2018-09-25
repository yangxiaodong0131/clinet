// import saveFile from './SaveFile'
import { editDocShow, getCaseHistory, getExpertHint, clinetHelp, getDocContent } from './EditServerFile'
import { message } from './Socket'
import { sCompDrg } from './Server'
// import { saveLibrary } from './LibraryServerFile'
import dataDB from './dataDB'
// import { getStat } from './StatServerFile'

// 获取当前日期
export function getDate() {
  const date = new Date();
  let month = date.getMonth() + 1;
  let strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = `0${month}`;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = `0${strDate}`
  }
  const currentdate = `${date.getFullYear()}-${month}-${strDate} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
  return currentdate
}

// 保存文件
export function saveEditDoc(obj, data) {
  const currentdate = getDate()
  obj.$store.commit('EDIT_UPDATE_DOC_HEADER', ['保存时间', currentdate]);
  obj.$store.commit('EDIT_SET_DOC_STATE');
  let fileName = obj.$store.state.Edit.fileName
  let doc = obj.$store.state.Edit.doc
  const docType = obj.$store.state.Edit.docType
  const dataType = obj.$store.state.Edit.dataType
  const modelName = obj.$store.state.Edit.modelName
  const models = obj.$store.state.Edit.editModels
  const modelArr = models[0].value
  doc = doc.filter(x => x !== '')
  if (!fileName) {
    fileName = getDate().replace(/[ :-]/g, '')
    fileName = `${docType}${fileName}`
  }
  if (data === '保存模板') {
    if (!obj.$store.state.Edit.modelName) {
      const name = getDate().replace(/[ :-]/g, '')
      obj.$store.commit('EDIT_SET_MODEL_NAME', `模板-${name}`)
    }
    modelArr[modelName] = doc
    if (fileName.includes('@')) {
      dataDB(obj, 'server', 'cda', { fileType: 'model', value: models }, 'saveCda', { fileName, content: doc, username: obj.$store.state.System.user.username, mouldtype: '模板' })
    } else {
      dataDB(obj, 'local', 'cda', { fileType: 'model', }, 'saveCda', { value: models[0].value })
    }
  } else if (fileName.includes('@')) {
    dataDB(obj, 'server', 'cda', { fileType: 'cda', fileName, value: doc, docType }, 'saveCda', { fileName, content: doc, username: obj.$store.state.System.user.username, docType: obj.$store.state.Edit.docType, mouldtype: '病案' })
  } else if (dataType === '模板') {
    modelArr[modelName] = doc
    dataDB(obj, 'local', 'cda', { fileType: 'model' }, 'saveCda', { value: models[0].value })
  } else {
    dataDB(obj, 'local', 'cda', { fileType: 'cda', fileName }, 'saveCda', { value: doc, docType })
  }
}

// 新建文件
export function newEditDoc(obj, n) {
  obj.$store.commit('EDIT_SET_DOC_INDEX', [0, true])
  if (n) {
    obj.$store.commit('EDIT_SET_DOC_TYPE', n)
  } else {
    n = obj.$store.state.Edit.docType
  }
  obj.$store.commit('SET_NOTICE', n);
  obj.$store.commit('EDIT_SET_HINT_TYPE', 'notice');
  if (obj.$store.state.Edit.rightPanel === 'server') {
    getDocContent(obj, [obj.$store.state.System.server, obj.$store.state.System.port], obj.$store.state.System.user.username, n)
  } else if (global.hitbmodel[n] !== undefined) {
    obj.$store.commit('EDIT_LOAD_DOC', global.hitbmodel[n])
    const filename = getDate().replace(/[ :-]/g, '')
    const docType = obj.$store.state.Edit.docType
    let userName = obj.$store.state.System.user.username
    if (!userName) {
      userName = '未定义用户'
    }
    obj.$store.commit('EDIT_LOAD_DOC', global.hitbmodel[n])
    const a = `${docType}-${filename}`
    // const editingFile = obj.$store.state.Edit.editingFile
    const obj1 = {}
    obj1[a] = global.hitbmodel[n]
    obj1.type = '新建'
    obj1.createTime = getDate()
    obj.$store.commit('EDIT_SET_EDITING_FILE', obj1)
    dataDB(obj, 'local', 'cda', { fileType: 'cda', fileName: `${docType}-${filename}`, value: global.hitbmodel[n], docType, userName, id: '未定义客户' }, 'createCda', null)
  } else { obj.$store.commit('EDIT_SET_DOC'); }
  // obj.$store.commit('SET_NOTICE', '请先打开一个文件，然后选择编辑一个文档，或者新建一个文档！')
  // obj.$store.commit('EDIT_SET_HINT_TYPE', 'notice');
  const navType = obj.$store.state.Edit.navType
  const dataType = obj.$store.state.Edit.dataType
  const files = obj.$store.state.Edit.files
  const filesIndex = obj.$store.state.Edit.filesIndex
  const data = files[filesIndex][0]
  switch (dataType) {
    case '用户':
      if (navType === '本地') {
        dataDB(obj, 'local', 'cda', { fileType: 'cda' }, 'editUsers', null, null)
        dataDB(obj, 'local', 'cda', { userName: data }, 'editFiles', null)
      } else if (navType === '远程') {
        console.log('远程')
      } else {
        console.log('区块链')
      }
      break;
    case '客户':
      if (navType === '本地') {
        dataDB(obj, 'local', 'cda', { fileType: 'cda' }, 'editPatients', null, null)
        dataDB(obj, 'local', 'cda', { id: data }, 'editFiles', null)
      } else if (navType === '远程') {
        console.log('远程')
      } else {
        console.log('区块链')
      }
      break;
    case '文档':
      if (navType === '本地') {
        dataDB(obj, 'local', 'cda', { fileType: 'cda' }, 'editTypes', null, null)
        dataDB(obj, 'local', 'cda', { docType: data }, 'editFiles', null)
      } else if (navType === '远程') {
        console.log('远程')
      } else {
        console.log('区块链')
      }
      break;
    case '模板':
      if (navType === '本地') {
        dataDB(obj, 'local', 'cda', { fileType: 'model' }, 'editModels', null, null)
        dataDB(obj, 'local', 'cda', { modelType: data }, 'editFiles', null)
      } else if (navType === '远程') {
        console.log('远程')
      } else {
        console.log('区块链')
      }
      break;
    default:
      break;
  }
}

export function editBarEnter(obj, targetValue) {
  if (obj.$store.state.Edit.editType === '病案编辑') {
    if (obj.$store.state.Edit.section === '个人信息' && targetValue.includes('姓名')) {
      obj.$store.commit('EDIT_SET_RIGHT_PANELS', '病案历史');
      if (obj.$store.state.Edit.rightPanel === 'server') {
        // 病案历史
        getCaseHistory(obj, [obj.$store.state.System.server, obj.$store.state.System.port], obj.$store.state.Edit.doc, obj.$store.state.System.user.username)
        editDocShow(obj, [obj.$store.state.System.server, obj.$store.state.System.port], targetValue)
      } else {
        dataDB(obj, 'local', 'cda', { fileType: 'cda' }, 'editCaseHistory', { barValue: targetValue.split(' ') })
      }
    }
    if (targetValue.includes('~')) {
      obj.$store.commit('EDIT_SET_MODEL_NAME', targetValue.replace('~', ''));
      obj.$store.commit('EDIT_SET_BAR_VALUE', '');
    } else {
      const value = targetValue
      let n = obj.$store.state.Edit.docIndex
      // const value = targetValue
      if (obj.$store.state.Edit.selectedType !== 'col') {
        const vs = value.split(',').filter(i => i !== '');
        if (vs.length > 0) {
          vs.forEach((element, index) => {
            const v = element.split(' ').filter(i => i !== '');
            if (index > 0) {
              obj.$store.commit('EDIT_UPDATE_DOC', [n, v, true]);
            } else {
              obj.$store.commit('EDIT_UPDATE_DOC', [n, v]);
            }
            obj.$store.commit('EDIT_SET_DOC_INDEX', [1]);
            n += 1
            // if (!global.hitbdata.cdhHeader.includes(v[0]) && obj.$store.state.Edit.rightPanels.includes('病案质控')) {
            //   obj.$store.commit('EDIT_ADD_DOC_CONTROL', v);
            // }
            if (obj.$store.state.Edit.rightPanel === 'server') {
              getExpertHint(obj, [obj.$store.state.System.server, obj.$store.state.System.port], v, obj.$store.state.Edit.section)
            }
          });
        } else {
          obj.$store.commit('EDIT_DELETE_ITEM', n);
        }
        if (obj.$store.state.Edit.helpType === '在线交流') {
          message(obj, targetValue, obj.$store.state.System.user.username, 'doc')
        }
      } else {
        // value = value.replace(/,/g, '，')
        const cv = value.split(' ').filter(i => i !== '');
        const col = obj.$store.state.Edit.selectedCol[0]
        obj.$store.commit('EDIT_UPDATE_FILE', [col, cv[1]]);
      }
      obj.$store.commit('EDIT_SET_HINT_TYPE', 'notice');
      obj.$store.commit('SET_NOTICE', '编辑 -> 缓存 -> 选择文件 -> 保存');
    }
  } else {
    message(obj, targetValue, obj.$store.state.System.user.username, 'message')
    obj.$store.commit('EDIT_SET_BAR_VALUE', '');
  }
  const currentdate = getDate()
  obj.$store.commit('EDIT_UPDATE_DOC_HEADER', ['修改时间', currentdate]);
  obj.$store.commit('EDIT_SET_DOC_STATE');
}

export function rightBarHelp(obj, n) {
  if (n) {
    // obj.$store.commit('EDIT_SET_RIGHT_PANELS', n);
    obj.$store.commit('SET_NOTICE', n);
    obj.$store.commit('EDIT_DELETE_RIGHT_FOLDS', n);
    // obj.$store.commit('EDIT_SET_HELP_TYPE', n);
    if (obj.$store.state.Edit.rightPanel === 'server') {
      clinetHelp(obj, [obj.$store.state.System.server, obj.$store.state.System.port], obj.$store.state.System.user.username)
    } else {
      console.log('本地的cdh帮助查询')
    }
    if (n === 'DRG分析') {
      obj.$store.commit('EDIT_SET_RIGHT_PANELS', n);
      obj.$store.commit('EDIT_SET_HELP_TYPE', n);
      if (obj.$store.state.System.wt4Tables.length > 1) {
        sCompDrg(obj, [obj.$store.state.System.server, obj.$store.state.System.port], obj.$store.state.System.wt4Tables, 'BJ', 'getLocalData')
      } else {
        obj.$store.commit('SET_NOTICE', '请选择分析数据！');
      }
    } else if (n === '编辑器使用帮助' || n === '在线交流') {
      obj.$store.commit('EDIT_SET_RIGHT_PANELS', n);
      obj.$store.commit('EDIT_SET_HELP_TYPE', n);
      obj.$store.commit('SET_NOTICE', n);
      obj.helpType = n
    } else if (n === '输入框提示') {
      obj.$store.commit('EDIT_SET_RIGHT_PANELS', n);
      obj.$store.commit('EDIT_SET_HELP_TYPE', n);
      obj.$store.commit('EDIT_GET_CDH_FILE', 0);
      if (obj.$store.state.Edit.rightPanel === 'server') {
        if (!obj.$store.state.Edit.rightCdh) {
          obj.$store.commit('SET_NOTICE', '输入提示无内容！');
          obj.$store.commit('EDIT_SET_HINT_TYPE', 'notice');
        } else if (!global.hitbdata.cdh) {
          obj.$store.commit('SET_NOTICE', '输入提示无内容！');
          obj.$store.commit('EDIT_SET_HINT_TYPE', 'notice');
        }
      }
    } else if (n === '病案历史' && obj.$store.state.Edit.rightPanel === 'server') {
      obj.$store.commit('EDIT_SET_RIGHT_PANELS', n);
      obj.$store.commit('EDIT_SET_HELP_TYPE', n);
      getCaseHistory(obj, [obj.$store.state.System.server, obj.$store.state.System.port], obj.$store.state.Edit.doc, obj.$store.state.System.user.username)
    } else if (n === '病案历史' && obj.$store.state.Edit.rightPanel !== 'server') {
      obj.$store.commit('SET_NOTICE', '登录后可查询病案历史！');
      obj.$store.commit('EDIT_SET_HINT_TYPE', 'notice');
    } else if (n === '病案质控' && obj.$store.state.Edit.rightPanel === 'server') {
      obj.$store.commit('EDIT_SET_RIGHT_PANELS', n);
      obj.$store.commit('EDIT_SET_HELP_TYPE', n);
      if (global.hitbControls.length > 0) {
        const controls = global.hitbControls[0].split(',')
        obj.$store.commit('EDIT_SET_DOC_CONTROL', controls);
      } else {
        obj.$store.commit('SET_NOTICE', '病案质控暂无内容！');
        obj.$store.commit('EDIT_SET_HINT_TYPE', 'notice');
      }
    } else {
      obj.$store.commit('EDIT_SET_RIGHT_PANELS', n);
      obj.$store.commit('EDIT_SET_HELP_TYPE', n);
    }
  }
}

// 翻页
export function editPage(obj, n) {
  const page = obj.$store.state.Edit.filesPage
  const offset = obj.$store.state.Edit.filesOffset
  const files = obj.$store.state.Edit.files
  const filesNum = obj.$store.state.Edit.filesNum
  if (page === 1 && n < 0) {
    obj.$store.commit('SET_NOTICE', '当前已经是第一页')
  } else if (page === filesNum && n > 0) {
    obj.$store.commit('SET_NOTICE', '当前已经最后一页')
  } else {
    obj.$store.commit('EDIT_SET_FILES_PAGE', n);
    if (n > 0) {
      obj.$store.commit('EDIT_SET_CURRENT_SERVER_FILES', files.slice(offset, offset + 20));
      obj.$store.commit('EDIT_SET_FILES_OFFSET', offset + 20);
    } else {
      obj.$store.commit('EDIT_SET_CURRENT_SERVER_FILES', files.slice(offset - 20, offset));
      obj.$store.commit('EDIT_SET_FILES_OFFSET', offset - 20);
    }
  }
}

export function getLocalFiles(obj, x) {
  const navType = obj.$store.state.Edit.navType
  if (navType !== '本地') {
    obj.$store.commit('EDIT_SET_RIGHT_TYPE', null);
  }
  obj.$store.commit('EDIT_SET_NAV_TYPE', '本地');
  obj.$store.commit('EDIT_SET_RIGHT_PANELS', '本地文件');
  obj.$store.commit('EDIT_SET_DOC_TYPES', ['自定义文档', '病案首页（卫统四CSV）', '入院申请', '首次病程', '病程记录', '病案首页', '门诊病案', '健康体检']);
  obj.$store.commit('EDIT_SET_HELP_TYPES', ['输入框提示', '病案参考', '病案历史', '在线交流', '病案质控', '专家提示', 'DRG分析', 'HIS接口'])
  obj.$store.commit('EDIT_SET_CHAT_TYPE', false);
  obj.$store.commit('EDIT_SET_RIGHT_PANEL', 'local');
  obj.$store.commit('SET_NOTICE', '读取本地文件');
  obj.$store.commit('EDIT_SET_HINT_TYPE', 'notice');
  const editingFile = obj.$store.state.Edit.editingFile
  const obj1 = {}
  const type = []
  editingFile.forEach((x) => {
    if (obj1[x.type]) {
      obj1[x.type] += 1
    } else {
      obj1[x.type] = 1
    }
  })
  const keys = Object.keys(obj1)
  keys.forEach((x) => {
    type.push([x, obj1[x]])
  })
  switch (x) {
    case '用户':
      dataDB(obj, 'local', 'cda', { fileType: 'cda' }, 'editUsers', null, null)
      break;
    case '客户':
      dataDB(obj, 'local', 'cda', { fileType: 'cda' }, 'editPatients', null, null)
      break;
    case '文档':
      dataDB(obj, 'local', 'cda', { fileType: 'cda' }, 'editTypes', null, null)
      break;
    case '模板':
      dataDB(obj, 'local', 'cda', { fileType: 'model' }, 'editModels', null, null)
      break;
    case '新建':
      obj.$store.commit('EDIT_LOAD_FILES', type)
      break;
    default:
      break;
  }
}
