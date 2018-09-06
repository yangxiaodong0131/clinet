<template>
  <div>
    <nav-bar></nav-bar>
    <main>
      <div class="row">
        <div class="col-12">
          <right-bar></right-bar>
        </div>
        <div class="col-2">
          <left-panel></left-panel>
        </div>
        <div class="col-10">
          <right-panel></right-panel>
        </div>
      </div>
    </main>
    <notice-bar></notice-bar>
  </div>
</template>
<script>
  import NavBar from './HomePage/NavBar';
  import RightBar from './LibraryPage/RightBar';
  import LeftPanel from './LibraryPage/LeftPanel';
  import RightPanel from './LibraryPage/RightPanel';
  import NoticeBar from './HomePage/NoticeBar';

  export default {
    name: 'library-page',
    components: { NavBar, LeftPanel, RightPanel, NoticeBar, RightBar },
  };
</script>

<style>
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: '黑体';
  }

</style>
