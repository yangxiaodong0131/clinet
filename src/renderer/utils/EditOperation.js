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
  doc = doc.filter(x => x !== '')
  if (!fileName) {
    fileName = getDate().replace(/[ :-]/g, '')
    fileName = `${docType}${fileName}`
  }
  if (data === '保存模板') {
    if (!obj.$store.state.Edit.modelName) {
      const modelName = getDate().replace(/[ :-]/g, '')
      obj.$store.commit('EDIT_SET_MODEL_NAME', modelName)
    } else if (fileName.includes('@')) {
      dataDB(obj, 'server', 'cda', { fileType: 'modal', fileName, value: doc, docType }, 'saveCda', null)
    } else {
      dataDB(obj, 'local', 'cda', { fileType: 'modal', fileName, value: doc, docType }, 'saveCda', null)
    }
  } else if (fileName.includes('@')) {
    dataDB(obj, 'server', 'cda', { fileType: 'cda', fileName, value: doc, docType }, 'saveCda', { fileName, content: doc, username: obj.$store.state.System.user.username, docType: obj.$store.state.Edit.docType, mouldtype: '病案' })
  } else {
    dataDB(obj, 'local', 'cda', { fileType: 'cda', fileName }, 'saveCda', { value: doc, docType })
  }
}

// 新建文件
export function newEditDoc(obj, n) {
  if (obj.$store.state.Edit.lastNav === '/edit') {
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
      // const date = getDate.
      const filename = getDate().replace(/[ :-]/g, '')
      const docType = obj.$store.state.Edit.docType
      console.log(obj.$store.state.Edit.docType)
      obj.$store.commit('EDIT_LOAD_DOC', global.hitbmodel[n])
      dataDB(obj, 'local', 'cda', { fileType: 'cda', fileName: `${docType}-${filename}`, value: global.hitbmodel[n], docType }, 'createCda', null)
    } else { obj.$store.commit('EDIT_SET_DOC'); }
  } else {
    obj.$store.commit('SET_NOTICE', '请先打开一个文件，然后选择编辑一个文档，或者新建一个文档！')
    obj.$store.commit('EDIT_SET_HINT_TYPE', 'notice');
  }
}

export function editBarEnter(obj, targetValue) {
  if (obj.$store.state.Edit.editType === '病案编辑') {
    if (obj.$store.state.Edit.section === '个人信息' && targetValue.includes('姓名')) {
      obj.$store.commit('EDIT_SET_RIGHT_PANELS', '病案历史');
    }
    if (obj.$store.state.Edit.rightPanel === 'server') {
      getCaseHistory(obj, [obj.$store.state.System.server, obj.$store.state.System.port], obj.$store.state.Edit.doc, obj.$store.state.System.user.username)
      editDocShow(obj, [obj.$store.state.System.server, obj.$store.state.System.port], targetValue)
    }
    if (targetValue.includes('~')) {
      obj.$store.commit('EDIT_SET_MODEL_NAME', targetValue.replace('~', ''));
      obj.$store.commit('EDIT_SET_BAR_VALUE', '');
    } else {
      let value = targetValue
      let n = obj.$store.state.Edit.docIndex
      if (obj.$store.state.Edit.lastNav === '/library' && obj.$store.state.Edit.idIndex === n) {
        if (obj.$store.state.Edit.file[obj.$store.state.Edit.file.length - 1] === '') {
          value = '-'
        } else {
          obj.$store.commit('SET_NOTICE', '禁止编辑当前项！');
        }
      }
      // const value = targetValue
      if (obj.$store.state.Edit.lastNav === '/library' && obj.$store.state.Edit.idIndex === n && obj.$store.state.Edit.file[obj.$store.state.Edit.file.length - 1] !== '') {
        obj.$store.commit('SET_NOTICE', '禁止编辑当前项！');
      } else {
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
              if (obj.$store.state.Edit.lastNav === '/edit' && obj.$store.state.Edit.rightPanel === 'server') {
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
