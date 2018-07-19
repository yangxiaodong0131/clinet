import utils from '../utils';

describe('System_3', function () {
  beforeEach(utils.beforeEach);
  afterEach(utils.afterEach);

  it('System-测试3', function () {
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
    // 2.2、DRG分组服务，获取本地病案数据
      .click('#navbar-system')
      .click('#navbar-system-compdrg')
      .click('.server-leftpanel')
      .pause(3000)
      // .getText('#notice-bar')
      // .then(function (value) {
      //   expect(value).to.equal('系统通知：CSV文件读取成功！')
      // })
      .waitUntilTextExists('#notice-bar', '系统通知：CSV文件读取成功！')
      .getText('.server-drg-rightpanel-local-tr')
      .then(function (rightpanel) {
        expect(rightpanel).to.be.an('array');
      })
    // 2.2.1、前页
      .click('#server-drg-previous')
      .getText('.server-drg-rightpanel-local-tr')
      .then(function (rightpanel) {
        expect(rightpanel).to.be.an('array');
      })
    // 2.2.2、后页
      .click('#server-drg-next')
      .getText('.server-drg-rightpanel-local-tr')
      .then(function (rightpanel) {
        expect(rightpanel).to.be.an('array');
      })
    // // 2.3、点击服务器病案数据
    //   .click('#server-drg-sercase-data')
    //   .getText('.server-drg-rightpanel-local-tr')
    //   .then(function (rightpanel) {
    //     expect(rightpanel).to.be.an('array');
    //   })
    // // 2.3.1、前页
    //   .click('#server-drg-previous')
    //   .getText('.server-drg-rightpanel-local-tr')
    //   .then(function (rightpanel) {
    //     expect(rightpanel).to.be.an('array');
    //   })
    // // 2.3.2、后页
    //   .click('#server-drg-next')
    //   .getText('.server-drg-rightpanel-local-tr')
    //   .then(function (rightpanel) {
    //     expect(rightpanel).to.be.an('array');
    //   })
  })
});
