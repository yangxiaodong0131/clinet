const echarts = require('echarts');
export default function chartRadar(id, opt = null) {
  let option = {
    xAxis: {
      type: 'category',
      data: []
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: [],
      type: 'bar'
    }]
  }
  const myChart = echarts.init(document.getElementById(id));
  if (opt) {
    // 取得表头并删除前两位
    const th = Object.keys(opt[0])
    const keys = Object.keys(opt[0])
    // 判断是否存在drg2字段
    let drg2 = false
    if (th.includes('drg2') || th.includes('病种')) {
      th.splice(0, 3)
      drg2 = true
    } else {
      th.splice(0, 2)
      drg2 = false
    }
    const data = []
    const legendData = []
    const indicator = []
    // 删除表头
    const stat = opt
    // stat.shift()
    // 取得每个维度的最大值
    const max = th.map(v => stat[0][v])
    // 取得每个维度的最大值
    stat.forEach((s) => {
      th.forEach((v, i) => {
        if (s[v] > max[i]) {
          max[i] = s[v]
        }
      })
    })
    // 取得图设置的indicator字段
    max.forEach((v, i) => {
      indicator.push({ max: v, name: th[i] })
    })
    // 生成图的其他字段
    stat.forEach((v) => {
      let name = ''
      if (keys.includes('org') && keys.includes('time') && drg2) {
        name = `${v.org} ${v.time} ${v.drg2}`
      } else if (keys.includes('机构') && keys.includes('时间') && drg2) {
        name = `${v.机构} ${v.时间} ${v.病种}`
      } else if (keys.includes('org') && keys.includes('time')) {
        name = `${v.org} ${v.time}`
      } else if (keys.includes('year_time')) {
        name = `${v.year_time}`
      } else {
        name = `${v.机构} ${v.时间}`
      }
      const value = []
      th.forEach((y) => {
        value.push(v[y])
      })
      legendData.push(name)
      data.push({ value: value, name: name })
    })
    // 基于准备好的dom，初始化echarts实例
    // 指定图表的配置项和数据
    option = {
      tooltip: {},
      legend: {
        type: 'scroll',
        width: '80%',
        data: legendData
      },
      toolbox: {
        show: true,
        orient: 'horizontal',
        x: 'right',
        y: 'top',
        color: ['#1e90ff', '#22bb22', '#4b0082', '#d2691e'],
        backgroundColor: 'rgba(0,0,0,0)',
        borderColor: '#ccc',
        borderWidth: 0,
        padding: 5,
        feature: {
          dataView: {
            show: true,
            title: '数据视图',
            readOnly: false,
            lang: ['数据视图', '关闭', '刷新']
          },
          saveAsImage: {
            show: true,
            title: '保存为图片',
            type: 'png',
            lang: ['点击保存']
          }
        }
      },
      radar: {
        name: {
          textStyle: {
            color: '#fff',
            backgroundColor: '#999',
            borderRadius: 3,
            padding: [3, 5]
          }
        },
        indicator: indicator
      },
      series: [{
        type: 'radar',
        data: data
      }]
    };
  }
  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option, true);
}
