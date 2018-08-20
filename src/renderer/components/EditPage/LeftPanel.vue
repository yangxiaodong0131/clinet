<template>
  <div id="edit-leftpanel">
    <left-bar></left-bar>
    <left-panel-doc></left-panel-doc>
  </div>
</template>

<script>
  import LeftBar from './LeftBar';
  import LeftPanelDoc from './LeftPanelDoc';
  export default {
    components: { LeftBar, LeftPanelDoc },
    data() {
      return {
        flag: ''
      };
    },
    computed: {
      leftPanel: {
        get() {
          return this.$store.state.Edit.leftPanel
        }
      }
    },
  };
</script>

<style scoped>
  * {
    padding: 0;
    margin: 0;
    margin-bottom: 70px;
  }

</style>
