<template>
  <div>
    <div class="row">
      <div class="col-md-6 border border-secondary rounded pre-scrollable">
        全部指标
        <div class="row">
          <table class="col-md-4 text-center">
            <tr class="border border-secondary" v-for="(data, index) in this.$store.state.System.targetList" v-bind:class="{'bg-primary': flag.a === index}" v-bind:key="index" v-on:click="target(data, index)">{{data}}</tr>
          </table>
          <table class="col-md-3">
            <tr class="border border-secondary" v-for="(data, index) in this.$store.state.System.targetIndex" v-bind:class="{'bg-primary': flag.b === index}" v-bind:key="index" v-on:click="addTarget(data, index)">
              {{data}}
            </tr>
          </table>
          <table class="col-md-5">
            <tr class="border border-secondary" v-for="(data, index) in this.$store.state.System.targetKey" v-bind:class="{'bg-primary': flag.c === index}" v-bind:key="index">
              {{data}} <a class="oi oi-plus" v-on:click="addTargetkey(data, index)"></a>
            </tr>
          </table>
        </div>
      </div>
        <div class="col-md-6 border border-secondary pre-scrollable rounded">
          自定义指标
          <table>
            <tr class="border border-secondary" v-for="(data, index) in this.$store.state.Stat.customindex" v-bind:key="index">{{data}}</tr>
          </table>
          <button type="button" class="btn btn-primary" v-on:click="custom()">保存</button>
        </div>
    </div>
  </div>
</template>

<script>
  import { sGetTarget, sGetTargetKey } from '../../utils/Server';
  import { sCustom } from '../../utils/StatServerFile';
  export default {
    data() {
      return {
        flag: {
          a: null,
          b: null,
          c: null
        }
      }
    },
    computed: {
      leftPanel: {
        get() {
          return this.$store.state.Stat.leftPanel
        }
      }
    },
    methods: {
      target: function (target, index) {
        this.flag.a = index
        this.flag.b = null
        this.flag.c = null
        sGetTarget(this, [this.$store.state.System.server, this.$store.state.System.port], target);
      },
      addTarget: function (value, index) {
        this.flag.b = index
        this.flag.c = null
        sGetTargetKey(this, [this.$store.state.System.server, this.$store.state.System.port], value, this.$store.state.System.user.username)
      },
      addTargetkey: function (value, index) {
        this.flag.c = index
        this.$store.commit('STAT_SET_CUSTOM_INDEX', value);
      },
      custom: function () {
        sCustom(this, [this.$store.state.System.server, this.$store.state.System.port], this.$store.state.Stat.customindex, this.$store.state.System.user.username)
      }
    },
  };
</script>

<style scoped>

</style>
