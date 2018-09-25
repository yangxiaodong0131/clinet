<template>
  <div id="edit-rightpaneldoc-doc" style="marginBottom: 5px">
    <div class="card">
      <div>
        <table v-if="!rightFolds.includes('病案参考')">
          <tr v-on:dblclick="fold(title)">
            <th colspan="10" class="table-info"> 
              <span v-if="doc.length === 0" style="float: left; paddingLeft: 5px">病案参考无内容！</span>
              <span v-else style="float: left; paddingLeft: 10px">{{title}}</span>
              <a href="#" v-on:click="close('病案参考')" style="float: right">✖</a>
              <a v-if="doc.length !== 0" href="#" v-on:click="fold('病案参考')" style="float: right; marginRight: 3px">↗</a>
            </th>
          </tr>
        </table>
        <table v-if="rightFolds.includes('病案参考')">
          <tr v-on:dblclick="fold(title)">
            <th colspan="10" class="table-info"> {{title}}
              <a href="#" v-on:click="close('病案参考')" style="float: right">✖</a>
              <a href="#" v-on:click="fold('病案参考')" style="float: right; marginRight: 5px">↙</a>
            </th>
          </tr>
          <tr style="textAlign: center"><a href="#" v-on:click="fold('病案参考')">...</a></tr>
        </table>
      </div>
      <div v-if="!rightFolds.includes('病案参考')" class="card-body" v-for="(section, key) of doc" v-bind:key='key'>
        <!-- 个人信息 -->
        <div>
          <table v-if="key.split(',')[1] === '个人信息'">
            <tr class="table-warning" v-bind:class="{'table-danger':flag == key.split(',')[0]}" v-on:click="changeIndex(key, '', true)"><td colspan="4">{{key.split(',')[1]}}</td></tr>
            <tr rowspan="2" v-for="(item, index) in section" v-bind:key='index' v-bind:class="{'table-danger':flag == item[0]}" v-on:click="changeIndex(item, key)">
              <td style="width: 25%" rowspan="2" v-if="index % 2 === 0"><b>{{ item[1] }}</b></td>
              <td style="width: 25%" rowspan="2" v-if="index % 2 === 0" v-on:dblclick="addItem(item, index)">{{ item[2] }}{{ item[3] }}{{ item[4] }}{{ item[5] }}{{ item[6] }}{{ item[7] }}{{ item[8] }}</td>
              <td style="width: 25%" v-if="index % 2 !== 0"><b>{{ item[1] }}</b></td>
              <td style="width: 25%" v-if="index % 2 !== 0" v-on:dblclick="addItem(item, index)">{{ item[2] }}{{ item[3] }}{{ item[4] }}{{ item[5] }}{{ item[6] }}{{ item[7] }}{{ item[8] }}</td>
            </tr>
          </table>
          <!-- 未定义-主诉-病史-体格检查-辅助检查-处理意见 -->
          <table v-else-if="['主诉', '病史', '现病史', '既往史', '家族史', '个人史', '月经史', '婚育史', '家庭史', '遗传史', '体格检查', '辅助检查', '处理意见'].includes(key.split(',')[1])">
            <tr class="table-warning" v-bind:class="{'table-danger':flag == key.split(',')[0]}" v-on:click="changeIndex(key, '', true)"><td>{{key.split(',')[1]}}</td></tr>
            <tr><td>
              <ol class="breadcrumb" >
                <li class="breadcrumb-item" v-for="(item, index) in section" v-bind:key='index' v-bind:class="{'table-danger':flag == item[0]}" v-on:click="changeIndex(item, key)">
                  <b v-on:dblclick="addItem(item, index)">{{ item[1] }}</b>
                  ：{{ item[2] }} {{ item[3] }} {{ item[4] }} {{ item[5] }} {{ item[6] }} {{ item[7] }} {{ item[8] }}
                </li>
                <hr>
              </ol>
            </td></tr>
          </table>
          <!-- 医嘱 -->
          <table v-else-if="key.split(',')[1] === '医嘱'">
            <tr class="table-warning" v-bind:class="{'table-danger':flag == key.split(',')[0]}" v-on:click="changeIndex(key, '', true)"><td>{{key.split(',')[1]}}</td></tr>
            <tr v-for="(item, index) in section" v-bind:key='index' v-bind:class="{'table-danger':flag == item[0]}">
              <td v-on:click="changeIndex(item, key)" v-on:dblclick="addItem(item, index)"><b>{{ item[1] }}</b>
                {{ item[2] }}  {{ item[3] }}  {{ item[4] }}
                {{ item[5] }}  {{ item[6] }}  {{ item[7] }}  {{ item[8] }}
              </td>
            </tr>
          </table>
          <!-- 检查/检验结果 -->
          <table v-else-if="key.split(',')[1] === '检验结果'">
          </table>
          <!-- 签名-日期 -->
          <table v-else-if="key.split(',')[1] === '签名'">
            <tr v-for="(item, index) in section" v-bind:key='index' v-bind:class="{'table-danger':flag == item[0]}">
              <td class="text-right" v-bind:class="{'table-info':index == 0}" v-on:click="changeIndex(item, key)">
                <b v-on:dblclick="addItem(item, index)">{{ item[1] }}</b>
                {{ item[2] }}  {{ item[3] }}  {{ item[4] }}
                {{ item[5] }}  {{ item[6] }}  {{ item[7] }}  {{ item[8] }}
              </td>
            </tr>
          </table>
          <!-- 初步诊断或印象诊断-医师签名 -->
          <table v-else-if="['初步诊断或印象诊断', '医师签名'].includes(key.split(',')[1])">
            <tr class="table-warning" v-bind:class="{'table-danger':flag == key.split(',')[0]}" v-on:click="changeIndex(key, '', true)"><td><span style="float: right">{{key.split(',')[1]}}</span></td></tr>
            <tr><td>
              <ol class="breadcrumb" >
                <li class="breadcrumb-item" v-for="(item, index) in section" v-bind:key='index' v-bind:class="{'table-danger':flag == item[0]}" v-on:click="changeIndex(item, key)">
                  <b style="float: right" v-on:dblclick="addItem(item, index)">{{ item[1] }}</b>
                  <span style="float: right">：{{ item[2] }} {{ item[3] }} {{ item[4] }} {{ item[5] }} {{ item[6] }} {{ item[7] }} {{ item[8] }}</span>
                </li>
                <hr>
              </ol>
            </td></tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import editDoc from '../../utils/EditDoc'
  export default {
    computed: {
      title: {
        get() {
          const x = '病案参考'
          return x
        }
      },
      flag: {
        get() {
          // const doc = this.$store.state.Edit.doc
          // const key = doc[this.$store.state.Edit.docIndex]
          // if (key) {
          //   return key[0]
          // }
          return this.$store.state.Edit.docShowIndex
        }
      },
      doc: {
        get() {
          const doc = this.$store.state.Edit.docShow
          const systemSection = this.$store.state.System.systemSection
          const doc1 = editDoc(doc, systemSection)
          return doc1
        }
      },
      rightFolds: {
        get() {
          return this.$store.state.Edit.rightFolds
        }
      }
    },
    methods: {
      onClick: function (v) {
        const value = v.concat()
        const index = value.shift(0)
        this.$store.commit('EDIT_SET_BAR_VALUE', value)
        this.$store.commit('EDIT_SET_DOC_SHOW_INDEX', [index, 'set']);
        document.getElementById('edit-editbar-input').focus()
      },
      onDblClick: function (v) {
        const value = v.concat()
        const index = value.shift(0)
        this.$store.commit('EDIT_SET_BAR_VALUE', value)
        this.$store.commit('EDIT_SET_DOC_SHOW_INDEX', [index, 'set']);

        const n = this.$store.state.Edit.docIndex
        this.$store.commit('EDIT_UPDATE_DOC', [n, value]);
        this.$store.commit('EDIT_SET_DOC_INDEX', [1]);
      },
      addSection: function (key) {
        const n = this.$store.state.Edit.docIndex
        this.$store.commit('EDIT_UPDATE_DOC', [n, [key]]);
        this.$store.commit('EDIT_SET_DOC_INDEX', [1]);
      },
      fold(data) {
        this.$store.commit('EDIT_SET_RIGHT_FOLDS', data);
      },
      close(data) {
        this.$store.commit('EDIT_DELETE_RIGHT_PANELS', data);
      },
      changeIndex: function (v, section, isSect = false) {
        if (isSect) { v = v.split(',') }
        const value = v.concat()
        const index = value.shift(0)
        this.$store.commit('EDIT_SET_BAR_VALUE', value)
        this.$store.commit('EDIT_SET_DOC_SHOW_INDEX', [parseInt(index, 10), 'set']);
        document.getElementById('edit-editbar-input').focus()
        if (section !== undefined) {
          this.$store.commit('EDIT_SET_SECTION', section.split(',')[1])
        }
      },
      addItem: function (item, index) {
        const value = `${index} ${item}`
        this.$store.commit('EDIT_SET_BAR_VALUE', value)

        const n = this.$store.state.Edit.docIndex
        this.$store.commit('EDIT_UPDATE_DOC', [n, [item[1], item[2]]]);
        this.$store.commit('EDIT_SET_DOC_INDEX', [1]);
      },
    },
  };
</script>

<style scoped>
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  .breadcrumb > li + li:before {
    color: #CCCCCC;
    content: "  ";
    padding: 0 5px;
  }
</style>
