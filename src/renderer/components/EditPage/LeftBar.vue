<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-primary sticky-top">
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#edit-leftbar-nav" aria-controls="edit-leftbar-nav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="edit-leftbar-nav">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle text-light" href="#" id="edit-leftbar-choice" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" >
            {{docType}}
          </a>
          <div class="dropdown-menu" id="edit-leftbar-sel" aria-labelledby="edit-leftbar-choice">
            <a v-for="(data, index) in docTypes" v-bind:key='index' class="dropdown-item" href="#" v-on:click="newDoc(data)"  v-bind:id="'edit-leftbar-'+data">{{data}}</a>
            <div class="dropdown-divider"></div>
          </div>
        </li>
        <li class="nav-item" id="edit-leftbar-newdoc1" v-on:click="show()">
          <a class="nav-link text-light" href="#" v-if="this.$store.state.Edit.leftPanel == 'table'">编辑</a>
        </li>
        <!-- <li class="nav-item" id="edit-leftbar-cache" v-on:click="saveDoc()">
          <a class="nav-link text-light" href="#">缓存</a>
        </li> -->
        <li class="nav-item" id="edit-leftbar-newdoc2" v-on:click="save('保存病案')">
          <a class="nav-link text-light" href="#">保存</a>
        </li>
        <li class="nav-item" id="edit-leftbar-newdoc3" v-on:click="save('保存模板')">
          <a class="nav-link text-light" href="#" v-if="this.$store.state.System.user.login">另存为模板</a>
        </li>
      </ul>
      <form class="form-inline my-2 my-lg-0" v-on:submit.prevent>
        <input class="form-control mr-sm-2" type="search" placeholder="模糊查询" aria-label="Search" v-on:keyup.enter="leftEnter()" v-model="leftItem">
      </form>
    </div>
  </nav>
</template>

<script>
  import { saveEditDoc, newEditDoc } from '../../utils/EditOperation'
  // import { unSaveFile } from '../../utils/SaveFile'
  // import { getDocContent } from '../../utils/EditServerFile'
  export default {
    data() {
      return {
        // name: this.$route.name,
        leftItem: '',
        docType: '自定义文档',
      };
    },
    computed: {
      fileName: {
        get() {
          return this.$store.state.Edit.fileName
        }
      },
      docTypes: {
        get() {
          return this.$store.state.Edit.docTypes
        }
      },
    },
    methods: {
      show() {
        document.getElementById('edit-editbar-input').focus()
      },
      newDoc: function (n) {
        newEditDoc(this, n)
      },
      save: function (data) {
        saveEditDoc(this, data)
      },
      leftEnter(e) {
        const doc = this.$store.state.Edit.doc
        const indexArr = []
        doc.map((x) => {
          indexArr.push(x.indexOf(e.target.value))
          const index1 = indexArr.indexOf(0)
          if (index1 > -1) {
            this.$store.commit('EDIT_SEARCH_DOC_INDEX', index1);
            this.$store.commit('SET_NOTICE', '')
          } else {
            this.$store.commit('SET_NOTICE', '未查找到，请输入正确内容！')
            this.$store.commit('EDIT_SET_HINT_TYPE', 'notice');
          }
          return index1
        })
        this.leftItem = ''
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
  #edit-leftbar-nav {
    background-image: linear-gradient(to right , #4772fe, #7997fa);
  }
  .nav-link {
    color:#ffffff;
  }
</style>
