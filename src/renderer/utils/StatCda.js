import { getEdit } from './EditServerFile';
const axios = require('axios');
export default function statCda(obj, data = ['127.0.0.1', '80']) {
  axios({
    method: 'get',
    url: `http://${data[0]}:${data[1]}/stat/get_rule?`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    responseType: 'json'
  }).then((res) => {
    if (res.status === 200) {
      obj.$store.commit('LIBRARY_SET_COMP_RULE', res.data)
    }
  }).catch((err) => {
    console.log(err);
  })
  // get_rule
  getEdit(obj, ['127.0.0.1', '80'], 'test@test.com.cn-1_20180619131935.cda', 'server', '');
  const file = obj.$store.state.Edit.file[0].split(',');
  const stat = {}
  file.forEach((item) => {
    const [key, val] = item.split(' ');
    if (val) {
      stat[key] = val.split('，');
    }
  });
  // 主诉
  const symptom = stat['主诉'];

  console.log(symptom);

  console.log('----------------------');
}

// 清空对比
export function test(obj) {
  console.log(obj);
  return true
}
