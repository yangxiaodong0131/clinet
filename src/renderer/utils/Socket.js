// const { Socket } = require('phoenix-channels')
import { Socket } from 'phoenix'
let socket = null
let channel = null
let channel2 = null
let createRoomTime = ''
let username = ''
let roomOwner = ''
export function socketConnect(obj, data, user) {
  socket = new Socket(`ws://${data[0]}:8000/socket`, { params: { token: 'a token', username: user.username } });
  socket.connect();
  channel2 = socket.channel('online:list', { username: user.username, password: user.password })
  channel2.join()
    .receive('ok', () => {
      username = user.username
      obj.$store.commit('SET_NOTICE', '远程服务用户登录成功')
      obj.$store.commit('EDIT_SET_RIGHT_PANEL', 'server')
    })
    .receive('error', (err) => {
      obj.$store.commit('SET_NOTICE', err.reason)
    })
  socket.onError(() => {
    obj.$store.commit('SET_NOTICE', '网络故障,您已离线,当网络恢复后您将自动登陆')
  })
  channel2.push('用户信息', {})
  channel2.on('用户信息', (res) => {
    if (obj.$store.state.System.user.login === false) {
      obj.$store.commit('SYSTEM_SET_USER', ['用户登录成功', res.user])
      obj.$store.commit('SYSTEM_SET_SERVER', ['', data[0], data[1]])
      obj.$store.commit('SYSTEM_SET_CONNECT_INFO', true)
    }
  })
  channel2.on('ping', (r) => {
    obj.$store.commit('EDIT_SET_CHAT_USERS', r.users);
  })
  channel2.on('邀请加入', (r) => {
    if (r.invite === username) {
      obj.$store.commit('EDIT_SET_CHAT_TYPE', true);
      obj.$store.commit('SET_NOTICE', `${r.message}`)
      obj.$store.commit('EDIT_SET_HINT_TYPE', 'notice');
      obj.$store.commit('EDIT_SET_SOCKET_RECORD', { message: r.message, type: 'info', time: r.time, room: r.room, create_room_time: r.create_room_time });
      createRoomTime = r.create_room_time;
      roomOwner = r.room_owner;
    }
  })
}

export function join(obj, filename, username) {
  if (roomOwner === '') {
    roomOwner = username
  }
  channel = socket.channel(`room:${roomOwner}`, { username: username, create_room_time: createRoomTime })
  channel.join()
    .receive('ok', () => {
      obj.$store.commit('SET_NOTICE', `加入-${username}-房间成功`)
      channel.push('加入房间', { body: username, username: username, create_room_time: createRoomTime })
      obj.$store.commit('EDIT_SET_CHAT_TYPE', true);
    })
    .receive('error', () => {
      obj.$store.commit('SET_NOTICE', `加入-${username}-房间失败`)
    })
  channel.on('新消息', (r) => {
    obj.$store.commit('EDIT_SET_SOCKET_RECORD', { message: r.body, type: r.type, username: r.username, time: r.time, create_room_time: createRoomTime });
  })
  channel.on('共享文档', (r) => {
    obj.$store.commit('EDIT_SET_SOCKET_RECORD', { message: r.body, type: r.type, username: r.username, time: r.time, create_room_time: createRoomTime });
  })
  channel.on('加入房间', (r) => {
    obj.$store.commit('EDIT_SET_SOCKET_RECORD', { message: r.body, type: 'info', username: r.username, time: r.time, create_room_time: r.create_room_time });
    createRoomTime = r.create_room_time
  })
  channel.on('离开房间', (r) => {
    obj.$store.commit('EDIT_SET_SOCKET_RECORD', { message: r.body, type: 'info', username: r.username, time: r.time, create_room_time: createRoomTime });
  })
  channel.on('ping', (r) => {
    obj.$store.commit('EDIT_SET_CHAT_USERS', r.users);
  })
}

export function invite(obj, filename, username = '') {
  channel2.push('邀请加入', { body: '', room: obj.$store.state.System.user.username, username: username, create_room_time: createRoomTime, invite: username, room_owner: obj.$store.state.System.user.username })
  obj.$store.commit('SET_NOTICE', '邀请成功')
  obj.$store.commit('EDIT_SET_HINT_TYPE', 'notice');
}

export function message(obj, message, username = '', type = 'message') {
  channel.push('新消息', { body: message, username: username, type: type, create_room_time: createRoomTime })
  obj.$store.commit('SET_NOTICE', '消息发送成功')
  obj.$store.commit('EDIT_SET_HINT_TYPE', 'notice');
}

export function leave(obj, username = '') {
  channel.push('离开房间', { body: '离开房间', username: username, create_room_time: createRoomTime });
  // 当离开聊天房间后,立即加入公共房间
  channel.on('已离开房间', () => {
    channel2 = socket.channel('online:lobby', { username: username })
    channel2.join()
      .receive('ok', () => {
        obj.$store.commit('SET_NOTICE', '已离开房间')
      })
  })
}

export function offline(obj, username = '') {
  channel2.push('用户下线', { username: username })
  obj.$store.commit('SYSTEM_SET_USER', ['更新用户信息成功', { username: '', org: '', type: 2, login: false }]);
}
