<template>
  <div>
    <div class="row">
        <div class="col-md-6 border border-secondary rounded">
          全部指标
          <div class="row">
            <table class="col-md-5">
              <tr v-for="(data, index) in this.$store.state.System.targetList" v-bind:key="index" v-on:click="target(data)">{{data}}</tr>
            </table>
            <table class="col-md-7">
              <tr v-for="(data, index) in this.$store.state.System.targetIndex" v-bind:key="index">
                <h5>{{data}} <a class="oi oi-check" v-on:click="addTarget(data)"></a> </h5>
              </tr>
            </table>
          </div>
        </div>
        <div class="col-md-6 border border-secondary rounded">
          <ul class="nav">
            <li class="nav-item">
              <a class="nav-link active" href="#">自定义指标</a>
            </li>
          </ul>
          <table>
            <tr v-for="(data, index) in this.$store.state.Stat.customindex" v-bind:key="index">{{data}}</tr>
          </table>
          <button type="button" class="btn btn-primary" v-on:click="custom()">保存</button>
        </div>
    </div>
  </div>
</template>

<script>
  import { sGetTarget } from '../../utils/Server';
  import { sCustom } from '../../utils/StatServerFile';
  export default {
    computed: {
      leftPanel: {
        get() {
          return this.$store.state.Stat.leftPanel
        }
      }
    },
    methods: {
      target: function (target) {
        sGetTarget(this, [this.$store.state.System.server, this.$store.state.System.port], target);
      },
      addTarget: function (addTarget) {
        // sCustom(this, [this.$store.state.System.server, this.$store.state.System.port], addTarget)
        this.$store.commit('STAT_SET_CUSTOM_INDEX', addTarget)
      },
      custom: function () {
        sCustom(this, [this.$store.state.System.server, this.$store.state.System.port], this.$store.state.Stat.customindex, this.$store.state.System.user.username)
      }
    },
  };
</script>

<style scoped>

</style>
