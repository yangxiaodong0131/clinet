export default function pageSearch(obj, data, keyword) {
  data = data.filter(n => n.includes(keyword))
  obj.$store.commit('LIBRARY_SET_TABLE_TYPE', 'search')
  obj.$store.commit('LIBRARY_SET_SEARCH_TABLE', data)
}
