// const fs = require('fs');

const state = {
  files: [],
  file: [],
  table: [],
  tableSel: [],
  localTables: [],
  leftPanel: 'file',
  dimension: [],
  dimensionType: null,
  dimensionOrg: [],
  dimensionTime: [],
  dimensionVersion: [],
  field: '',
  fieldIndex: [],
  fileIndex: null,
  tableType: 'local',
  dimensionSearch: { time: 0, version: 0, org: 0 },
  rowHeight: null,
  dimensionServer: '',
  fileTypes: ['本地', '远程', '区块链'],
  dropdownTypes: ['年份', '版本', '全部'],
  libraryList: { org: [], time: [], version: [] },
  serverDimension: { org: '', time: '', version: '' },
  libraryTable: { data: [], download: [], search: [] },
  serverSort: { field: '编码', type: 'asc' },
  libraryTableInfo: { page: 1, countPage: 0, pageList: [], tableName: '', header: [], title: [] },
  compRule: {},
  changeVal: '',
  change: {},
  changIndex: [],
  isServer: false
};

const mutations = {
  LIBRARY_LOAD_FILES(state, files) {
    state.files = files
  },
  LIBRARY_LOAD_FILE(state, message) {
    const table = []
    const keys = Object.keys(message[0]).filter(i => !['id', 'fileType', 'ID'].includes(i))
    // 存储表头
    table.push(keys)
    // 取得表内容,取不到的用-代替
    message.forEach((xs) => {
      const f = keys.map(x => xs[x])
      table.push(f)
    })
    state.libraryTableInfo.header = keys
    state.libraryTable.data = table
  },
  LIBRARY_SERVER_FILES(state, opt) {
    state.files = opt.data;
  },
  LIBRARY_TABLE_PAGE(state, m) {
    if (m[1]) {
      state.libraryTableInfo.page = 1;
    } else {
      state.libraryTableInfo.page += m[0];
    }
  },
  LIBRARY_SET_TABLE_INFO(state, opt) {
    state.libraryTableInfo = opt
  },
  LIBRARY_SET_TABLE_NAME(state, opt) {
    state.libraryTableInfo.tableName = opt
  },
  LIBRARY_SET_LIBRARY_LIST(state, data) {
    state.libraryList = data
  },
  LIBRARY_SET_SERVER_DIMENSION(state, opt) {
    if (opt[0] === '全部' || opt[0] === null) {
      opt[0] = ''
    }
    switch (opt[1]) {
      case 'org':
        state.serverDimension.org = opt[0]
        break;
      case 'time':
        state.serverDimension.year = opt[0]
        break;
      case 'version':
        state.serverDimension.version = opt[0]
        break;
      default:
        break;
    }
  },
  LIBRARY_SET_TABLE_PAGE(state, page) {
    state.libraryTableInfo.page = page;
  },
  LIBRARY_SET_LEFT_PANEL(state, opt) {
    if (state.tableType === 'local') {
      state.leftPanel = opt[0];
      state.dimensionType = opt[1];
      switch (opt[1]) {
        case 'org':
          state.dimension = state.dimensionOrg
          break;
        case 'year':
          state.dimension = state.dimensionTime
          break;
        case 'version':
          state.dimension = state.dimensionVersion
          break;
        default:
          break;
      }
    } else {
      state.leftPanel = opt[0];
      state.dimensionType = opt[1];
      state.dimension = opt[2];
    }
  },
  LIBRARY_SET_DIMENSION(state, opt) {
    switch (opt[0]) {
      case 'org':
        state.tableSel = state.table.filter(x => x[0] === opt[1])
        break;
      case 'year':
        state.tableSel = state.table.filter(x => x[state.dimensionSearch.time] === opt[1])
        break;
      case 'version':
        state.tableSel = state.table.filter(x => x[state.dimensionSearch.version] === opt[1])
        break;
      default:
        state.dimensionOrg = []
        state.dimensionTime = []
        state.dimensionVersion = []
        break;
    }
    state.notice = [
      `术语总数：${state.tableSel.length - 1}`
    ]
    const page = Math.ceil(state.tableSel.length / 35)
    state.countPage = page
    for (let i = 1; i <= page; i += 1) {
      const f = []
      f.push(state.ibraryTableInfo.header[0])
      for (let j = 1; j <= 35; j += 1) {
        f.push(state.tableSel[(i) * j])
      }
      state.localTables[i] = f
    }
    state.tablePage = 1
    state.libraryTable.data = state.localTables[state.tablePage].slice(1)
  },
  LIBRARY_GET_FIELD(state, field) {
    state.field = field;
  },
  LIBRARY_SET_SERVER_SORT(state, opt) {
    state.serverSort.field = opt[0]
    state.serverSort.type = opt[1]
  },
  LIBRARY_CLEAR_SERVER_SORT(state) {
    state.serverSort = { field: '编码', type: 'asc' }
  },
  LIBRARY_GET_FIELD_INDEX(state, index) {
    if (state.fieldIndex.includes(index)) {
      state.fieldIndex.splice(state.fieldIndex.findIndex(v => v === index), 1)
    } else {
      state.fieldIndex = [...state.fieldIndex, index]
    }
  },
  LIBRARY_SET_FILE_INDEX(state, index) {
    state.fileIndex = index;
  },
  LIBRARY_SET_TABLE_TYPE(state, index) {
    if (index === 'local') {
      state.isServer = true
    } else {
      state.isServer = false
    }
    state.tableType = index;
  },
  LIBRARY_SET_SERVER_TABLE(state, opt) {
    state.libraryTable.data = opt
  },
  LIBRARY_SET_SEARCH_TABLE(state, opt) {
    if (state.serverType === 'local') {
      const table = []
      const keys = Object.keys(opt[0]).filter(i => !['_id', 'id', 'fileType'].includes(i))
      // 存储表头
      table.push(keys)
      // 取得表内容,取不到的用-代替
      opt.forEach((xs) => {
        const f = keys.map(x => xs[x])
        table.push(f)
      })
      state.libraryTable.search = table
    } else {
      state.libraryTable.search = opt
    }
  },
  LIBRARY_GET_SEARCH_TABLE(state, data) {
    state.localTables = {}
    const a = state.tableSel.filter(n => n.includes(data));
    const page = Math.ceil(a.length / 35)
    state.countPage = page
    for (let i = 1; i < page; i += 1) {
      const f = []
      f.push(state.ibraryTableInfo.header[0])
      for (let j = 1; j <= 35; j += 1) {
        f.push(a[(i) * j])
      }
      state.localTables[i] = f
    }
    state.libraryTable.data = state.localTables[state.tablePage].slice(1)
  },
  LIBRARY_GET_ROW(state, data) {
    state.rowHeight = data
  },
  LIBRARY_SET_COUNT_PAGE(state, n) {
    state.libraryTableInfo.countPage = n
  },
  LIBRARY_SET_FILE_TYPES(state, value) {
    state.fileTypes = value
  },
  LIBRARY_SET_DROPDOWN_TYPES(state, value) {
    state.dropdownTypes = value
  },
  LIBRARY_GET_DOWN_FILE(state, value) {
    state.libraryTable.download = value
  },
  LIBRARY_SET_SERVER_DIMENSIONS(state, value) {
    state.dimensions = value
  },
  LIBRARY_SET_COMP_RULE(state, value) {
    state.compRule = value
  },
  LIBRARY_SET_CHANGE_VAL(state, val) {
    state.changeVal = val
  },
  LIBRARY_SET_CHANGE(state, val) {
    state.change = val
  },
  LIBRARY_SET_CHANGE_INDEX(state, val) {
    state.changIndex = val
  },
  LIBRARY_CLEAR_CHANGE(state) {
    state.changIndex = []
    state.change = {}
    state.changeVal = ''
  },
};

const actions = {
  someAsyncTask({ commit }) {
    commit('LIBRARY_CLEAR_CHANGE');
    commit('LIBRARY_SET_TABLE_NAME');
    commit('LIBRARY_SET_CHANGE_INDEX');
    commit('LIBRARY_SET_CHANGE');
    commit('LIBRARY_SET_CHANGE_VAL');
    commit('LIBRARY_SET_SEARCH_TABLE');
    commit('LIBRARY_LOAD_FILES');
    commit('LIBRARY_LOAD_FILE');
    commit('LIBRARY_SERVER_FILES');
    commit('LIBRARY_TABLE_PAGE');
    commit('LIBRARY_SET_LEFT_PANEL');
    commit('LIBRARY_SET_DIMENSION');
    commit('LIBRARY_GET_FIELD');
    commit('LIBRARY_GET_FIELD_INDEX');
    commit('LIBRARY_SET_FILE_INDEX');
    commit('LIBRARY_SET_TABLE_TYPE');
    commit('LIBRARY_GET_SEARCH_TABLE');
    commit('LIBRARY_GET_ROW');
    commit('LIBRARY_SET_TABLE_PAGE');
    commit('LIBRARY_SET_SERVER_DIMENSION');
    commit('LIBRARY_SET_COUNT_PAGE');
    commit('LIBRARY_SET_SERVER_TABLE_TITLE');
    commit('LIBRARY_SET_FILE_TYPES');
    commit('LIBRARY_SET_DROPDOWN_TYPES');
    commit('LIBRARY_GET_DOWN_FILE');
    commit('LIBRARY_SET_SERVER_DIMENSIONS');
    commit('LIBRARY_SET_LIBRARY_LIST');
    commit('STAT_CLEAR_SERVER_DIMENSION');
    commit('LIBRARY_SET_TABLE_INFO');
    commit('LIBRARY_CLEAR_SERVER_SORT');
    commit('LIBRARY_SET_COMP_RULE');
  },
};

export default {
  state,
  mutations,
  actions,
};
