import utils from '../utils';

describe('Library_1', function () {
  beforeEach(utils.beforeEach);
  afterEach(utils.afterEach);

  it('Library_1', function () {
    this.timeout(100000);
    // 1.1、点击login页面的login-button
    return this.app.client.click('#login')
    // 1.2、等待底部通知框出现'未注册用户登陆！'提示，进入Home页
      .waitUntilTextExists('#notice-bar', '系统通知：未注册用户可以直接登陆！使用单机版功能！用户注册可以选择远程服务或者区块链服务！')
    // 2.1、用户登录
      .click('#navbar-system')
      .click('#navbar-system-server')
      .click('#server-user-setup')
    // .waitUntilTextExists('#notice-bar', '用户设置')
      .setValue('#server-username', 'test5@hitb.com.cn')
      .setValue('#server-password', '123456')
      .click('#server-login')
      .pause(1000)
    // 2.2、点击术语字典
      .click('#navbar-library')
      .click('.library-leftlist')
      .pause(1000)
      // .waitUntilTextExists('#notice-bar', '系统通知：CSV文件读取成功!')
      .getText('.library-rightpanel')
      .then(function (rightpanel) {
        expect(rightpanel).to.be.an('array');
      })
      .click('#library-up')
      .click('.library-leftlist')
      .getText('.library-rightpanel')
      .then(function (rightpanel) {
        expect(rightpanel).to.be.an('array');
      })
      .click('#library-down')
      .getText('.library-rightpanel')
      .then(function (rightpanel) {
        expect(rightpanel).to.be.an('array');
      })
      .click('#library-edit')
      .getText('#edit-editbar-input')
      .then(function (editText) {
        expect(editText).to.equal('')
      })
      .click('#edit-leftbar-back')
      .pause(1000)
      .click('#library-dropdown1')
      .click('#library-dropdown-年份')
      .getText('.library-rightpanel')
      .then(function (rightpanel) {
        expect(rightpanel).to.be.an('array');
      })
      .click('#library-dropdown1')
      .click('#library-dropdown-版本')
      // .waitUntilTextExists('#notice-bar', '系统通知：维度选择')
      .getText('.library-rightpanel')
      .then(function (rightpanel) {
        expect(rightpanel).to.be.an('array');
      })
      .click('#library-dropdown1')
      .click('#library-dropdown-全部')
      .pause(1000)
      .waitUntilTextExists('#notice-bar', 'CSV文件读取成功')
      .getText('.library-rightpanel')
      .then(function (rightpanel) {
        expect(rightpanel).to.be.an('array');
      })
    // 2.3、点击远程，获取远程文件
      .click('#library-dropdown')
      .click('#library-file-远程')
      .pause(1000)
      .click('.library-leftlist')
      .pause(1000)
      .getText('.library-rightpanel')
      .then(function (rightpanel) {
        expect(rightpanel).to.be.an('array');
      })
      .click('#library-up')
      .getText('.library-rightpanel')
      .then(function (rightpanel) {
        expect(rightpanel).to.be.an('array');
      })
      .click('#library-down')
      .getText('.library-rightpanel')
      .then(function (rightpanel) {
        expect(rightpanel).to.be.an('array');
      })
      .click('#library-doc-down')
      .pause(1000)
      .waitUntilTextExists('#notice-bar', '文件保存成功！', 5000)
      .click('#library-edit')
      .getText('#edit-editbar-input')
      .then(function (editText) {
        expect(editText).to.equal('')
      })
      // // .pause(3000)
      .click('#edit-leftbar-back')
      .click('#library-right-dimension-time')
      .click('#library-td-time-tr1')
      .pause(1000)
      .getText('.library-rightpanel')
      .then(function (rightpanel) {
        expect(rightpanel).to.be.an('array');
      })
      .click('#library-right-dimension-version')
      .click('#library-td-version-tr2')
      .getText('.library-rightpanel')
      .then(function (rightpanel) {
        expect(rightpanel).to.be.an('array');
      })
      .click('#library-block-file')
  })
});
