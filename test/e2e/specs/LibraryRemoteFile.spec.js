import utils from '../utils';

describe('LibraryRemoteFile', function () {
  beforeEach(utils.beforeEach);
  afterEach(utils.afterEach);

  it('Library-远程文件测试', function () {
    this.timeout(20000)
    // 1、点击login页面的login-button
    return this.app.client.click('#login')
    // 等待底部通知框出现'未注册用户登陆！'提示，进入Home页
      .waitUntilTextExists('#notice-bar', '系统通知：未注册用户可以直接登陆！使用单机版功能！用户注册可以选择远程服务或者区块链服务！')
    // 2、点击顶部导航栏的navbar-libary，进入libary页
      .click('#navbar-library')
      .waitUntilTextExists('#notice-bar', '术语字典-术语字典')

    // ########### 远程文件操作 ###########
    // 2.1.6、点击工具栏的远程文件(library-file-远程)，左列表显示远程数据文件
      .click('#library-dropdown')
      .click('#library-file-远程')
      .click('#navbar-system')
      .click('#navbar-system-server')
      .click('#server-user-setup')
      .setValue('#server-username', 'test@test.com.cn')
      .setValue('#server-password', '123456')
      .click('#server-login')
      .pause(1000)
      .click('#navbar-library')
      .click('#library-dropdown')
      .click('#library-file-远程')
      .getText('.library-leftlist')
      .then(function (leftlist) {
        expect(leftlist).to.be.an('array');
      })
    // 2.1.6.1、点击左侧列表(library-leftlist)，读取数据文件内容，右侧表中显示所选远程文件内容
      .click('.library-leftlist')
      .pause(1000)
      .getHTML('.library-rightpanel')
      .then(function (rightpanel) {
        expect(rightpanel).to.be.an('array');
      })
      .pause(1000)
    // 点击下载按钮、、
      .click('#library-doc-down')
      .pause(1000)
      .getText('#notice-bar')
      .then(function (rightpanel) {
        console.log(rightpanel)
        expect(rightpanel).to.equal('系统通知：文件「mdc.csv」保存成功！');
      })
      .pause(1000)
    // 2.1.7.1.1、点击表中一行（例：第四行），当前行高亮显示
    // 2.1.7.2、点击工具栏的后一页(library-down)，右侧表中显示下一页内容第四行高亮并提示：翻页成功！table底部页数加一，提示翻页成功，若加一后页数大于当前总页数，提示：当前已经是最后一页！
      .click('#library-down')
      .getHTML('.library-rightpanel')
      .then(function (rightpanel) {
        expect(rightpanel).to.be.an('array');
      })
    // 2.1.7.3、点击工具栏的前一页(library-up)，右侧表中显示上一页内容第四行高亮并提示：翻页成功！table底部页数减一，提示翻页成功，若减一后页数小于0，提示：当前已经是第一页！
      .click('#library-up')
      .getHTML('.library-rightpanel')
      .then(function (rightpanel) {
        expect(rightpanel).to.be.an('array');
      })
    // 2.1.7.4、点击工具栏的编辑数据(remote-file)，进入编辑页面，编辑页面右侧显示当前数据，左侧显示第四行高亮的内容（传入id到编辑页面用于返回）
      .click('#library-edit')
      .getText('#edit-editbar-input')
      .then(function (editText) {
        expect(editText).to.equal('');
      })
      .click('#edit-leftbar-back')
      // .waitUntilTextExists('#notice-bar', '选择的不是CSV文件，不能导入！')
    // // 2.1.8、点击维度选择(library-dropdown)，显示维度下拉选项
    // // 2.1.8.1、工具栏的维度选择-机构(library-org)，左侧列表显示当前数据内所有机构，提示：机构维度选择成功，若机构列无内容，提示：无机构维度！
      .click('.library-leftlist')
      .click('#library-right-dimension-time')
      .click('#library-td-time-tr1')
      .pause(1000)
      .getText('.library-rightpanel')
      .then(function (leftlist) {
        expect(leftlist).to.be.an('array');
      })
      .click('.library-leftlist')
      .click('#library-right-dimension-version')
      .click('#library-td--version-tr2')
      .pause(1000)
      .getText('.library-rightpanel')
      .then(function (leftlist) {
        expect(leftlist).to.be.an('array');
      })
      .click('#library-hd-asc0')
      .click('#library-hd-asc1')
      .getText('.library-rightpanel')
      .then(function (leftlist) {
        expect(leftlist).to.be.an('array');
      })
      .click('#library-hd-desc0')
      .click('#library-hd-desc1')
      .getText('.library-rightpanel')
      .then(function (leftlist) {
        expect(leftlist).to.be.an('array');
      })
    //   .getText('#library-dropdown-全部')
    //   .then(function (org) {
    //     expect(org).to.equal('');
    //   })
    // // 2.1.8.1.1、点击左侧列表(library-leftlist)，右侧表中显示所选机构的对应数据，若右侧表中无数据显示，提示：未找到对应数据！
    //   .click('.library-leftlist')
    //   .getText('.library-rightpanel')
    //   .then(function (leftlist) {
    //     expect(leftlist).to.be.an('array');
    //   })
    // // 2.1.8.2、工具栏的维度选择-时间(library-dropdown-年份)，左侧列表显示当前数据内所有时间，提示：时间维度选择成功，若时间列无内容，提示：无时间维度！
    //   .click('#library-dropdown1')
    //   .click('#library-dropdown-年份')
    //   .getText('#library-dropdown-年份')
    //   .then(function (time) {
    //     expect(time).to.equal('');
    //   })
    // // 2.1.8.2.1、点击左侧列表(library-leftlist)，右侧表中显示所选时间的对应数据，若右侧表中无数据显示，提示：未找到对应数据！
    // // 2.1.8.3、工具栏的维度选择-版本(library-dropdown-版本)，左侧列表显示当前数据内所有版本，提示：版本维度选择成功，若版本列无内容，提示：无版本维度！
    //   .click('#library-dropdown1')
    //   .click('#library-dropdown-版本')
    //   .getText('#library-dropdown-版本')
    //   .then(function (version) {
    //     expect(version).to.equal('');
    //   })
    // // 2.1.8.3.1、点击左侧列表(library-leftlist)，右侧表中显示所选版本的对应数据，若右侧表中无数据显示，提示：未找到对应数据！
    // // 2.1.8.4、点击表中任意一列
    // // 2.1.8.5、点击添加列维度，左侧列表显示选中列中的内容（去重），若选中列无内容，提示维度内容为空不可添加！
    //   .click('#library-dropdown1')
    //   .click('#library-dropdown-版本')
    //   .getText('#library-dropdown-版本')
    //   .then(function (version) {
    //     expect(version).to.equal('');
    //   })
  })
});

